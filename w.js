export function w(q, ws) {
    const returnObj = new W(q);
    ws.push(returnObj);
    return returnObj;
}
export class W {
    q;
    constructor(q) {
        this.q = q;
    }
    #a = {};
    a(eventsToAdd) {
        this.#a = { ...this.#a, ...eventsToAdd };
        return this;
    }
}
