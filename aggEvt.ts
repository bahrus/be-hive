import { EventListenerOrFn } from "./ts-refs/trans-render/be/types";

export const rguid = 'XM5dz7tqZkeFCtytNXHPzw';
export abstract class AggEvent extends Event {
    r: any = rguid;
    args: Array<any>;
    // /** 
    //  * Event view model
    //  * @type {{[key: string]: any}} 
    // */
    // f;
    /**
     * @type {Element}
     */
    target 
    // /**
    //  * 
    //  * @param {Array<any>} args 
    //  * @param {{[key: string]: any}} f 
    //  */
    // constructor(args, f, target){
    //     super(CalcEvent.eventName);
    //     this.args = args;
    //     this.f = f;
    // }
    constructor(type: string, args: Array<any>, target: Element){
        super(type);
        this.args = args;
        this.target = target;
    }
}

export const aggs: {[key: string]: (e: AggEvent) => void} = {
    '+': (e: AggEvent) => e.r = e.args.reduce((acc, arg) => acc + arg),
    '*': (e: AggEvent) => e.r = e.args.reduce((acc, arg) => acc * arg),
    max: (e: AggEvent) => e.r = Math.max(...(e.args as Array<number>)),
    min: (e: AggEvent) => e.r = Math.min(...(e.args as Array<number>)),
    nearlyEq: (e: AggEvent) => e.r = Math.max(...(e.args as Array<number>)) - Math.min(...(e.args as Array<number>)) < Number((e.target as HTMLElement).dataset.maxDiff)
};

