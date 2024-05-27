import {AttrMapConfig} from 'trans-render/be/types';
import { AttrChangeInfo } from '../mount-observer/types';

export async function prsObj(prop: AttrMapConfig, newValue: string, initialPropValues: any, attr: AttrChangeInfo){
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
            case 'Object$tring':
                const {Object$tring} = await import('trans-render/Object$tring.js');
                const parsedObj = new Object$tring(newValue);
                const {strValMapsTo, objValMapsTo, arrValMapsTo} = prop;
                if(parsedObj.strVal && strValMapsTo !== undefined){
                    initialPropValues[strValMapsTo] = parsedObj.strVal;
                }
                if(parsedObj.objVal && objValMapsTo !== undefined){
                    if(objValMapsTo === '.'){
                        Object.assign(initialPropValues, parsedObj.objVal);
                    }else{
                        initialPropValues[objValMapsTo] = parsedObj.objVal;
                    }
                }else if(parsedObj.arrVal && arrValMapsTo !== undefined){
                    initialPropValues[arrValMapsTo] = parsedObj.arrVal;
                }
            default:
                throw 'NI';
        }
    }

}