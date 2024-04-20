import {BeHive} from './be-hive.js';

export async function toTempl(templ: Element, fromShadow: boolean, relativeTo: Element){
    let templateToClone = templ as HTMLTemplateElement;
    if(templateToClone.localName !== 'template'){
        templateToClone = document.createElement('template');
        if(fromShadow){
            const beHive = (templ.shadowRoot!).querySelector('be-hive') as BeHive;
            if(beHive){
                const div = document.createElement('div');
                div.innerHTML = templ.shadowRoot!.innerHTML;
                const beatified = await beHive.beatify(div) as any as Element;
                templateToClone.innerHTML = beatified.innerHTML;
            }else{
                templateToClone.innerHTML = templ.shadowRoot!.innerHTML;
            }
        }else{
            const beHive = (relativeTo.getRootNode() as DocumentFragment).querySelector('be-hive') as BeHive;
            const beatified = await beHive.beatify(templ) as any as HTMLTemplateElement;
            templateToClone.innerHTML = beatified.innerHTML;
            
        }
    }
    return templateToClone;
}