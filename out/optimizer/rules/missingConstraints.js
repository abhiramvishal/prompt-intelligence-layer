"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingConstraintsRule = void 0;
/**
 * MissingConstraintsRule detects implementation requests lacking explicit constraints.
 * It suggests adding sections like:
 * - Requirements:
 * - Constraints:
 * - Edge cases:
 * Pattern-based detection for performance.
 */
const types_1 = require("../../types");
const base_1 = require("./base");
class MissingConstraintsRule extends base_1.Rule {
    constructor() {
        super(...arguments);
        this.name = 'MissingConstraints';
    }
    analyze(text) {
        const codeFree = this.stripCode(text);
        const actionVerbs = /(implement|build|develop|design|create)/gi;
        const matches = [];
        let m;
        while ((m = actionVerbs.exec(codeFree)) !== null) {
            matches.push(m);
        }
        const suggestions = [];
        let detected = matches.length > 0;
        if (detected) {
            const headersPresent = /(Requirements:|Constraints:|Edge cases:)/.test(codeFree);
            if (!headersPresent) {
                suggestions.push({
                    message: "Add a 'Requirements:' section to specify needs",
                    replacement: undefined,
                    confidence: 0.8
                });
                suggestions.push({
                    message: "Add a 'Constraints:' section to capture limitations",
                    replacement: undefined,
                    confidence: 0.8
                });
                suggestions.push({
                    message: "Add an 'Edge cases:' section to document boundary conditions",
                    replacement: undefined,
                    confidence: 0.8
                });
            }
            else {
                // If headers exist, still suggest a recap for completeness
                suggestions.push({
                    message: 'Consider reviewing/expanding constraint sections to cover edge cases and performance',
                    replacement: undefined,
                    confidence: 0.6
                });
            }
        }
        return {
            ruleName: this.name,
            detected,
            suggestions,
            severity: types_1.RuleSeverity.info
        };
    }
    stripCode(input) {
        let s = input;
        s = s.replace(/```[\s\S]*?```/g, '');
        s = s.replace(/`[^`]*`/g, '');
        return s;
    }
}
exports.MissingConstraintsRule = MissingConstraintsRule;
//# sourceMappingURL=missingConstraints.js.map