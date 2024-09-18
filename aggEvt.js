export const rguid = 'XM5dz7tqZkeFCtytNXHPzw';
export class AggEvent extends Event {
    r = rguid;
    args;
    f;
    target;
    constructor(type, args, f, target) {
        super(type);
        this.args = args;
        this.f = f;
        this.target = target;
    }
}
export const aggs = {
    '+': (e) => e.r = e.args.reduce((acc, arg) => acc + arg),
    '*': (e) => e.r = e.args.reduce((acc, arg) => acc * arg),
    max: (e) => e.r = Math.max(...e.args),
    min: (e) => e.r = Math.min(...e.args),
    nearlyEq: (e) => e.r = Math.max(...e.args) - Math.min(...e.args) < Number(e.target.dataset.maxDiff),
    //eq: (e: AggEvent) => e.r = Math.max(...(e.args as Array<number>)) === Math.min(...(e.args as Array<number>)),
    eq: (e) => e.r = e.args?.length === 0 ? true : e.args.find(x => e.args[0] !== x) === undefined,
    '||': (e) => e.r = e.args.reduce((acc, arg) => acc || arg),
    '&&': (e) => e.r = e.args.reduce((acc, arg) => acc && arg),
    '{}': (e) => e.r = e.f,
};
