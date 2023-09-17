export interface BehaviorKeys {
    ifWantsToBe: string,
    upgrade: string,
    localName: string,
    block?: boolean,
    unblock?: boolean,
    disabled?: boolean,
    aspects?: string[],
}


export interface BeHiveProps{
    overrides: {[key: string]: BehaviorKeys};
    isC: boolean;
    registeredBehaviors: {[key: string]: BehaviorKeys};
    latestBehaviors: BehaviorKeys[];
    //refs: {[key: string]: Ref};
    beSevered: boolean;
    
}

export interface BeatifyOptions{
    cleanMicrodata?: boolean,
}

export interface BeHiveActions{
    intro(self: this): void;
    //onOverrides(self: this): void;
    onLatestBehaviors(self: this): void;
    register(instance: BehaviorKeys): Element | undefined;
}

export interface LatestBehaviorEvent{
    value: BehaviorKeys;
}

export interface IHasID{
    id: string;
}

// export interface Ref<TElement = IHasID, Meta = any>{
//     element: TElement,
//     meta: Meta
// }

export interface IDisposable{
    dispose(): void;
}

export type Disposable = {new(): IDisposable};

// export interface INewDefEvent{
//     value: Ref
// }