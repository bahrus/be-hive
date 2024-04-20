import {BeHive} from './be-hive.js';
import {utoa} from 'trans-render/lib/tau.js';
import {BeatifyOptions} from './types.js';
type key = string;
export function beatify(content: DocumentFragment | Element, beHive: BeHive, options?: BeatifyOptions){
    const clone = content.cloneNode(true) as DocumentFragment;
    options = options || {
        cleanMicrodata: true //TODO
    };
    const {registeredBehaviors} = beHive;
    const map = new Map<Element, Map<key, string>>()
    for(const key in registeredBehaviors){
        const registeredBehavior = registeredBehaviors[key];
        const {ifWantsToBe} = registeredBehavior;
        const qry = `[be-${ifWantsToBe}]`; //TODO:  include enh-by- and data-enh-by
        const enhancedElements = Array.from(clone.querySelectorAll(qry));
        for(const el of enhancedElements){
            if(!map.has(el)){
                map.set(el, new Map<key, string>());
            }
            const attr = `be-${ifWantsToBe}`
            const attrVal = utoa(el.getAttribute(attr)!.trim());
            const elMap = map.get(el)!
            elMap.set(ifWantsToBe, attrVal);
            el.removeAttribute(attr);
        }
    }
    for(const [el, m] of map){
        let be = '{';
        for(const [key, val] of m){
            if(val.startsWith('{')){
                be += `"${key}": ${val}`;
            }else{
                be += `"${key}": "${val}"`;
            }
            
        }
        be += '}';
        el.setAttribute('be', be);
    }
    for(const child of clone.children){
        child.setAttribute('data--ignore', '');
    }
    return clone;

    // const decoratorElements = Array.from(beHive.children) as any;
    
    // for(const decorEl of decoratorElements){
    //     const ifWantsToBe = (decorEl as any as Element).getAttribute('if-wants-to-be');
    //     if(ifWantsToBe === undefined) continue;
    //     const isAttr = 'is-' + ifWantsToBe;
    //     const beAttr = 'be-' + ifWantsToBe;
    //     const qry = `[${isAttr}]`;
    //     const converted = Array.from(content.querySelectorAll(qry));
    //     if((content as Element).matches !== undefined && (content as Element).matches(qry)) converted.push(content as Element);
    //     for(const el of converted){
    //         const attr = el.getAttribute(isAttr)!;
    //         el.removeAttribute(isAttr);
    //         el.setAttribute(beAttr, attr);
    //     }
    // }
}

export function beBeatified(element: Element){
    const beHive = (element.getRootNode() as ShadowRoot).querySelector('be-hive') as BeHive;
    beatify(element, beHive);    
}