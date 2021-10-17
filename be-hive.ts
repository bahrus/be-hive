import {XE} from 'xtal-element/src/XE.js';
import {BeHiveProps, BeHiveActions} from './types';

export class BeHiveCore extends HTMLElement implements BeHiveActions{

    onOverrides({overrides}: this){
        const rn = this.getRootNode() as any;
        const host = rn.host;
        if(!rn.host) return;
        const parentRn = rn.host.getRootNode();
        const hive = {...parentRn[Symbol.for('be-hive')], ...overrides};
        for(const key in hive){
            const el = document.createElement(key);
            el.setAttribute('if-wants-to-be', hive[key]);
            rn.appendChild(el);
        }
    }
}

export interface BeHiveCore extends BeHiveProps{}

const tagName = 'be-hive';

const xe = new XE<BeHiveProps, BeHiveActions>({
    config:{
        tagName,
        propDefaults:{
            overrides: {}
        },
        actions:{
            onOverrides:{
                ifAllOf:['overrides']
            }
        },
        style:{
            display: 'none',
        }
    },
    superclass: BeHiveCore
});

export const BeHive = xe.classDef!;
