import {Synthesizer} from 'mount-observer/Synthesizer.js';
import { AddMountEventListener, MountInit, MOSE, MOSEAddedProps} from './ts-refs/mount-observer/types';
export {EMC} from './ts-refs/trans-render/be/types';
export {MountObserver, MOSE} from 'mount-observer/MountObserver.js';
import {AttrMapPoint, CustomHandlerCluster, EMC, EventListenerOrFn, HandlerKey, ScopedCustomHandlerCluster} from './ts-refs/trans-render/be/types';
import { MountEvent } from 'mount-observer/MountObserver';
import 'be-enhanced/beEnhanced.js';
import { BeEnhanced, Enhancers } from 'be-enhanced/beEnhanced.js';

export const defaultObsAttrs: Partial<EMC> = {
    hasRootIn: [
        {
            start: '',
            context: 'BuiltIn'
        },
        {
            start: 'enh',
            context: 'Both'
        },
        {
            start: 'data-enh',
            context: 'Both'
        },



    ],
    base: '',
    preBaseDelimiter: '-',
    preBranchDelimiter: '-',
    preLeafDelimiter: '--',
    enhancedElementMatches: '*',
    enhancedElementInstanceOf: [Element]
};



export const registeredHandlers = new Map<EMC, CustomHandlerCluster>();

export const scopedHandlers = new Map<EMC, ScopedCustomHandlerCluster>();

export function seed(emc: EMC){
    if(emc.handlerKey === undefined) emc.handlerKey = emc.enhPropKey;
    emc.top = emc;
    const {handlerKey} = emc;
    if(!registeredHandlers.has(emc)) {
        registeredHandlers.set(emc, new Map());
    }
    const cluster = registeredHandlers.get(emc);
    if(!cluster?.has(handlerKey)){
        cluster!.set(handlerKey, new Map());
    }
    if(!scopedHandlers.has(emc)){
        scopedHandlers.set(emc, new Map());
    }
    const scopedCluster = scopedHandlers.get(emc);
    if(!scopedCluster?.has(handlerKey)){
        scopedCluster!.set(handlerKey, new Map())
    }
    try{
        Enhancers.define(emc);
    }catch(e){}
    
    const mose = document.createElement('script') as MOSE<EMC>;
    const id = `be-hive.${emc.base}`;
    mose.id = emc.id = id;
    mose.synConfig = emc;
    return mose;
}

export class BeHive extends Synthesizer {
    override activate(mose: MOSE<any>) {
        if(!this.checkIfAllowed(mose)) return;
        const {synConfig} = mose as MOSEAddedProps<any>;
        const mergeWithDefaults = {...defaultObsAttrs, ...synConfig} as EMC;
        //TODO allow for programmatic adjustments in load event
        //this.dispatchEvent(new RegistryEventImpl(mergeWithDefaults));
        const {
            base, block, branches, enhancedElementInstanceOf,
            enhancedElementMatches, hostInstanceOf, hostMatches,
            leaves, preBaseDelimiter, preBranchDelimiter, importEnh,
            preLeafDelimiter, hasRootIn, map, osotas,
            mapLocalNameTo
            
        } = mergeWithDefaults;
        const mi: MountInit = {
            on: enhancedElementMatches,
            whereInstanceOf: enhancedElementInstanceOf,
            whereAttr: {
                hasRootIn,
                hasBase: [preBaseDelimiter!, base!],
                
            },
            observedAttrsWhenMounted: osotas,
        };
        if(branches !== undefined){
            mi.whereAttr!.hasBranchIn = [preBaseDelimiter!, branches];
        }
        if(leaves !== undefined){
            throw 'NI';
        }
        mose.init = mi;
        super.activate(mose);
        const mo = mose.observer;
        (mo as any as AddMountEventListener).addEventListener('mount', async e => {
            const observedAttrs = await mo.observedAttrs();
            const {mountedElement} = (e as MountEvent);
            const {beEnhanced} : {beEnhanced: BeEnhanced} = (<any>mountedElement);
            const enhancementConstructor = await importEnh!();
            const {enhPropKey} = mergeWithDefaults;
            const initialPropValues = (<any>beEnhanced)[enhPropKey!] || {};
            if(initialPropValues instanceof enhancementConstructor) return;
            const enhancementInstance =  new enhancementConstructor();
            (<any>beEnhanced)[enhPropKey!] = enhancementInstance;
            const initialAttrInfo = mo.readAttrs(mountedElement);
            if(map !== undefined){
                for(const attr of initialAttrInfo){
                    if(attr.isSOfTAttr) continue;
                    const leafIdx = 0;
                    const {parts, newValue} = attr;
                    if(newValue === null) continue;
                    const {branchIdx} = parts!;
                    const key = `${branchIdx}.${leafIdx}`;
                    const prop = (<any>map)[key] as AttrMapPoint;
                    if(prop === undefined) continue;
                    switch(typeof prop){
                        case 'string':
                            if(initialPropValues[prop] !== undefined) continue;
                            initialPropValues[prop] = newValue;
                            break;
                        case 'object':
                            const {prsObj} = await import ('./prsObj.js');
                            await prsObj(prop, newValue, initialPropValues, attr);
                            break;
                        default:
                            throw 'NI';
                    }
                    
                }
            }
            if(osotas !== undefined){
                for(const attr of initialAttrInfo){
                    if(!attr.isSOfTAttr) continue;
                    const {mapsTo, newValue} = attr;
                    initialPropValues[mapsTo!] = newValue;
                }
            }
            if(mapLocalNameTo !== undefined){
                initialPropValues[mapLocalNameTo] = mountedElement.localName;
            }
            initialPropValues.customHandlers = registeredHandlers.get(synConfig.top)?.get(enhPropKey);
            initialPropValues.scopedCustomHandlers = scopedHandlers.get(synConfig.top)?.get(enhPropKey);
            enhancementInstance.attach(mountedElement, {
                initialAttrInfo,
                initialPropValues,
                mountCnfg: mergeWithDefaults,
                synConfig,
                observedAttrs
            });
        });
    }
}

if(customElements.get('be-hive') === undefined){
    customElements.define('be-hive', BeHive);
}