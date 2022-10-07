export function getLocalName(peerCitizen: Element, decoratorName: string): Promise<string>{
    return new Promise((resolve, reject) => {
        const rn = peerCitizen.getRootNode() as Element;
        const bh = rn.querySelector('be-hive');
        if(bh === null) {
            reject('404');
            return;
        }
        
        const wc = bh.querySelector(decoratorName);
        if(wc !== null){
            resolve((<any>bh).ifWantsToBe);
            return;
        }
        const controller = new AbortController();
        bh.addEventListener('latest-behavior-changed', e => {
            const detail = (e as CustomEvent).detail;
            if(detail.localName === decoratorName){
                resolve(detail.ifWantsToBe);
                controller.abort();
            }
        });
    });

}