import {BeHiveActions} from './types';
import('./be-hive.js');
export function register(ifWantsToBe: string, upgrade: string, extTagName: string){
    const beHive = document.querySelector('be-hive') as Element & BeHiveActions;
    if(beHive===null){
        document.body.appendChild(document.createElement('be-hive'));
    }
    customElements.whenDefined('be-hive').then(() => {
        beHive.register({
            ifWantsToBe,
            upgrade,
            localName: extTagName,
        })
    });
    
}