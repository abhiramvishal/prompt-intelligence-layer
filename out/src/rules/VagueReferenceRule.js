"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VagueReferenceRule = void 0;
const OptimizationRule_1 = require("./base/OptimizationRule");
const types_1 = require("../types");
/**
 * VagueReferenceRule detects vague pronouns (this, it, that, these, those)
 * used without clear antecedents in prompts.
 */
class VagueReferenceRule extends OptimizationRule_1.OptimizationRule {
    constructor() {
        super({
            name: 'VagueReference',
            description: 'Detects vague pronouns without clear context',
            enabled: true,
            severity: types_1.RuleSeverity.warning,
        });
        this.codeBlockPattern = /```[\s\S]*?```/g;
    }
    analyze(prompt) {
        const vaguePronouns = ['this', 'it', 'that', 'these', 'those'];
        const codeBlocks = prompt.match(this.codeBlockPattern) || [];
        const promptWithoutCodeBlocks = prompt.replace(this.codeBlockPattern, '');
        const suggestions = [];
        let detected = false;
        vaguePronouns.forEach((pronoun) => {
            const regex = new RegExp(`\\b${pronoun}\\b`, 'gi');
            let match;
            while ((match = regex.exec(promptWithoutCodeBlocks)) !== null) {
                detected = true;
                suggestions.push({
                    message: `Vague pronoun "${pronoun}" used without clear referent. Consider being more specific about what you're referring to.`,
                    confidence: 0.85,
                });
            }
        });
        return {
            ruleName: this.name,
            detected,
            suggestions: suggestions.slice(0, 3), // Limit to first 3 suggestions
            severity: this.severity,
        };
    }
}
exports.VagueReferenceRule = VagueReferenceRule;
//# sourceMappingURL=VagueReferenceRule.js.map