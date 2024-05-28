import {AttrMapConfig} from 'trans-render/be/types';
import { AttrChangeInfo } from '../mount-observer/types';
import { IObject$tring } from '../trans-render/types';

export async function prsObj(prop: AttrMapConfig, newValue: string, initialPropValues: any, attr: AttrChangeInfo){
    const {instanceOf, mapsTo, valIfFalsy} = prop;
    let valToSet = newValue;
    if(valIfFalsy !== undefined && !newValue && mapsTo){
        initialPropValues[mapsTo] = valIfFalsy;
    }else{
        switch(instanceOf){
            case 'Object':
                try{
                    valToSet = JSON.parse(newValue);
                }catch(e){
                    throw {err: 400, attr, newValue};
                }
                if(mapsTo === undefined) throw 400;
                if(mapsTo === '.'){
                    Object.assign(initialPropValues, valToSet);
                }else{
                    initialPropValues[mapsTo] = valToSet;
                }
                break;
            case 'String':
                initialPropValues[mapsTo!] = valToSet;
                break;
            case 'Object$tring':
            case 'Object$entences':
                const {strValMapsTo, objValMapsTo, arrValMapsTo} = prop;
                let parsedObj : IObject$tring | undefined;
                switch(instanceOf){
                    case 'Object$tring':
                        const {Object$tring} = await import('trans-render/Object$tring.js');
                        parsedObj = new Object$tring(newValue);
                        break;
                    case 'Object$entences':
                        const {Object$entences} = await import('trans-render/Object$entences.js');
                        parsedObj = new Object$entences(newValue, prop);
                        break;
                }
                
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
                break;
            default:
                throw 'NI';
        }
    }

}