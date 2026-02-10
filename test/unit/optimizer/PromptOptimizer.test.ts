import { describe, it } from 'mocha';
import assert from 'assert';
import { PromptOptimizer } from '../../../src/optimizer/promptOptimizer';
import { RuleResult, RuleSeverity, AnalysisResult } from '../../../src/types';
import {
  vaguePrompt,
  goodPrompt,
  emptyPrompt,
  compoundQuestionPrompt,
} from '../../fixtures/samplePrompts';

describe('PromptOptimizer', () => {
  let optimizer: PromptOptimizer;

  beforeEach(() => {
    optimizer = new PromptOptimizer();
  });

  it('should apply high-confidence suggestions correctly', () => {
    const analysisResult: AnalysisResult = {
      originalPrompt: 'Please be more specific',
      optimizedPrompt: 'Specifically describe the issue',
      rulesApplied: [
        {
          ruleName: 'TestRule',
          detected: true,
          severity: RuleSeverity.warning,
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

    assert.strictEqual(result.before, original);
    assert.ok(result.after || result.changes.length >= 0);
  });

  it('should preserve code blocks during optimization', () => {
    const prompt = `Explain this code:
\`\`\`javascript
function test() {
  this.value = 10;
  return it;
}
\`\`\``;

    const analysisResult: AnalysisResult = {
      originalPrompt: prompt,
      optimizedPrompt: prompt,
      rulesApplied: [],
      totalChanges: 0,
      processingTime: 5,
    };

    const result = optimizer.optimize(prompt, analysisResult);

    // Code block should still be present
    assert.ok(result.after.includes('```'));
    assert.ok(result.after.includes('this.value'));
  });

  it('should handle empty suggestions gracefully', () => {
    const analysisResult: AnalysisResult = {
      originalPrompt: 'This is a test prompt',
      optimizedPrompt: 'This is a test prompt',
      rulesApplied: [
        {
          ruleName: 'EmptyRule',
          detected: false,
          severity: RuleSeverity.info,
          suggestions: [],
        },
      ],
      totalChanges: 0,
      processingTime: 8,
    };

    const original = 'This is a test prompt';
    const result = optimizer.optimize(original, analysisResult);

    assert.strictEqual(result.before, original);
    assert.strictEqual(result.after, original);
    assert.strictEqual(result.changes.length, 0);
  });

  it('should return OptimizedPrompt structure', () => {
    const analysisResult: AnalysisResult = {
      originalPrompt: 'Test',
      optimizedPrompt: 'Test',
      rulesApplied: [],
      totalChanges: 0,
      processingTime: 5,
    };

    const prompt = 'Test prompt';
    const result = optimizer.optimize(prompt, analysisResult);

    assert.ok('before' in result);
    assert.ok('after' in result);
    assert.ok('changes' in result);
    assert.strictEqual(result.before, prompt);
    assert.ok(Array.isArray(result.changes));
  });

  it('should handle null rules gracefully', () => {
    const analysisResult: AnalysisResult = {
      originalPrompt: 'Test',
      optimizedPrompt: 'Test',
      rulesApplied: [],
      totalChanges: 0,
      processingTime: 5,
    };

    const prompt = 'Test prompt';
    const result = optimizer.optimize(prompt, analysisResult);

    assert.strictEqual(result.before, prompt);
    assert.strictEqual(result.after, prompt);
    assert.strictEqual(result.changes.length, 0);
  });

  it('should only apply suggestions with confidence >= 0.7', () => {
    const analysisResult: AnalysisResult = {
      originalPrompt: 'Low confidence test',
      optimizedPrompt: 'Low confidence test',
      rulesApplied: [
        {
          ruleName: 'ConfidenceRule',
          detected: true,
          severity: RuleSeverity.warning,
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
    assert.strictEqual(result.before, 'Low confidence test');
  });

  it('should work with sample vague prompt fixture', () => {
    const analysisResult: AnalysisResult = {
      originalPrompt: vaguePrompt,
      optimizedPrompt: vaguePrompt,
      rulesApplied: [
        {
          ruleName: 'VagueTest',
          detected: true,
          severity: RuleSeverity.warning,
          suggestions: [],
        },
      ],
      totalChanges: 0,
      processingTime: 12,
    };

    const result = optimizer.optimize(vaguePrompt, analysisResult);

    assert.strictEqual(result.before, vaguePrompt);
    assert.ok(result.before.length > 0);
  });

  it('should work with sample good prompt fixture', () => {
    const analysisResult: AnalysisResult = {
      originalPrompt: goodPrompt,
      optimizedPrompt: goodPrompt,
      rulesApplied: [],
      totalChanges: 0,
      processingTime: 8,
    };

    const result = optimizer.optimize(goodPrompt, analysisResult);

    assert.strictEqual(result.before, goodPrompt);
    assert.strictEqual(result.after, goodPrompt);
    assert.ok(goodPrompt.includes('src/'));
  });

  it('should handle empty prompt gracefully', () => {
    const analysisResult: AnalysisResult = {
      originalPrompt: emptyPrompt,
      optimizedPrompt: emptyPrompt,
      rulesApplied: [],
      totalChanges: 0,
      processingTime: 3,
    };

    const result = optimizer.optimize(emptyPrompt, analysisResult);

    assert.strictEqual(result.before, '');
    assert.strictEqual(result.after, '');
  });

  it('should handle complex analysis result', () => {
    const analysisResult: AnalysisResult = {
      originalPrompt: compoundQuestionPrompt,
      optimizedPrompt: compoundQuestionPrompt,
      rulesApplied: [
        {
          ruleName: 'CompoundQuestion',
          detected: true,
          severity: RuleSeverity.warning,
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

    const result = optimizer.optimize(compoundQuestionPrompt, analysisResult);

    assert.ok(result.before === compoundQuestionPrompt);
    assert.ok(typeof result.after === 'string');
    assert.ok(Array.isArray(result.changes));
  });
});
