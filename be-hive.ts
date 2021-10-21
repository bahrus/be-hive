import {XE} from 'xtal-element/src/XE.js';
import {BeHiveProps, BeHiveActions, BehaviorKeys} from './types';

export class BeHiveCore extends HTMLElement implements BeHiveActions{
    registeredBehaviors: {[key: string]: BehaviorKeys} = {};

    intro({}: this){
        const rn = this.getRootNode();
        const host = (<any>rn).host;
        if(!host) return;
        const parentShadowRealm = host.getRootNode();
        const parentBeHiveInstance = parentShadowRealm.querySelector('be-hive') as BeHiveProps & Element;
        if(parentBeHiveInstance !== null){
            const {registeredBehaviors} = parentBeHiveInstance;
            for(const key in registeredBehaviors){
                this.register(registeredBehaviors[key]);
            }

            parentBeHiveInstance.addEventListener('latest-behavior-changed', (e: Event) => {
                this.register((<any>e).detail.value);
            });
        }
    }
    onOverrides({overrides}: this){
        for(const key in overrides){
            this.register(overrides[key]);
        }
    }

    register(instance: BehaviorKeys){
        const localName =  instance.localName;
        if(this.overrides[instance.localName] !== undefined) return;
        this.registeredBehaviors[localName] = instance;
        const newBehaviorEl = document.createElement(localName);
        newBehaviorEl.setAttribute('if-wants-to-be', instance.ifWantsToBe);
        newBehaviorEl.setAttribute('upgrade', instance.upgrade);
        this.appendChild(newBehaviorEl);
        this.latestBehavior = instance;

    }
}

export interface BeHiveCore extends BeHiveProps{}

const tagName = 'be-hive';

const xe = new XE<BeHiveProps, BeHiveActions>({
    config:{
        tagName,
        propDefaults:{
            overrides: {},
            isC: true,
        },
        propInfo:{
            latestBehavior: {
                notify:{
                    dispatch: true,
                }
            }
        },
        actions:{
            intro:{
                ifAllOf:['isC'],
            },
            onOverrides:{
                ifAllOf:['overrides']
            }
        },
        style:{
            display: 'none',
        }
    },
    superclass: BeHiveCore
});

export const BeHive = xe.classDef!;

export function register(ifWantsToBe: string, upgrade: string, extTagName: string){
    const beHive = document.querySelector(tagName) as any;
    if(beHive !== null){
        customElements.whenDefined(tagName).then(() => {
            beHive.register({
                ifWantsToBe,
                upgrade,
                localName: extTagName,
            })
        })
    }else{
        document.head.appendChild(document.createElement(extTagName));
    }
}
