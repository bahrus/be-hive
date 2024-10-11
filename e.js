export function e(matchingElement, ws, ac) {
    for (const w of ws) {
        if (!matchingElement.matches(w.q))
            continue;
        const { listeners } = w;
        for (const key in listeners) {
            let listener = listeners[key];
            if (listener.toString().substring(0, 5) === 'class') {
                listener = new listener();
            }
            //TODO:  abort signal
            if (ac !== undefined) {
                matchingElement.addEventListener(key, listener, { signal: ac.signal });
            }
            else {
                matchingElement.addEventListener(key, listener);
            }
        }
    }
}
