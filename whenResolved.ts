export async function whenResolved(enhancedElement: Element, base: string){
    const rn = enhancedElement.getRootNode() as DocumentFragment;
    const mose = rn.getElementById(`be-hive-${base}`);
    if(mose === null) throw 404;
    const emc = (<any>mose).synConfig;
    return await (<any>enhancedElement).beEnhanced.whenResolved(emc);
}