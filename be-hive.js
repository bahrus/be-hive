import 'be-enhanced/beEnhanced.js';
export class BeHive extends HTMLElement {
    constructor() {
        super();
        this.registeredBehaviors = {};
    }
    async connectedCallback() {
        this.hidden = true;
        const overridesAttr = this.getAttribute('overrides');
        if (overridesAttr !== null) {
            this.overrides = JSON.parse(overridesAttr);
        }
        else {
            this.overrides = {};
        }
        this.#getInheritedBehaviors();
        this.#addMutationObserver();
    }
    disconnectedCallback() {
        if (this.#mutationObserver !== undefined) {
            this.#mutationObserver.disconnect();
        }
    }
    #getInheritedBehaviors() {
        const rn = this.getRootNode();
        const host = rn.host;
        if (!host)
            return;
        const parentShadowRealm = host.getRootNode();
        const parentBeHiveInstance = parentShadowRealm.querySelector('be-hive');
        if (parentBeHiveInstance !== null) {
            const { registeredBehaviors } = parentBeHiveInstance;
            for (const key in registeredBehaviors) {
                this.register(registeredBehaviors[key]);
            }
            parentBeHiveInstance.addEventListener('latest-behavior-changed', (e) => {
                this.register(e.detail.value);
            });
        }
    }
    #mutationObserver;
    #addMutationObserver() {
        const rn = this.getRootNode();
        const config = { attributes: true, childList: true, subtree: true };
        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.type === "childList") {
                    //console.log("A child node has been added or removed.");
                    for (const node of mutation.addedNodes) {
                        this.#inspectNewNode(node);
                    }
                    for (const node of mutation.removedNodes) {
                        const beEnhanced = node.beEnhanced;
                        if (beEnhanced === undefined)
                            continue;
                        for (const key in beEnhanced) {
                            const enhancement = beEnhanced[key];
                            const detach = enhancement['detach'];
                            if (typeof (detach) === 'function') {
                                const boundDetach = detach.bind(enhancement);
                                boundDetach(node);
                            }
                        }
                    }
                }
                else if (mutation.type === "attributes") {
                    const { target } = mutation;
                    this.#inspectNewNode(target);
                    //console.log(`The ${mutation.attributeName} attribute was modified.`);
                }
            }
        };
        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);
        observer.observe(rn, config);
        this.#mutationObserver = observer;
    }
    #inspectNewNode(node) {
        if (!(node instanceof Element))
            return;
        const { beEnhanced } = node;
        const { registeredBehaviors } = this;
        for (const key in registeredBehaviors) {
            const registeredBehavior = registeredBehaviors[key];
            const { upgrade } = registeredBehavior;
            if (!node.matches(upgrade))
                continue;
            const namespacedName = beEnhanced.getFQName(key);
            if (namespacedName === undefined)
                continue;
            beEnhanced.attachAttr(namespacedName, key);
        }
    }
    // #getPreciseMatch(key: string, node: Element, allowNonNamespaced = true){
    //     if(allowNonNamespaced && node.matches(`[${key}]`)) return key;
    //     let testKey = `enh-by-${key}`;
    //     let test = `[${testKey}]`;
    //     if(node.matches(test)) return testKey;
    //     testKey = `data-enh-by-${key}`;
    //     test = `[${testKey}]`;
    //     if(node.matches(test)) return testKey;
    //     return undefined;
    // }
    #scanForSingleRegisteredBehavior(localName, behaviorKeys) {
        const { ifWantsToBe, upgrade } = behaviorKeys;
        const attr = `${upgrade}[${localName}],${upgrade}[enh-by-${localName}],${upgrade}[data-enh-by-${localName}]`;
        const rn = this.getRootNode();
        rn.querySelectorAll(attr).forEach(el => {
            const { beEnhanced } = el;
            const namespacedName = beEnhanced.getFQName(localName);
            if (namespacedName === undefined)
                return;
            beEnhanced.attachAttr(namespacedName, localName);
        });
    }
    async beatify(content) {
        const { beatify } = await import('./beatify.js');
        return await beatify(content, this);
    }
    register(parentInstance) {
        const parentInstanceLocalName = parentInstance.localName;
        if (this.querySelector(parentInstanceLocalName) !== null)
            return;
        const override = this.overrides[parentInstanceLocalName];
        let newInstanceTagName = parentInstanceLocalName;
        let newIfWantsToBe = parentInstance.ifWantsToBe;
        let newDisabled = parentInstance.disabled;
        if (override !== undefined) {
            const { ifWantsToBe, block, unblock } = override;
            if (block) {
                newDisabled = true;
            }
            else if (unblock) {
                newDisabled = false;
            }
            if (ifWantsToBe) {
                newIfWantsToBe = ifWantsToBe;
                newInstanceTagName = 'be-' + ifWantsToBe;
            }
        }
        const beSevered = this.hasAttribute('be-severed');
        if (beSevered)
            newDisabled = true;
        const newBehaviorEl = document.createElement('template');
        Object.assign(newBehaviorEl.dataset, {
            localName: parentInstanceLocalName,
            ifWantsToBe: newIfWantsToBe,
            upgrade: parentInstance.upgrade,
        });
        //parentInstanceLocalName
        // newBehaviorEl.setAttribute('if-wants-to-be', newIfWantsToBe);
        // newBehaviorEl.setAttribute('upgrade', parentInstance.upgrade);
        if (newDisabled)
            newBehaviorEl.setAttribute('disabled', '');
        this.appendChild(newBehaviorEl);
        const newRegisteredBehavior = {
            ...parentInstance,
            ifWantsToBe: newIfWantsToBe,
            disabled: newDisabled,
        };
        this.registeredBehaviors[parentInstanceLocalName] = newRegisteredBehavior;
        this.#scanForSingleRegisteredBehavior(parentInstanceLocalName, newRegisteredBehavior);
        //console.log({newRegisteredBehavior});
        this.dispatchEvent(new CustomEvent('latest-behavior-changed', {
            detail: {
                value: newRegisteredBehavior,
            }
        }));
        //this.latestBehaviors = [...this.latestBehaviors, newRegisteredBehavior];
        //this.#doSweepingScan();
        return newBehaviorEl;
    }
}
if (!customElements.get('be-hive')) {
    customElements.define('be-hive', BeHive);
}
