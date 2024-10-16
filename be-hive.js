import { Synthesizer } from 'mount-observer/Synthesizer.js';
export { MountObserver } from 'mount-observer/MountObserver.js';
import 'be-enhanced/beEnhanced.js';
import { Enhancers } from 'be-enhanced/beEnhanced.js';
export const defaultObsAttrs = {
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
export const registeredHandlers = new Map();
//export const scopedHandlers = new Map<EMC, ScopedCustomHandlerCluster>();
export function seed(emc) {
    if (emc.handlerKey === undefined)
        emc.handlerKey = emc.enhPropKey;
    emc.top = emc;
    const { handlerKey } = emc;
    if (!registeredHandlers.has(emc)) {
        registeredHandlers.set(emc, new Map());
    }
    const cluster = registeredHandlers.get(emc);
    if (!cluster?.has(handlerKey)) {
        cluster.set(handlerKey, new Map());
    }
    try {
        Enhancers.define(emc);
    }
    catch (e) { }
    const mose = document.createElement('script');
    const id = `be-hive.${emc.base}`;
    mose.id = emc.id = id;
    mose.synConfig = emc;
    return mose;
}
export class BeHive extends Synthesizer {
    activate(mose) {
        if (!this.checkIfAllowed(mose))
            return;
        const { synConfig } = mose;
        const mergeWithDefaults = { ...defaultObsAttrs, ...synConfig };
        //TODO allow for programmatic adjustments in load event
        //this.dispatchEvent(new RegistryEventImpl(mergeWithDefaults));
        const { base, block, branches, enhancedElementInstanceOf, enhancedElementMatches, hostInstanceOf, hostMatches, leaves, preBaseDelimiter, preBranchDelimiter, importEnh, preLeafDelimiter, hasRootIn, map, osotas, mapLocalNameTo, ws } = mergeWithDefaults;
        const mi = {
            on: enhancedElementMatches,
            whereInstanceOf: enhancedElementInstanceOf,
            whereAttr: {
                hasRootIn,
                hasBase: [preBaseDelimiter, base],
            },
            observedAttrsWhenMounted: osotas,
        };
        if (branches !== undefined) {
            mi.whereAttr.hasBranchIn = [preBaseDelimiter, branches];
        }
        if (leaves !== undefined) {
            throw 'NI';
        }
        mose.init = mi;
        super.activate(mose);
        const mo = mose.observer;
        mo.addEventListener('mount', async (e) => {
            //TODO:  doing this logic asynchronously after pulling in the existing prop
            //could result in loss of information
            const observedAttrs = await mo.observedAttrs();
            const { mountedElement } = e;
            const { beEnhanced } = mountedElement;
            const enhancementConstructor = await importEnh();
            const { enhPropKey } = mergeWithDefaults;
            const initialPropValues = beEnhanced[enhPropKey] || {};
            if (initialPropValues instanceof enhancementConstructor)
                return;
            const enhancementInstance = new enhancementConstructor();
            beEnhanced[enhPropKey] = enhancementInstance;
            const initialAttrInfo = mo.readAttrs(mountedElement);
            if (map !== undefined) {
                for (const attr of initialAttrInfo) {
                    if (attr.isSOfTAttr)
                        continue;
                    const leafIdx = 0;
                    const { parts, newValue } = attr;
                    if (newValue === null)
                        continue;
                    const { branchIdx } = parts;
                    const key = `${branchIdx}.${leafIdx}`;
                    const prop = map[key];
                    if (prop === undefined)
                        continue;
                    switch (typeof prop) {
                        case 'string':
                            if (initialPropValues[prop] !== undefined)
                                continue;
                            initialPropValues[prop] = newValue;
                            break;
                        case 'object':
                            const { prsObj } = await import('./prsObj.js');
                            await prsObj(prop, newValue, initialPropValues, attr);
                            break;
                        default:
                            throw 'NI';
                    }
                }
            }
            if (osotas !== undefined) {
                for (const attr of initialAttrInfo) {
                    if (!attr.isSOfTAttr)
                        continue;
                    const { mapsTo, newValue } = attr;
                    initialPropValues[mapsTo] = newValue;
                }
            }
            if (mapLocalNameTo !== undefined) {
                initialPropValues[mapLocalNameTo] = mountedElement.localName;
            }
            initialPropValues.customHandlers = registeredHandlers.get(synConfig.top)?.get(enhPropKey);
            let filteredWs;
            if (ws !== undefined) {
                (await import('./e.js')).e(mergeWithDefaults, mountedElement, ws, initialPropValues);
            }
            //initialPropValues.scopedCustomHandlers = scopedHandlers.get(synConfig.top)?.get(enhPropKey);
            enhancementInstance.attach(mountedElement, {
                initialAttrInfo,
                initialPropValues,
                mountCnfg: mergeWithDefaults,
                synConfig,
                observedAttrs,
                ws: filteredWs
            });
        });
    }
}
if (customElements.get('be-hive') === undefined) {
    customElements.define('be-hive', BeHive);
}
