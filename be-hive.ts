import {CE} from 'trans-render/lib/CE.js';
import {BeHiveProps, BeHiveActions, BehaviorKeys} from './types';

export class BeHiveCore extends HTMLElement implements BeHiveActions{
    registeredBehaviors: {[key: string]: BehaviorKeys} = {};

    intro({beSevered}: this){
        if(beSevered) return;
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


    register(parentInstance: BehaviorKeys){
        const parentInstanceLocalName =  parentInstance.localName;
        if(this.querySelector(parentInstanceLocalName) !== null) return;
        const override =  this.overrides[parentInstanceLocalName];
        let newInstanceTagName = parentInstanceLocalName;
        let newIfWantsToBe = parentInstance.ifWantsToBe;
        if(override !== undefined){
            const {ifWantsToBe, block} = override;
            if(block) return;
            if(ifWantsToBe !== null){
                newIfWantsToBe = ifWantsToBe;
                newInstanceTagName = 'be-' + ifWantsToBe;
            }
        }
        
        const newBehaviorEl = document.createElement(parentInstanceLocalName);
        newBehaviorEl.setAttribute('if-wants-to-be', newIfWantsToBe);
        newBehaviorEl.setAttribute('upgrade', parentInstance.upgrade);
        this.appendChild(newBehaviorEl);
        const newRegisteredBehavior: BehaviorKeys = {
            ...parentInstance,
            ifWantsToBe: newIfWantsToBe,
            
        };
            
        this.registeredBehaviors[parentInstanceLocalName] = newRegisteredBehavior;
        this.latestBehaviors = [...this.latestBehaviors, newRegisteredBehavior];
        return newBehaviorEl;
    }


    onLatestBehavior({}: this): void {
        for(const behavior of this.latestBehaviors){
            this.dispatchEvent(new CustomEvent('latest-behavior-changed', {
                detail:{
                    value: behavior,
                }
            }))
        }
        this.latestBehaviors = [];
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
            beSevered: false,
            latestBehaviors: []
        },
        actions:{
            intro:{
                ifAllOf:['isC'],
            },
            onLatestBehaviors: 'latestBehaviors'
        },
        style:{
            display: 'none',
        }
    },
    superclass: BeHiveCore
});

export const BeHive = ce.classDef!;


