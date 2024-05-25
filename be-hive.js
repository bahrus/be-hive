import { Synthesizer } from 'mount-observer/Synthesizer.js';
import 'be-enhanced/beEnhanced.js';
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
export class BeHive extends Synthesizer {
    activate(mose) {
        const { synConfig } = mose;
        const mergeWithDefaults = { ...defaultObsAttrs, ...synConfig };
        //TODO allow for programmatic adjustments in load event
        //this.dispatchEvent(new RegistryEventImpl(mergeWithDefaults));
        if (mergeWithDefaults.block)
            return;
        const { base, block, branches, enhancedElementInstanceOf, enhancedElementMatches, hostInstanceOf, hostMatches, leaves, preBaseDelimiter, preBranchDelimiter, importEnh, preLeafDelimiter, hasRootIn, } = mergeWithDefaults;
        const mi = {
            on: enhancedElementMatches,
            whereInstanceOf: enhancedElementInstanceOf,
            whereAttr: {
                hasRootIn,
                hasBase: [preBaseDelimiter, base],
            },
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
            const { mountedElement } = e;
            const { beEnhanced } = mountedElement;
            //const {do: d, map} = mbh;
            //const enhancementConstructor = await d!.mount.import();
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
                            const { instanceOf, mapsTo } = prop;
                            let valToSet = newValue;
                            switch (instanceOf) {
                                case 'Object':
                                    try {
                                        valToSet = JSON.parse(newValue);
                                    }
                                    catch (e) {
                                        throw { err: 400, attr, newValue };
                                    }
                                    if (mapsTo === '.') {
                                        Object.assign(initialPropValues, valToSet);
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
            enhancementInstance.attach(mountedElement, {
                initialAttrInfo,
                initialPropValues,
                mountCnfg: mbh
            });
        });
    }
    if(customElements, get) { }
}
('be-hive') === undefined;
{
    customElements.define('be-hive', BeHive);
}
