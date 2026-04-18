import { parsePatternStatements as pps } from 'nested-regex-groups/parse-pattern-statements.js';
/**
 *
 * @param {string} value
 * @param {*} context
 */
export default function parsePatternStatements(value, context) {
    const result = pps(value, context.attrConfig.parserConfig);
    return result;
}
