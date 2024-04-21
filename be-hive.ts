import {MountBeHive, EnhancementMountCnfg} from 'trans-render/be/types';
import {RegistryEvent, RegistryEventName} from './types';
import {BeEnhanced} from 'be-enhanced/beEnhanced.js';
import 'be-enhanced/beEnhanced.js';
import { MountEvent, MountObserver } from 'mount-observer/MountObserver.js';
import { AddMountEventListener, AttribMatch, MountInit } from 'mount-observer/types';


export const defaultObsAttrs: MountBeHive = {
    hasRootIn: [
        {
            start: 'enh-',
            context: 'Both'
        },
        {
            start: 'data-enh-',
            context: 'Both'
        },
        {
            start: '',
            context: 'BuiltIn'
        }
    ],
    base: '',
    preBaseDelimiter: '-',
    preBranchDelimiter: '-',
    preLeafDelimiter: '--',
    enhancedElementMatches: '*',
    enhancedElementInstanceOf: [Element]
};

export class RegistryEventImpl<TBranches = any> extends Event implements RegistryEvent<TBranches>{

    static EventName: RegistryEventName = 'load';

    constructor(public mountBeHive: MountBeHive<TBranches>){
        super(RegistryEventImpl.EventName);
    }
}

class Registry extends EventTarget{
    register(mbh: MountBeHive){
        this.dispatchEvent(new RegistryEventImpl(mbh));
    }
}

export class BeHive extends HTMLElement{

    static #topDowns: Array<MountBeHive> = [];
    static get topDowns(){
        return this.#topDowns;

    }

    static #registry = new Registry();
    static get registry(){
        return this.#registry;
    }

    static {
        this.#registry.addEventListener(RegistryEventImpl.EventName, e => {
            const eAsR = e as any as RegistryEvent;
            this.#topDowns.push({...eAsR.mountBeHive});
        })
    }

    get registry(){
        return BeHive.registry;
    }

    #overrides: {[key: string]: MountBeHive} = {};
    get overrides(){
        return this.#overrides
    }
    connectedCallback(){
        this.hidden = true;
        this.#getInheritedOverrides();
        this.#mountAll();
        this.registry.addEventListener(RegistryEventImpl.EventName, e => {
            const eAsR = e as any as RegistryEvent;
            this.#mountSingle(eAsR.mountBeHive);
        });
    }

    #getInheritedOverrides(){
        //TODO
        const overridesAttr = this.getAttribute('overrides');
        if(overridesAttr !== null){
            this.#overrides = JSON.parse(overridesAttr);
        }
    }

    get #allTopDowns(){
        return BeHive.topDowns as Array<MountBeHive>
    }

    #mountAll(){
        for(const mbh of this.#allTopDowns){
            this.#mountSingle(mbh);

        }
    }

    #mountSingle(mbh: MountBeHive){
        const mergeWithDefaults = {...defaultObsAttrs, ...mbh};
        //allow for programmatic adjustments in load event
        this.dispatchEvent(new RegistryEventImpl(mergeWithDefaults));
        if(mergeWithDefaults.block) return;
        const {
            base, block, branches, do: d, enhancedElementInstanceOf,
            enhancedElementMatches, hostInstanceOf, hostMatches,
            leaves, preBaseDelimiter, preBranchDelimiter,
            preLeafDelimiter, hasRootIn, 
        } = mergeWithDefaults;
        if(d === undefined) throw 'NI';
        const mi: MountInit = {
            on: enhancedElementMatches,
            whereInstanceOf: enhancedElementInstanceOf,
            whereAttr: {
                hasRootIn,
                hasBase: base,
                
            },
        };
        if(branches !== undefined){
            mi.whereAttr!.hasBranchIn = [preBaseDelimiter, branches];
        }
        if(leaves !== undefined){
            throw 'NI';
        }
        const mo = new MountObserver(mi);
        (mo as any as AddMountEventListener).addEventListener('mount', async e => {
            const {mountedElement} = (e as MountEvent);
            const {beEnhanced} : {beEnhanced: BeEnhanced} = (<any>mountedElement);
            const {do: d} = mbh;
            const enhancementConstructor = await d!.mount.import();
            const enhancementInstance =  new enhancementConstructor();
            const {enhPropKey} = mergeWithDefaults;
            const initialPropValues = (<any>beEnhanced)[enhPropKey!];
            if(initialPropValues instanceof enhancementConstructor) return;
            const initialAttrInfo = mo.readAttrs(mountedElement);
            enhancementInstance.attach(mountedElement, {
                initialAttrInfo,
                initialPropValues,
                mountCnfg: mbh as EnhancementMountCnfg
            });
            //TODO:  add attr event listener to mo      
        });
        const rn = this.getRootNode() as Document | ShadowRoot;
        mo.observe(rn);
    }
}

if(document.querySelector('be-hive') === null){
    document.body.appendChild(document.createElement('be-hive'));
}
if(customElements.get('be-hive') === undefined){
    customElements.define('be-hive', BeHive);
}







