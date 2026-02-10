"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompoundQuestionRule = void 0;
/**
 * CompoundQuestionRule detects prompts that contain multiple questions
 * connected by conjunctions, suggesting splitting into numbered questions.
 * This is a pattern-based rule (no AI) for fast performance (<20ms).
 */
const types_1 = require("../../types");
const base_1 = require("./base");
class CompoundQuestionRule extends base_1.Rule {
    constructor() {
        super(...arguments);
        /** Rule name */
        this.name = 'CompoundQuestion';
    }
    /** Analyze the text for multiple questions and connectives */
    analyze(text) {
        // Remove code blocks to avoid false positives
        const codeFree = this.stripCode(text);
        // Count standalone question marks in the cleaned text
        const qCount = (codeFree.match(/\?/g) || []).length;
        const suggestions = [];
        const detected = qCount >= 2;
        if (detected) {
            const hasConjunction = /\b(and|also|additionally)\b/i.test(codeFree);
            const message = hasConjunction
                ? 'Multiple questions detected with connecting words; consider splitting into numbered questions'
                : 'Multiple questions detected; consider splitting into numbered questions';
            suggestions.push({
                message,
                replacement: undefined,
                confidence: hasConjunction ? 0.75 : 0.65
            });
        }
        return {
            ruleName: this.name,
            detected,
            suggestions,
            severity: types_1.RuleSeverity.warning
        };
    }
    /** Strip code blocks to avoid false positives from code snippets */
    stripCode(input) {
        let s = input;
        s = s.replace(/```[\s\S]*?```/g, '');
        s = s.replace(/`[^`]*`/g, '');
        return s;
    }
}
exports.CompoundQuestionRule = CompoundQuestionRule;
//# sourceMappingURL=compoundQuestion.js.map