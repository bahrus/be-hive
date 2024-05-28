import {AttrMapConfig} from 'trans-render/be/types';
import { AttrChangeInfo } from '../mount-observer/types';
import { IObject$tring } from '../trans-render/types';

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
                const {Object$Stringer, strValMapsTo, objValMapsTo, arrValMapsTo} = prop;
                let parsedObj : IObject$tring | undefined;
                if(Object$Stringer !== undefined){
                    const Stringer = await Object$Stringer();
                    parsedObj = new Stringer(newValue)
                }else{
                    const {Object$tring} = await import('trans-render/Object$tring.js');
                    parsedObj = new Object$tring(newValue);
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
            default:
                throw 'NI';
        }
    }

}