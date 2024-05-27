import {AttrMapConfig} from 'trans-render/be/types';
import { AttrChangeInfo } from '../mount-observer/types';

export function prsObj(prop: AttrMapConfig, newValue: string, initialPropValues: any, attr: AttrChangeInfo){
    const {instanceOf, mapsTo, valIfFalsy} = prop;
    let valToSet = newValue;
    if(valIfFalsy !== undefined && !newValue){
        initialPropValues[mapsTo] = valIfFalsy;
    }else{
        switch(instanceOf){
            case 'Object':
                try{
                    valToSet = JSON.parse(newValue);
                }catch(e){
                    throw {err: 400, attr, newValue};
                }
                if(mapsTo === '.'){
                    Object.assign(initialPropValues, valToSet);
                }else{
                    initialPropValues[mapsTo] = valToSet;
                }
                break;
            case 'String':
                initialPropValues[mapsTo] = valToSet;
                break;
            default:
                throw 'NI';
        }
    }

}