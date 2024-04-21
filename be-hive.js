import 'be-enhanced/beEnhanced.js';
import { MountObserver } from 'mount-observer/MountObserver.js';
export const defaultObsAttrs = {
    hasRootIn: [
        {
            start: 'enh',
            context: 'Both'
        },
        {
            start: 'data-enh',
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
export class RegistryEventImpl extends Event {
    mountBeHive;
    static EventName = 'load';
    constructor(mountBeHive) {
        super(RegistryEventImpl.EventName);
        this.mountBeHive = mountBeHive;
    }
}
class Registry extends EventTarget {
    register(mbh) {
        this.dispatchEvent(new RegistryEventImpl(mbh));
    }
}
export class BeHive extends HTMLElement {
    static #topDowns = [];
    static get topDowns() {
        return this.#topDowns;
    }
    static #registry = new Registry();
    static get registry() {
        return this.#registry;
    }
    static {
        this.#registry.addEventListener(RegistryEventImpl.EventName, e => {
            const eAsR = e;
            this.#topDowns.push({ ...eAsR.mountBeHive });
        });
    }
    get registry() {
        return BeHive.registry;
    }
    #overrides = {};
    get overrides() {
        return this.#overrides;
    }
    connectedCallback() {
        this.hidden = true;
        this.#getInheritedOverrides();
        this.#mountAll();
        this.registry.addEventListener(RegistryEventImpl.EventName, e => {
            const eAsR = e;
            this.#mountSingle(eAsR.mountBeHive);
        });
    }
    #getInheritedOverrides() {
        //TODO
        const overridesAttr = this.getAttribute('overrides');
        if (overridesAttr !== null) {
            this.#overrides = JSON.parse(overridesAttr);
        }
    }
    get #allTopDowns() {
        return BeHive.topDowns;
    }
    #mountAll() {
        for (const mbh of this.#allTopDowns) {
            this.#mountSingle(mbh);
        }
    }
    #mountSingle(mbh) {
        const mergeWithDefaults = { ...defaultObsAttrs, ...mbh };
        //allow for programmatic adjustments in load event
        this.dispatchEvent(new RegistryEventImpl(mergeWithDefaults));
        if (mergeWithDefaults.block)
            return;
        const { base, block, branches, do: d, enhancedElementInstanceOf, enhancedElementMatches, hostInstanceOf, hostMatches, leaves, preBaseDelimiter, preBranchDelimiter, preLeafDelimiter, hasRootIn, } = mergeWithDefaults;
        if (d === undefined)
            throw 'NI';
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
        const mo = new MountObserver(mi);
        mo.addEventListener('mount', async (e) => {
            const { mountedElement } = e;
            const { beEnhanced } = mountedElement;
            const { do: d } = mbh;
            const enhancementConstructor = await d.mount.import();
            const enhancementInstance = new enhancementConstructor();
            const { enhPropKey } = mergeWithDefaults;
            const initialPropValues = beEnhanced[enhPropKey];
            if (initialPropValues instanceof enhancementConstructor)
                return;
            const initialAttrInfo = mo.readAttrs(mountedElement);
            enhancementInstance.attach(mountedElement, {
                initialAttrInfo,
                initialPropValues,
                mountCnfg: mbh
            });
            //TODO:  add attr event listener to mo      
        });
        const rn = this.getRootNode();
        mo.observe(rn);
    }
}
if (document.querySelector('be-hive') === null) {
    document.body.appendChild(document.createElement('be-hive'));
}
if (customElements.get('be-hive') === undefined) {
    customElements.define('be-hive', BeHive);
}
