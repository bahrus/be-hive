
export interface BeHiveProps{
    overrides: {[key: string]: string}
}

export interface BeHiveActions{
    onOverrides(self: this): void;
}