import { parseGroupedCaptureStatements as pgcs } from 'nested-regex-groups/parse-grouped-capture-statements.js';
/**
 *
 * @param {string} value
 * @param {*} context
 */
export default function parseGroupedCaptureStatements(value, context) {
    const result = pgcs(value, context.attrConfig.parserConfig);
    return result;
}
