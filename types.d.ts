export type stringArray = string | Array<string>;
export interface AttrParts{
    root: string,
    base: string,
    branch: string,
    leaf: string,
} 

type CSSQuery = string;

type delimiter = '-' | ':' | '--';

export interface ObservedAttributes<TBranches = any>{
    enhancedElementInstanceOf?: Array<{new(): HTMLElement}>
    enhancedElementMatches?: string,
    rootOnBuiltIns?: stringArray,
    rootOnCustom?: stringArray,
    preBaseDelimiter: delimiter;
    base?: string,
    preBranchDelimiter: delimiter;
    branches?: stringArray,
    preLeafDelimiter: delimiter;
    leaves?: Partial<{[key in keyof TBranches & string]: stringArray}>,
    hostMatches?: CSSQuery,
    hostInstanceOf?: Array<{new(): HTMLElement}>
    do?: {
        mount: {
            import: (parts: AttrParts) => Promise<{new(): HTMLElement}>, //Roundabout ready
            enhancementPath?: string,
            mapTo?: (parts: AttrParts) => string,
            parse: (parts: AttrParts, val: string | null) => any,

        }
        

    } 
}