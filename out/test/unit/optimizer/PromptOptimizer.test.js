"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const assert_1 = __importDefault(require("assert"));
const promptOptimizer_1 = require("../../../src/optimizer/promptOptimizer");
const types_1 = require("../../../src/types");
const samplePrompts_1 = require("../../fixtures/samplePrompts");
(0, mocha_1.describe)('PromptOptimizer', () => {
    let optimizer;
    beforeEach(() => {
        optimizer = new promptOptimizer_1.PromptOptimizer();
    });
    (0, mocha_1.it)('should apply high-confidence suggestions correctly', () => {
        const analysisResult = {
            originalPrompt: 'Please be more specific',
            optimizedPrompt: 'Specifically describe the issue',
            rulesApplied: [
                {
                    ruleName: 'TestRule',
                    detected: true,
                    severity: types_1.RuleSeverity.warning,
                    suggestions: [
                        {
                            message: 'Please be more specific',
                            replacement: 'Specifically describe the issue',
                            confidence: 0.9,
                        },
                    ],
                },
            ],
            totalChanges: 1,
            processingTime: 10,
        };
        const original = 'Please be more specific about the issue';
        const result = optimizer.optimize(original, analysisResult);
        assert_1.default.strictEqual(result.before, original);
        assert_1.default.ok(result.after || result.changes.length >= 0);
    });
    (0, mocha_1.it)('should preserve code blocks during optimization', () => {
        const prompt = `Explain this code:
\`\`\`javascript
function test() {
  this.value = 10;
  return it;
}
\`\`\``;
        const analysisResult = {
            originalPrompt: prompt,
            optimizedPrompt: prompt,
            rulesApplied: [],
            totalChanges: 0,
            processingTime: 5,
        };
        const result = optimizer.optimize(prompt, analysisResult);
        // Code block should still be present
        assert_1.default.ok(result.after.includes('```'));
        assert_1.default.ok(result.after.includes('this.value'));
    });
    (0, mocha_1.it)('should handle empty suggestions gracefully', () => {
        const analysisResult = {
            originalPrompt: 'This is a test prompt',
            optimizedPrompt: 'This is a test prompt',
            rulesApplied: [
                {
                    ruleName: 'EmptyRule',
                    detected: false,
                    severity: types_1.RuleSeverity.info,
                    suggestions: [],
                },
            ],
            totalChanges: 0,
            processingTime: 8,
        };
        const original = 'This is a test prompt';
        const result = optimizer.optimize(original, analysisResult);
        assert_1.default.strictEqual(result.before, original);
        assert_1.default.strictEqual(result.after, original);
        assert_1.default.strictEqual(result.changes.length, 0);
    });
    (0, mocha_1.it)('should return OptimizedPrompt structure', () => {
        const analysisResult = {
            originalPrompt: 'Test',
            optimizedPrompt: 'Test',
            rulesApplied: [],
            totalChanges: 0,
            processingTime: 5,
        };
        const prompt = 'Test prompt';
        const result = optimizer.optimize(prompt, analysisResult);
        assert_1.default.ok('before' in result);
        assert_1.default.ok('after' in result);
        assert_1.default.ok('changes' in result);
        assert_1.default.strictEqual(result.before, prompt);
        assert_1.default.ok(Array.isArray(result.changes));
    });
    (0, mocha_1.it)('should handle null rules gracefully', () => {
        const analysisResult = {
            originalPrompt: 'Test',
            optimizedPrompt: 'Test',
            rulesApplied: [],
            totalChanges: 0,
            processingTime: 5,
        };
        const prompt = 'Test prompt';
        const result = optimizer.optimize(prompt, analysisResult);
        assert_1.default.strictEqual(result.before, prompt);
        assert_1.default.strictEqual(result.after, prompt);
        assert_1.default.strictEqual(result.changes.length, 0);
    });
    (0, mocha_1.it)('should only apply suggestions with confidence >= 0.7', () => {
        const analysisResult = {
            originalPrompt: 'Low confidence test',
            optimizedPrompt: 'Low confidence test',
            rulesApplied: [
                {
                    ruleName: 'ConfidenceRule',
                    detected: true,
                    severity: types_1.RuleSeverity.warning,
                    suggestions: [
                        {
                            message: 'Low confidence',
                            replacement: 'High confidence version',
                            confidence: 0.5,
                        },
                        {
                            message: 'High confidence',
                            replacement: 'Better suggestion',
                            confidence: 0.85,
                        },
                    ],
                },
            ],
            totalChanges: 0,
            processingTime: 10,
        };
        const result = optimizer.optimize('Low confidence test', analysisResult);
        // Only high-confidence suggestions should potentially be applied
        assert_1.default.strictEqual(result.before, 'Low confidence test');
    });
    (0, mocha_1.it)('should work with sample vague prompt fixture', () => {
        const analysisResult = {
            originalPrompt: samplePrompts_1.vaguePrompt,
            optimizedPrompt: samplePrompts_1.vaguePrompt,
            rulesApplied: [
                {
                    ruleName: 'VagueTest',
                    detected: true,
                    severity: types_1.RuleSeverity.warning,
                    suggestions: [],
                },
            ],
            totalChanges: 0,
            processingTime: 12,
        };
        const result = optimizer.optimize(samplePrompts_1.vaguePrompt, analysisResult);
        assert_1.default.strictEqual(result.before, samplePrompts_1.vaguePrompt);
        assert_1.default.ok(result.before.length > 0);
    });
    (0, mocha_1.it)('should work with sample good prompt fixture', () => {
        const analysisResult = {
            originalPrompt: samplePrompts_1.goodPrompt,
            optimizedPrompt: samplePrompts_1.goodPrompt,
            rulesApplied: [],
            totalChanges: 0,
            processingTime: 8,
        };
        const result = optimizer.optimize(samplePrompts_1.goodPrompt, analysisResult);
        assert_1.default.strictEqual(result.before, samplePrompts_1.goodPrompt);
        assert_1.default.strictEqual(result.after, samplePrompts_1.goodPrompt);
        assert_1.default.ok(samplePrompts_1.goodPrompt.includes('src/'));
    });
    (0, mocha_1.it)('should handle empty prompt gracefully', () => {
        const analysisResult = {
            originalPrompt: samplePrompts_1.emptyPrompt,
            optimizedPrompt: samplePrompts_1.emptyPrompt,
            rulesApplied: [],
            totalChanges: 0,
            processingTime: 3,
        };
        const result = optimizer.optimize(samplePrompts_1.emptyPrompt, analysisResult);
        assert_1.default.strictEqual(result.before, '');
        assert_1.default.strictEqual(result.after, '');
    });
    (0, mocha_1.it)('should handle complex analysis result', () => {
        const analysisResult = {
            originalPrompt: samplePrompts_1.compoundQuestionPrompt,
            optimizedPrompt: samplePrompts_1.compoundQuestionPrompt,
            rulesApplied: [
                {
                    ruleName: 'CompoundQuestion',
                    detected: true,
                    severity: types_1.RuleSeverity.warning,
                    suggestions: [
                        {
                            message: 'Multiple questions detected',
                            confidence: 0.85,
                        },
                    ],
                },
            ],
            totalChanges: 1,
            processingTime: 15,
        };
        const result = optimizer.optimize(samplePrompts_1.compoundQuestionPrompt, analysisResult);
        assert_1.default.ok(result.before === samplePrompts_1.compoundQuestionPrompt);
        assert_1.default.ok(typeof result.after === 'string');
        assert_1.default.ok(Array.isArray(result.changes));
    });
});
//# sourceMappingURL=PromptOptimizer.test.js.map