import {XE} from 'xtal-element/src/XE.js';
import {BeHiveProps, BeHiveActions, BehaviorKeys} from './types';
import {BeDecoratedProps} from 'be-decorated/types';

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
                const instance = registeredBehaviors[key];
                this.register(instance);
            }

            parentBeHiveInstance.addEventListener('latest-behavior-changed', (e: Event) => {
                this.register((<any>e).detail.value);
            });
        }
    }
    onOverrides({overrides}: this){
        const rn = this.getRootNode() as any;
        const host = rn.host;
        if(!rn.host) return;
        const parentRn = rn.host.getRootNode();
        const hive = {...parentRn[Symbol.for('be-hive')], ...overrides};
        for(const key in hive){
            const el = document.createElement(key);
            el.setAttribute('if-wants-to-be', hive[key]);
            rn.appendChild(el);
        }
    }

    register(instance: BehaviorKeys){
        const localName =  instance.localName;
        if(this.overrides[instance.localName] !== undefined) return;
        this.registeredBehaviors[localName] = instance;
        const newBehaviorEl = document.createElement(localName);
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
