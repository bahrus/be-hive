import {CE} from 'trans-render/lib/CE.js';
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

    register(parentInstance: BehaviorKeys){
        const parentInstanceLocalName =  parentInstance.localName;
        //if(this.overrides[parentInstanceLocalName] !== undefined) return;
        if(this.querySelector(parentInstanceLocalName) !== null) return;
        this.registeredBehaviors[parentInstanceLocalName] = parentInstance;
        const newBehaviorEl = document.createElement(parentInstanceLocalName);
        newBehaviorEl.setAttribute('if-wants-to-be', parentInstance.ifWantsToBe);
        newBehaviorEl.setAttribute('upgrade', parentInstance.upgrade);
        this.appendChild(newBehaviorEl);
        this.latestBehavior = parentInstance;
        return newBehaviorEl;
    }


    onLatestBehavior({latestBehavior}: this): void {
        this.dispatchEvent(new CustomEvent('latest-behavior-changed', {
            detail:{
                value: latestBehavior,
            }
        }))
    }
}

export interface BeHiveCore extends BeHiveProps{}

const tagName = 'be-hive';

const ce = new CE<BeHiveProps, BeHiveActions>({
    config:{
        tagName,
        propDefaults:{
            overrides: {},
            isC: true,
        },
        actions:{
            intro:{
                ifAllOf:['isC'],
            },
            onOverrides:{
                ifAllOf:['overrides']
            },
            onLatestBehavior: 'latestBehavior'
        },
        style:{
            display: 'none',
        }
    },
    superclass: BeHiveCore
});

export const BeHive = ce.classDef!;


