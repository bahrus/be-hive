export class IDMonitor {
    instance;
    #mut;
    constructor(instance) {
        this.instance = instance;
        const config = { childList: true };
        instance.querySelectorAll('*').forEach(element => {
            const { id } = element;
            if (id) {
                instance.define({ element, meta: {} }, false);
            }
        });
        this.#mut = new MutationObserver((mutationList) => {
            for (const mutation of mutationList) {
                const { addedNodes } = mutation;
                if (addedNodes !== undefined) {
                    for (const addedNode of addedNodes) {
                        const element = addedNode;
                        const { id } = element;
                        if (id) {
                            instance.define({ element, meta: {} }, false);
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
