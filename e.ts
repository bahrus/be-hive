import { IW } from "./ts-refs/trans-render/be/types";

export function e(matchingElement: Element, ws: Array<IW>){
    for(const w of ws){
        if(!matchingElement.matches(w.q)) continue;
        
    }
}