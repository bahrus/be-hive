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

export type stringArray = string | Array<string>;
export interface AttrParts{
    root: string,
    base: string,
    branch: string,
    leaf: string,
} 

type CSSQuery = string;

type delimeter = '-' | ':' | '--';

export interface ObservedAttributes<TBranches = any>{
    enhancedElementInstanceOf?: Array<{new(): HTMLElement}>
    enhancedElementMatches?: string,
    rootOnBuiltIns?: stringArray,
    rootOnBuiltInsInheritsFromRootOnCustom?: boolean,
    rootOnCustom?: stringArray,
    preBaseDelimiter: delimeter;
    base?: string,
    preBranchDelimeter: delimeter;
    branches?: stringArray,
    preLeafDelimiter: delimeter;
    leaves: Partial<{[key in keyof TBranches & string]: stringArray}>,
    hostMatches: CSSQuery
    do?: {
        mount: {
            import: (parts: AttrParts) => Promise<{new(): HTMLElement}>, //Roundabout ready
            enhancementPath?: string,
            mapTo?: (parts: AttrParts) => string,
            parse: (parts: AttrParts, val: string | null) => any,

        }
        

    } 
}