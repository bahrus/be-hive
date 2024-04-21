import {MountBeHive, ObservedAttributes, RegistryEvent, RegistryEventName} from './types';
export {MountBeHive} from './types';
import {BeEnhanced} from 'be-enhanced/beEnhanced.js';
import 'be-enhanced/beEnhanced.js';
import { MountObserver } from 'mount-observer/MountObserver.js';
import { AddMountEventListener, AttribMatch, MountInit } from 'mount-observer/types';

export const defaultObsAttrs: ObservedAttributes = {
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

class Registry extends EventTarget{
    register(mbh: MountBeHive){
        this.dispatchEvent(new Event('load'));
    }
}

export class BeHive extends HTMLElement{

    static #topDowns: Array<MountBeHive> = [];
    static get topDowns(){
        return this.#topDowns;

    }

    static #registry = new Registry();

    #overrides: {[key: string]: MountBeHive} = {};
    get overrides(){
        return this.#overrides
    }
    connectedCallback(){
        this.hidden = true;
        this.#getInheritedOverrides();
        this.#mount();
    }

    #getInheritedOverrides(){
        //TODO
        const overridesAttr = this.getAttribute('overrides');
        if(overridesAttr !== null){
            this.#overrides = JSON.parse(overridesAttr);
        }
    }

    get #topDowns(){
        return (<any>this.constructor).topDowns as Array<MountBeHive>
    }

    #mount(){
        for(const td of this.#topDowns){
            const mergeWithDefaults = {...defaultObsAttrs, td};
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
            (mo as any as AddMountEventListener).addEventListener('mount', e => {
                
            });
            const rn = this.getRootNode() as Document | ShadowRoot;
            mo.observe(rn);

        }
    }
}

export class RegistryEventImpl<TBranches = any> extends Event implements RegistryEvent<TBranches>{

    static EventName: RegistryEventName = 'load';

    constructor(public mountBeHive: MountBeHive<TBranches>){
        super(RegistryEventImpl.EventName);
    }
}

