export async function toTempl(templ, fromShadow, relativeTo) {
    let templateToClone = templ;
    if (templateToClone.localName !== 'template') {
        templateToClone = document.createElement('template');
        if (fromShadow) {
            const beHive = (templ.shadowRoot).querySelector('be-hive');
            if (beHive) {
                const div = document.createElement('div');
                div.innerHTML = templ.shadowRoot.innerHTML;
                const beatified = await beHive.beatify(div);
                templateToClone.innerHTML = beatified.innerHTML;
            }
            else {
                templateToClone.innerHTML = templ.shadowRoot.innerHTML;
            }
        }
        else {
            const beHive = relativeTo.getRootNode().querySelector('be-hive');
            const beatified = await beHive.beatify(templ);
            templateToClone.innerHTML = beatified.innerHTML;
        }
    }
    return templateToClone;
}
