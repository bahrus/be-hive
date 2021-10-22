export function register(ifWantsToBe, upgrade, extTagName) {
    const beHive = document.querySelector('be-hive');
    if (beHive !== null) {
        customElements.whenDefined('be-hive').then(() => {
            beHive.register({
                ifWantsToBe,
                upgrade,
                localName: extTagName,
            });
        });
    }
    else {
        document.head.appendChild(document.createElement(extTagName));
    }
}
