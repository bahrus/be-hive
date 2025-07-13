export async function whenResolved(enhancedElement, base) {
    const rn = enhancedElement.getRootNode();
    const mose = rn.getElementById(`be-hive-${base}`);
    if (mose === null)
        throw 404;
    const emc = mose.synConfig;
    return await enhancedElement.whenResolved(emc);
}
