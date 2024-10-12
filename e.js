export function e(matchingElement, ws, initialPropVals, ac) {
    const matchingWs = [];
    for (const w of ws) {
        if (!matchingElement.matches(w.q))
            continue;
        matchingWs.push(w);
        const { listeners, props } = w;
        for (const key in listeners) {
            let listener = listeners[key];
            if (listener.toString().substring(0, 5) === 'class') {
                listener = new listener();
            }
            matchingElement.addEventListener(key, listener, { signal: ac?.signal });
        }
        Object.assign(initialPropVals, props);
    }
    return matchingWs;
}
