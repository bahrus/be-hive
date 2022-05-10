import {BeHiveActions} from './types';
import('./be-hive.js');
export async function register(ifWantsToBe: string, upgrade: string, extTagName: string){
    let beHive = document.querySelector('be-hive') as Element & BeHiveActions;
    if(beHive===null){
        beHive = document.body.appendChild(document.createElement('be-hive'))  as any as Element & BeHiveActions;
    }
    await customElements.whenDefined('be-hive');
    return beHive.register({
        ifWantsToBe,
        upgrade,
        localName: extTagName,
    });
    
}