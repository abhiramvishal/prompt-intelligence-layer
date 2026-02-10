import { OptimizationRule } from './base/OptimizationRule';
import { RuleResult, RuleSeverity, Suggestion } from '../types';

/**
 * VagueReferenceRule detects vague pronouns (this, it, that, these, those)
 * used without clear antecedents in prompts.
 */
export class VagueReferenceRule extends OptimizationRule {
  private readonly codeBlockPattern = /```[\s\S]*?```/g;

  constructor() {
    super({
      name: 'VagueReference',
      description: 'Detects vague pronouns without clear context',
      enabled: true,
      severity: RuleSeverity.warning,
    });
  }

  public analyze(prompt: string): RuleResult {
    const vaguePronouns = ['this', 'it', 'that', 'these', 'those'];
    const codeBlocks = prompt.match(this.codeBlockPattern) || [];
    const promptWithoutCodeBlocks = prompt.replace(
      this.codeBlockPattern,
      ''
    );

    const suggestions: Suggestion[] = [];
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
