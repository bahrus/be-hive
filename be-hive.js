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
    register(instance) {
        const localName = instance.localName;
        if (this.overrides[instance.localName] !== undefined)
            return;
        if (this.querySelector(localName) !== null)
            return;
        this.registeredBehaviors[localName] = instance;
        const newBehaviorEl = document.createElement(localName);
        newBehaviorEl.setAttribute('if-wants-to-be', instance.ifWantsToBe);
        newBehaviorEl.setAttribute('upgrade', instance.upgrade);
        this.appendChild(newBehaviorEl);
        this.latestBehavior = instance;
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
