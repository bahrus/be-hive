import {Synthesizer} from 'mount-observer/Synthesizer.js';
import { AddMountEventListener, MountInit, MOSE, MOSEAddedProps } from '../mount-observer/types';
export {EnhancementMountCnfg} from 'trans-render/be/types';
import {AttrMapPoint, EnhancementMountCnfg} from 'trans-render/be/types';
import { MountEvent } from '../mount-observer/MountObserver';
import 'be-enhanced/beEnhanced.js';
import { BeEnhanced } from 'be-enhanced/beEnhanced.js';

export const defaultObsAttrs: EnhancementMountCnfg = {
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

export class BeHive extends Synthesizer {
    override activate(mose: MOSE<any>): void {
        const {synConfig} = mose as MOSEAddedProps<any>;
        const mergeWithDefaults = {...defaultObsAttrs, ...synConfig} as EnhancementMountCnfg;
        //TODO allow for programmatic adjustments in load event
        //this.dispatchEvent(new RegistryEventImpl(mergeWithDefaults));
        if(mergeWithDefaults.block) return;
        const {
            base, block, branches, enhancedElementInstanceOf,
            enhancedElementMatches, hostInstanceOf, hostMatches,
            leaves, preBaseDelimiter, preBranchDelimiter, importEnh,
            preLeafDelimiter, hasRootIn, map, osotas
            
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
            const {mountedElement} = (e as MountEvent);
            const {beEnhanced} : {beEnhanced: BeEnhanced} = (<any>mountedElement);
            //const {do: d, map} = mbh;
            //const enhancementConstructor = await d!.mount.import();
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
                            const {instanceOf, mapsTo} = prop;
                            let valToSet = newValue;
                            switch(instanceOf){
                                case 'Object':
                                    try{
                                        valToSet = JSON.parse(newValue);
                                    }catch(e){
                                        throw {err: 400, attr, newValue};
                                    }
                                    if(mapsTo === '.'){
                                        Object.assign(initialPropValues, valToSet);
                                    }else{
                                        initialPropValues[mapsTo] = valToSet;
                                    }
                                    break;
                                default:
                                    throw 'NI';
                            }
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
            enhancementInstance.attach(mountedElement, {
                initialAttrInfo,
                initialPropValues,
                mountCnfg: mergeWithDefaults
            });
        });
    }
}

if(customElements.get('be-hive') === undefined){
    customElements.define('be-hive', BeHive);
}