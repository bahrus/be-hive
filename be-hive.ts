import {ObservedAttributes} from './types';
export {MountBeHive} from './types'

export const defaultObsAttrs: ObservedAttributes = {
    rootOnCustom: ['enh-', 'data-enh'],
    rootOnBuiltIns: ['', 'enh-', 'data-enh'],
    preBaseDelimiter: '-',
    preBranchDelimiter: '-',
    preLeafDelimiter: '--',
};

export class BeHive extends HTMLElement{
    
}