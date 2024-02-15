import 'be-enhanced/beEnhanced.js';
import { MountObserver } from 'mount-observer/MountObserver.js';
export class BeHive extends HTMLElement {
    constructor() {
        super();
        this.registeredBehaviors = {};
    }
    connectedCallback() {
        this.hidden = true;
        const overridesAttr = this.getAttribute('overrides');
        if (overridesAttr !== null) {
            this.overrides = JSON.parse(overridesAttr);
        }
        else {
            this.overrides = {};
        }
        this.#getInheritedBehaviors();
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
    #scanForSingleRegisteredBehavior(localName, behaviorKeys) {
        const { ifWantsToBe, upgrade, aspects } = behaviorKeys;
        const mo = new MountObserver({
            //on: `${upgrade}:not([data--ignore])`,
            on: upgrade,
            whereAttr: {
                hasRootIn: ['enh', 'data-enh', {
                        path: '',
                        context: 'BuiltIn'
                    }],
                hasBase: localName,
                hasBranchIn: aspects
            }
            // attribMatches: allAspects.map(x => ({
            //     names: [localName + x, `enh-by-${localName}` + x, `data-enh-by-${localName}` + x]
            // }) as AttribMatch)
        });
        mo.addEventListener('mount', e => {
            const { beEnhanced } = e.mountedElement;
            const namespacedName = beEnhanced.getFQName(localName);
            if (namespacedName === undefined)
                return;
            //console.log({namespacedName});
            beEnhanced.whenAttached(namespacedName);
        });
        const rn = this.getRootNode();
        mo.observe(rn);
    }
}
if (!customElements.get('be-hive')) {
    customElements.define('be-hive', BeHive);
}
