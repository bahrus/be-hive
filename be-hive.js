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
        this.registeredBehaviors[localName] = instance;
        const newBehaviorEl = document.createElement(localName);
        newBehaviorEl.setAttribute('if-wants-to-be', instance.ifWantsToBe);
        newBehaviorEl.setAttribute('upgrade', instance.upgrade);
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
export function register(ifWantsToBe, upgrade, extTagName) {
    const beHive = document.querySelector(tagName);
    if (beHive !== null) {
        customElements.whenDefined(tagName).then(() => {
            beHive.register({
                ifWantsToBe,
                upgrade,
                localName: extTagName,
            });
        });
    }
    else {
        document.head.appendChild(document.createElement(extTagName));
    }
}
