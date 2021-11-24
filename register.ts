import {BeHiveActions} from './types';
import('./be-hive.js');
export function register(ifWantsToBe: string, upgrade: string, extTagName: string){
    let beHive = document.querySelector('be-hive') as Element & BeHiveActions;
    if(beHive===null){
        beHive = document.body.appendChild(document.createElement('be-hive'))  as any as Element & BeHiveActions;
    }
    customElements.whenDefined('be-hive').then(() => {
        beHive.register({
            ifWantsToBe,
            upgrade,
            localName: extTagName,
        })
    });
    
}