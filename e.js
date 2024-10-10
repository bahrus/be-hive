export function e(matchingElement, ws) {
    for (const w of ws) {
        if (!matchingElement.matches(w.q))
            continue;
    }
}
