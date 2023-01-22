export class BeHive extends HTMLElement {
    #monitor;
    constructor() {
        super();
        this.registeredBehaviors = {};
        this.refs = {};
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
        const { IDMonitor } = await import('./IDMonitor.js');
        this.#monitor = new IDMonitor(this);
    }
    disconnectedCallback() {
        if (this.#monitor !== undefined) {
            this.#monitor.dispose();
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
            const { registeredBehaviors, refs } = parentBeHiveInstance;
            for (const key in registeredBehaviors) {
                this.register(registeredBehaviors[key]);
            }
            parentBeHiveInstance.addEventListener('latest-behavior-changed', (e) => {
                this.register(e.detail.value);
            });
            for (const id in refs) {
                this.define(refs[id], true);
            }
            parentBeHiveInstance.addEventListener('new-ref', (e) => {
                this.define(e.detail.value, true);
            });
        }
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
        return newBehaviorEl;
    }
    define(ref, noReplace) {
        if (noReplace) {
            if (this.refs[ref.element.id] !== undefined)
                return;
        }
        this.refs[ref.element.id] = ref;
        this.dispatchEvent(new CustomEvent('new-ref', {
            detail: {
                value: ref,
            },
        }));
    }
    get(id) {
        return this.refs[id];
    }
    whenDefined(id) {
        return new Promise(resolve => {
            const ref = this.get(id);
            if (ref !== undefined) {
                resolve(ref);
                return;
            }
            this.addEventListener('new-ref', e => {
                const ref = e.detail.value;
                if (ref.element.id === id)
                    resolve(ref);
            }, { once: true });
        });
    }
}
if (!customElements.get('be-hive')) {
    customElements.define('be-hive', BeHive);
}
