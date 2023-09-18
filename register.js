import('./be-hive.js');
export async function register(ifWantsToBe, upgrade, extTagName, aspects) {
    let beHive = document.querySelector('be-hive');
    if (beHive === null) {
        beHive = document.body.appendChild(document.createElement('be-hive'));
    }
    await customElements.whenDefined('be-hive');
    return beHive.register({
        ifWantsToBe,
        upgrade,
        localName: extTagName,
        aspects,
    });
}
