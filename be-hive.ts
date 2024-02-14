import {BeHiveProps, BeHiveActions, BehaviorKeys, IHasID, IDisposable} from './types';
import {BeEnhanced} from 'be-enhanced/beEnhanced.js';
import 'be-enhanced/beEnhanced.js';
import { MountObserver } from 'mount-observer/MountObserver.js';
import {AddMountEventListener, AttribMatch } from 'mount-observer/types';
export class BeHive extends HTMLElement{

    constructor(){
        super();
        this.registeredBehaviors = {};
    }

    connectedCallback(){
        this.hidden = true;
        const overridesAttr = this.getAttribute('overrides');
        if(overridesAttr !== null){
            this.overrides = JSON.parse(overridesAttr);
        }else{
            this.overrides = {};
        }
        this.#getInheritedBehaviors();
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

    async beatify(content: DocumentFragment | Element){
        const {beatify} = await import('./beatify.js');
        return await beatify(content, this);
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

    #scanForSingleRegisteredBehavior(localName: string, behaviorKeys: BehaviorKeys){
        const {ifWantsToBe, upgrade, aspects} = behaviorKeys;
        //const allAspects = aspects !== undefined ? ['', ...aspects.map(x => '-' + x)] : [''];
        const mo = new MountObserver({
            on: `${upgrade}:not([data--ignore])`,
            whereAttr:{
                hasRootIn: ['enh', 'data-enh', {
                    path: '',
                    context: 'BuiltIn'
                }],
                hasBase: localName,
                hasBranchesIn: aspects
            }
            // attribMatches: allAspects.map(x => ({
            //     names: [localName + x, `enh-by-${localName}` + x, `data-enh-by-${localName}` + x]
            // }) as AttribMatch)
        });

        (mo as any as AddMountEventListener).addEventListener('mount', e => {
            const {beEnhanced} : {beEnhanced: BeEnhanced} = (<any>e.mountedElement);
            const namespacedName = beEnhanced.getFQName(localName);
            if(namespacedName === undefined) return;
            //console.log({namespacedName});
            beEnhanced.whenAttached(namespacedName);
        });
        const rn = this.getRootNode() as Document | ShadowRoot;
        mo.observe(rn);
        
        

    }
}

if(!customElements.get('be-hive')){
    customElements.define('be-hive', BeHive);
}

export interface BeHive extends BeHiveProps{}