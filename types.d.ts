import {RootCnfg} from 'mount-observer/types';
export type stringArray = string | Array<string>;

export type stringArrayOrTree = Array<string> | [string, Array<string>];
export interface AttrParts{
    root: string,
    base: string,
    branch: string,
    leaf: string,
} 

type CSSQuery = string;

type delimiter = '-' | ':' | '--';

export interface ObservedAttributes<TBranches = any>{
    enhancedElementInstanceOf?: Array<{new(): Element}>,
    enhancedElementMatches?: string,
    hasRootIn: Array<RootCnfg>,
    preBaseDelimiter: delimiter,
    base: string,
    preBranchDelimiter: delimiter,
    branches?: Array<string>,
    watchedBranches?: Array<string>,
    preLeafDelimiter: delimiter,
    leaves?: Partial<{[key in keyof TBranches & string]: stringArray}>,
    hostMatches?: CSSQuery,
    hostInstanceOf?: Array<{new(): HTMLElement}>,
    block?: boolean,
    unblock?: boolean,
    do?: {
        mount: {
            import: (parts: AttrParts) => Promise<{new(): HTMLElement}>, //Roundabout ready
            enhancementPath?: string,
            mapTo?: (parts: AttrParts) => string,
            parse: (parts: AttrParts, val: string | null) => any,

        },

        

    } 
}

export type MountBeHive<TBranches = any> = Partial<ObservedAttributes<TBranches>>

export type RegistryEventName = 'load';
export interface RegistryEvent<TBranches = any>{
    mountBeHive: MountBeHive<TBranches>
}