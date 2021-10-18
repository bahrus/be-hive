import { XE } from 'xtal-element/src/XE.js';
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
                const instance = registeredBehaviors[key];
                this.register(instance);
            }
            parentBeHiveInstance.addEventListener('latest-behavior-changed', (e) => {
                this.register(e.detail.value);
            });
        }
    }
    onOverrides({ overrides }) {
        const rn = this.getRootNode();
        const host = rn.host;
        if (!rn.host)
            return;
        const parentRn = rn.host.getRootNode();
        const hive = { ...parentRn[Symbol.for('be-hive')], ...overrides };
        for (const key in hive) {
            const el = document.createElement(key);
            el.setAttribute('if-wants-to-be', hive[key]);
            rn.appendChild(el);
        }
    }
    register(instance) {
        const localName = instance.localName;
        if (this.overrides[instance.localName] !== undefined)
            return;
        this.registeredBehaviors[localName] = instance;
        const newBehaviorEl = document.createElement(localName);
        this.appendChild(newBehaviorEl);
        this.latestBehavior = instance;
    }
}
const tagName = 'be-hive';
const xe = new XE({
    config: {
        tagName,
        propDefaults: {
            overrides: {},
            isC: true,
        },
        propInfo: {
            latestBehavior: {
                notify: {
                    dispatch: true,
                }
            }
        },
        actions: {
            intro: {
                ifAllOf: ['isC'],
            },
            onOverrides: {
                ifAllOf: ['overrides']
            }
        },
        style: {
            display: 'none',
        }
    },
    superclass: BeHiveCore
});
export const BeHive = xe.classDef;
