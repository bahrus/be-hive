import {BeHiveProps, BeHiveActions, BehaviorKeys} from './types';
export class BeHive extends HTMLElement{
    constructor(){
        super();
        this.registeredBehaviors = {};
    }
    connectedCallback(){
        this.style.display = 'none';
        const overridesAttr = this.getAttribute('overrides');
        if(overridesAttr !== null){
            this.overrides = JSON.parse(overridesAttr);
        }else{
            this.overrides = {};
        }
        
        this.#getInheritedBehaviors();
    }

    #getInheritedBehaviors(){
        const beSevered = this.getAttribute('be-severed');
        if(beSevered !== null) return;
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
        this.dispatchEvent(new CustomEvent('latest-behavior-changed', {
            detail:{
                value: newRegisteredBehavior,
            }
        }));
        //this.latestBehaviors = [...this.latestBehaviors, newRegisteredBehavior];
        return newBehaviorEl;
    }


}

if(!customElements.get('be-hive')){
    customElements.define('be-hive', BeHive);
}

export interface BeHive extends BeHiveProps{}