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
    #listeners = {};
    get listeners() {
        return this.#listeners;
    }
    a(eventsToAdd) {
        this.#listeners = { ...this.#listeners, ...eventsToAdd };
        return this;
    }
}
