import('./be-hive.js');
export function register(ifWantsToBe, upgrade, extTagName) {
    const beHive = document.querySelector('be-hive');
    if (beHive === null) {
        document.body.appendChild(document.createElement('be-hive'));
    }
    customElements.whenDefined('be-hive').then(() => {
        beHive.register({
            ifWantsToBe,
            upgrade,
            localName: extTagName,
        });
    });
}
