import {BeDecoratedProps} from 'be-decorated/types';

export interface BehaviorKeys {
    ifWantsToBe: string,
    upgrade: string,
    localName: string,
    block?: boolean,
    unblock?: boolean,
    disabled?: boolean,
}


export interface BeHiveProps{
    overrides: {[key: string]: BehaviorKeys};
    isC: boolean;
    registeredBehaviors: {[key: string]: BehaviorKeys};
    latestBehaviors: BehaviorKeys[];
    refs: {[key: string]: IHasID};
    beSevered: boolean
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