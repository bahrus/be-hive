import { parseGroupedCaptureStatements as pgcs} from 'nested-regex-groups/parse-grouped-capture-statements.js';
import { ParserContext } from '../types/assign-gingerly/types.d.js';
import { PatternConfig } from '../types/nested-regex-groups/types.js';

/**
 * 
 * @param {string} value 
 * @param {*} context 
 */
export default function parseGroupedCaptureStatements(value: string, context: ParserContext){
    const result = pgcs(value, context.attrConfig.parserConfig as PatternConfig[]);
    return result;
}