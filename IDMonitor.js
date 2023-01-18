export class IDMonitor {
    instance;
    #mut;
    constructor(instance) {
        this.instance = instance;
        const config = { childList: true };
        instance.querySelectorAll('*').forEach(item => {
            const { id } = item;
            if (id) {
                instance.define(item, false);
            }
        });
        this.#mut = new MutationObserver((mutationList) => {
            for (const mutation of mutationList) {
                const { addedNodes } = mutation;
                if (addedNodes !== undefined) {
                    for (const addedNode of addedNodes) {
                        const { id } = addedNode;
                        if (id) {
                            instance.define(addedNode, false);
                        }
                    }
                }
            }
        });
        this.#mut.observe(instance, config);
    }
    dispose() {
        this.#mut.disconnect();
    }
}
