import {parsePatternStatements as pps} from 'nested-regex-groups/parse-pattern-statements.js';
import { ParserContext } from '../types/assign-gingerly/types.d.js';
import { PatternConfig } from '../types/nested-regex-groups/types.js';

/**
 * 
 * @param {string} value 
 * @param {*} context 
 */
export default function parsePatternStatements(value: string, context: ParserContext){
    const result = pps(value, context.attrConfig.parserConfig as PatternConfig[]);
    return result;
}