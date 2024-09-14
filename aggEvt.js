export const rguid = 'XM5dz7tqZkeFCtytNXHPzw';
export class AggEvent extends Event {
    r = rguid;
    args;
    // /** 
    //  * Event view model
    //  * @type {{[key: string]: any}} 
    // */
    // f;
    /**
     * @type {Element}
     */
    target;
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
    constructor(args, target) {
        super('aggEvt');
        this.args = args;
        this.target = target;
    }
}
export const aggs = {
    '+': (e) => e.r = e.args.reduce((acc, arg) => acc + arg),
    '*': (e) => e.r = e.args.reduce((acc, arg) => acc * arg),
    max: (e) => e.r = Math.max(...e.args),
    min: (e) => e.r = Math.min(...e.args),
    nearlyEq: (e) => e.r = Math.max(...e.args) - Math.min(...e.args) < Number(e.target.dataset.maxDiff)
};
