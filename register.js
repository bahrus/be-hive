import('./be-hive.js');
export function register(ifWantsToBe, upgrade, extTagName) {
    let beHive = document.querySelector('be-hive');
    if (beHive === null) {
        beHive = document.body.appendChild(document.createElement('be-hive'));
    }
    customElements.whenDefined('be-hive').then(() => {
        beHive.register({
            ifWantsToBe,
            upgrade,
            localName: extTagName,
        });
    });
}
