export function beatify(content, beHive) {
    const decoratorElements = Array.from(beHive.children);
    for (const decorEl of decoratorElements) {
        const ifWantsToBe = decorEl.getAttribute('if-wants-to-be');
        if (ifWantsToBe === undefined)
            continue;
        const isAttr = 'is-' + ifWantsToBe;
        const beAttr = 'be-' + ifWantsToBe;
        const qry = `[${isAttr}]`;
        const converted = Array.from(content.querySelectorAll(qry));
        if (content.matches !== undefined && content.matches(qry))
            converted.push(content);
        for (const el of converted) {
            const attr = el.getAttribute(isAttr);
            el.removeAttribute(isAttr);
            el.setAttribute(beAttr, attr);
        }
    }
}
export function beBeatified(element) {
    const beHive = element.getRootNode().querySelector('be-hive');
    beatify(element, beHive);
}
