export function getLocalName(peerCitizen, decoratorName) {
    return new Promise((resolve, reject) => {
        const rn = peerCitizen.getRootNode();
        const bh = rn.querySelector('be-hive');
        if (bh === null) {
            reject('404');
            return;
        }
        const wc = bh.querySelector(decoratorName);
        if (wc !== null) {
            resolve(bh.ifWantsToBe);
            return;
        }
        const controller = new AbortController();
        bh.addEventListener('latest-behavior-changed', e => {
            const detail = e.detail;
            const { localName, ifWantsToBe } = detail.value;
            if (localName === decoratorName) {
                resolve(ifWantsToBe);
                controller.abort();
            }
        });
    });
}
