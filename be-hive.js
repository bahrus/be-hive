import '../be-enhanced/beEnhanced.js';
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
        this.#doSweepingScan();
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
    #addMutationObserver() {
    }
    #doSweepingScan() {
        const rn = this.getRootNode();
        const { registeredBehaviors } = this;
        console.log({ registeredBehaviors });
        const attrNames = Object.keys(registeredBehaviors).map(s => '[' + s + ']').join();
        console.log({ attrNames });
        if (attrNames.length === 0)
            return;
        rn.querySelectorAll(attrNames).forEach(el => {
            for (const key in registeredBehaviors) {
                const attr = '[' + key + ']';
                if (el.matches(attr)) {
                    console.log({ el });
                    const { beEnhanced } = el;
                    beEnhanced.attachAttr(key);
                }
            }
        });
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
        const newBehaviorEl = document.createElement(parentInstanceLocalName);
        newBehaviorEl.setAttribute('if-wants-to-be', newIfWantsToBe);
        newBehaviorEl.setAttribute('upgrade', parentInstance.upgrade);
        if (newDisabled)
            newBehaviorEl.setAttribute('disabled', '');
        this.appendChild(newBehaviorEl);
        const newRegisteredBehavior = {
            ...parentInstance,
            ifWantsToBe: newIfWantsToBe,
            disabled: newDisabled,
        };
        this.registeredBehaviors[parentInstanceLocalName] = newRegisteredBehavior;
        this.dispatchEvent(new CustomEvent('latest-behavior-changed', {
            detail: {
                value: newRegisteredBehavior,
            }
        }));
        //this.latestBehaviors = [...this.latestBehaviors, newRegisteredBehavior];
        this.#doSweepingScan();
        return newBehaviorEl;
    }
}
if (!customElements.get('be-hive')) {
    customElements.define('be-hive', BeHive);
}
