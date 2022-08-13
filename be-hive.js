import { CE } from 'trans-render/lib/CE.js';
export class BeHiveCore extends HTMLElement {
    registeredBehaviors = {};
    intro({}) {
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
    onOverrides({ overrides }) {
        for (const key in overrides) {
            this.register(overrides[key]);
        }
    }
    register(parentInstance) {
        const parentInstanceLocalName = parentInstance.localName;
        //if(this.overrides[parentInstanceLocalName] !== undefined) return;
        if (this.querySelector(parentInstanceLocalName) !== null)
            return;
        this.registeredBehaviors[parentInstanceLocalName] = parentInstance;
        const newBehaviorEl = document.createElement(parentInstanceLocalName);
        newBehaviorEl.setAttribute('if-wants-to-be', parentInstance.ifWantsToBe);
        newBehaviorEl.setAttribute('upgrade', parentInstance.upgrade);
        this.appendChild(newBehaviorEl);
        this.latestBehavior = parentInstance;
        return newBehaviorEl;
    }
    onLatestBehavior({ latestBehavior }) {
        this.dispatchEvent(new CustomEvent('latest-behavior-changed', {
            detail: {
                value: latestBehavior,
            }
        }));
    }
}
const tagName = 'be-hive';
const ce = new CE({
    config: {
        tagName,
        propDefaults: {
            overrides: {},
            isC: true,
        },
        actions: {
            intro: {
                ifAllOf: ['isC'],
            },
            onOverrides: {
                ifAllOf: ['overrides']
            },
            onLatestBehavior: 'latestBehavior'
        },
        style: {
            display: 'none',
        }
    },
    superclass: BeHiveCore
});
export const BeHive = ce.classDef;
