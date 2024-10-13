export function w(q, ws, callback) {
    const returnObj = new W(q, callback);
    ws.push(returnObj);
    return returnObj;
}
export class W {
    q;
    w;
    constructor(q, w) {
        this.q = q;
        this.w = w;
    }
    #listeners = {};
    get listeners() {
        return this.#listeners;
    }
    #props = {};
    get props() {
        return this.#props;
    }
    #refs = {};
    get refs() {
        return this.#refs;
    }
    /**
     * add events
     * @param eventsToAdd
     * @returns
     */
    a(eventsToAdd) {
        this.#listeners = { ...this.#listeners, ...eventsToAdd };
        return this;
    }
    /**
     * set props
     * @param props
     * @returns
     */
    s(props) {
        this.#props = { ...this.#props, ...props };
        return this;
    }
    /**
     * register refs
     * @param refs
     * @returns
     */
    r(refs) {
        this.#refs = { ...this.#refs, ...refs };
        return this;
    }
}
