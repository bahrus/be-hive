export function beatify(content: DocumentFragment | Element, beHive: Element){
    const decoratorElements = Array.from(beHive.children) as any;
    
    for(const decorEl of decoratorElements){
        const ifWantsToBe = (decorEl as any as Element).getAttribute('if-wants-to-be');
        if(ifWantsToBe === undefined) continue;
        const isAttr = 'is-' + ifWantsToBe;
        const beAttr = 'be-' + ifWantsToBe;
        const qry = `[${isAttr}]`;
        const converted = Array.from(content.querySelectorAll(qry));
        if((content as Element).matches !== undefined && (content as Element).matches(qry)) converted.push(content as Element);
        for(const el of converted){
            const attr = el.getAttribute(isAttr)!;
            el.removeAttribute(isAttr);
            el.setAttribute(beAttr, attr);
        }
    }
}

export function beBeatified(element: Element){
    const beHive = (element.getRootNode() as ShadowRoot).querySelector('be-hive') as Element;
    beatify(element, beHive);    
}