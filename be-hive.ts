import {BeHiveProps, BeHiveActions, BehaviorKeys, IHasID, IDisposable} from './types';
import {BeEnhanced} from 'be-enhanced/beEnhanced.js';
import 'be-enhanced/beEnhanced.js';
export class BeHive extends HTMLElement{

    constructor(){
        super();
        this.registeredBehaviors = {};

    }
    async connectedCallback(){
        this.hidden = true;
        const overridesAttr = this.getAttribute('overrides');
        if(overridesAttr !== null){
            this.overrides = JSON.parse(overridesAttr);
        }else{
            this.overrides = {};
        }
        this.#getInheritedBehaviors();
        this.#addMutationObserver();
    }

    disconnectedCallback(){
        if(this.#mutationObserver !== undefined){
            this.#mutationObserver.disconnect();
        }
    }


    #getInheritedBehaviors(){
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

    #mutationObserver: MutationObserver | undefined;

    
    #addMutationObserver(){
        const rn = this.getRootNode() as DocumentFragment;
        const config = { attributes: true, childList: true, subtree: true } as MutationObserverInit;
        const callback = (mutationList: MutationRecord[], observer: MutationObserver) => {

            for (const mutation of mutationList) {
                if (mutation.type === "childList") {
                    //console.log("A child node has been added or removed.");
                    for(const node of mutation.addedNodes){
                        this.#inspectNewNode(node);
                    }
                    for(const node of mutation.removedNodes){
                        const beEnhanced = (<any>node).beEnhanced;
                        if(beEnhanced === undefined) continue;
                        for(const key in beEnhanced){
                            const enhancement = beEnhanced[key];
                            const detach = enhancement['detach'];
                            if(typeof(detach) === 'function'){
                                detach(node);
                            }
                        }
                    }
                } else if (mutation.type === "attributes") {

                    //console.log(`The ${mutation.attributeName} attribute was modified.`);
                }
            }
        };
        
        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);
        observer.observe(rn, config);
        this.#mutationObserver = observer;
    }

    #inspectNewNode(node: Node){
        if(!(node instanceof Element)) return;
        const {registeredBehaviors} = this;
        for(const key in registeredBehaviors){
            const registeredBehavior = registeredBehaviors[key];
            const {upgrade} = registeredBehavior;
            const attr = node.localName.includes('-') ?  `[enh-by-${key},data-enh-by-${key}]` : `[${key},enh-by-${key},data-enh-by-${key}]`;
            if(node.matches(upgrade) && node.matches(attr)){
                const {beEnhanced} : {beEnhanced: BeEnhanced} = (<any>node);
                //console.log("behive: attachAttr");
                beEnhanced.attachAttr(key);
            }
        }
    }


    #scanForSingleRegisteredBehavior(localName: string, behaviorKeys: BehaviorKeys){
        const {ifWantsToBe, upgrade} = behaviorKeys;
        const attr = `${upgrade}[${localName}],${upgrade}[enh-by-${localName}],${upgrade}[data-enh-by-${localName}]`;
        const rn = this.getRootNode() as DocumentFragment;
        rn.querySelectorAll(attr).forEach(el => {
            if(el.localName.includes('-') && !el.matches(`[enh-by-${localName}],${upgrade}[data-enh-by-${localName}]`)) return;
            const {beEnhanced} : {beEnhanced: BeEnhanced} = (<any>el);
            //console.log("behive: attachAttr");
            beEnhanced.attachAttr(localName);
        })
    }

    register(parentInstance: BehaviorKeys){
        const parentInstanceLocalName =  parentInstance.localName;
        if(this.querySelector(parentInstanceLocalName) !== null) return;
        const override =  this.overrides[parentInstanceLocalName];
        let newInstanceTagName = parentInstanceLocalName;
        let newIfWantsToBe = parentInstance.ifWantsToBe;
        let newDisabled = parentInstance.disabled;
        
        if(override !== undefined){
            const {ifWantsToBe, block, unblock} = override;
            if(block) {
                newDisabled = true;
            } else if(unblock){
                newDisabled = false;
            }

            if(ifWantsToBe){
                newIfWantsToBe = ifWantsToBe;
                newInstanceTagName = 'be-' + ifWantsToBe;
            }
        }
        const beSevered = this.hasAttribute('be-severed');
        if(beSevered) newDisabled = true;
        const newBehaviorEl = document.createElement('template');
        Object.assign(newBehaviorEl.dataset, {
            localName: parentInstanceLocalName,
            ifWantsToBe: newIfWantsToBe,
            upgrade: parentInstance.upgrade,
        });
        //parentInstanceLocalName
        // newBehaviorEl.setAttribute('if-wants-to-be', newIfWantsToBe);
        // newBehaviorEl.setAttribute('upgrade', parentInstance.upgrade);
        if(newDisabled) newBehaviorEl.setAttribute('disabled', '');
        this.appendChild(newBehaviorEl);
        const newRegisteredBehavior: BehaviorKeys = {
            ...parentInstance,
            ifWantsToBe: newIfWantsToBe,
            disabled: newDisabled,
        };
            
        this.registeredBehaviors[parentInstanceLocalName] = newRegisteredBehavior;
        this.#scanForSingleRegisteredBehavior(parentInstanceLocalName, newRegisteredBehavior);
        //console.log({newRegisteredBehavior});
        this.dispatchEvent(new CustomEvent('latest-behavior-changed', {
            detail:{
                value: newRegisteredBehavior,
            }
        }));
        //this.latestBehaviors = [...this.latestBehaviors, newRegisteredBehavior];
        //this.#doSweepingScan();
        return newBehaviorEl;
    }


}

if(!customElements.get('be-hive')){
    customElements.define('be-hive', BeHive);
}

export interface BeHive extends BeHiveProps{}