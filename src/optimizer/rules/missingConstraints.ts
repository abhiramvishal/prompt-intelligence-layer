/**
 * MissingConstraintsRule detects implementation requests lacking explicit constraints.
 * It suggests adding sections like:
 * - Requirements:
 * - Constraints:
 * - Edge cases:
 * Pattern-based detection for performance.
 */
import { RuleResult, Suggestion, RuleSeverity } from '../../types'
import { Rule } from './base'

export class MissingConstraintsRule extends Rule {
  readonly name = 'MissingConstraints'

  analyze(text: string): RuleResult {
    const codeFree = this.stripCode(text)
    const actionVerbs = /(implement|build|develop|design|create)/gi
    const matches: RegExpExecArray[] = []
    let m: RegExpExecArray | null
    while ((m = actionVerbs.exec(codeFree)) !== null) {
      matches.push(m)
    }

    const suggestions: Suggestion[] = []
    let detected = matches.length > 0

    if (detected) {
      const headersPresent = /(Requirements:|Constraints:|Edge cases:)/.test(codeFree)
      if (!headersPresent) {
        suggestions.push({
          message: "Add a 'Requirements:' section to specify needs",
          replacement: undefined,
          confidence: 0.8
        })
        suggestions.push({
          message: "Add a 'Constraints:' section to capture limitations",
          replacement: undefined,
          confidence: 0.8
        })
        suggestions.push({
          message: "Add an 'Edge cases:' section to document boundary conditions",
          replacement: undefined,
          confidence: 0.8
        })
      } else {
        // If headers exist, still suggest a recap for completeness
        suggestions.push({
          message: 'Consider reviewing/expanding constraint sections to cover edge cases and performance',
          replacement: undefined,
          confidence: 0.6
        })
      }
    }

    return {
      ruleName: this.name,
      detected,
      suggestions,
      severity: RuleSeverity.info
    }
  }

  private stripCode(input: string): string {
    let s = input
    s = s.replace(/```[\s\S]*?```/g, '')
    s = s.replace(/`[^`]*`/g, '')
    return s
  }
}
