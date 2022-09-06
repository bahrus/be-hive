import {BeDecoratedProps} from 'be-decorated/types';

export interface BehaviorKeys {
    ifWantsToBe: string,
    upgrade: string,
    localName: string,
    block?: boolean,
}


export interface BeHiveProps{
    overrides: {[key: string]: BehaviorKeys};
    isC: boolean;
    registeredBehaviors: {[key: string]: BehaviorKeys};
    latestBehaviors: BehaviorKeys[];
    beSevered: boolean
}

export interface BeHiveActions{
    intro(self: this): void;
    //onOverrides(self: this): void;
    onLatestBehaviors(self: this): void;
    register(instance: BehaviorKeys): Element | undefined;
}