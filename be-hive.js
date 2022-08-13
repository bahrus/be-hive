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
    // onOverrides({overrides}: this){
    //     for(const key in overrides){
    //         this.register(overrides[key]);
    //     }
    // }
    register(parentInstance) {
        const parentInstanceLocalName = parentInstance.localName;
        if (this.querySelector(parentInstanceLocalName) !== null)
            return;
        const override = this.overrides[parentInstanceLocalName];
        let isRenamed = false;
        let newInstanceTagName = parentInstanceLocalName;
        let newIfWantsToBe = parentInstance.ifWantsToBe;
        if (override !== undefined) {
            const { ifWantsToBe } = override;
            if (ifWantsToBe !== null) {
                newIfWantsToBe = ifWantsToBe;
                newInstanceTagName = 'be-' + ifWantsToBe;
            }
        }
        const newBehaviorEl = document.createElement(parentInstanceLocalName);
        newBehaviorEl.setAttribute('if-wants-to-be', newIfWantsToBe);
        newBehaviorEl.setAttribute('upgrade', parentInstance.upgrade);
        this.appendChild(newBehaviorEl);
        const newRegisteredBehavior = {
            ...parentInstance,
            ifWantsToBe: newIfWantsToBe,
        };
        this.registeredBehaviors[parentInstanceLocalName] = newRegisteredBehavior;
        this.latestBehavior = newRegisteredBehavior;
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
            // onOverrides:{
            //     ifAllOf:['overrides']
            // },
            onLatestBehavior: 'latestBehavior'
        },
        style: {
            display: 'none',
        }
    },
    superclass: BeHiveCore
});
export const BeHive = ce.classDef;
