/**
 * VagueReferenceRule
 * Detects vague pronouns (this, it, that, these, those) that lack a clear referent.
 * Uses a simple heuristic to find potential referents outside code blocks and suggests replacements.
 * Performance target: typically < 20ms for short prompts.
 */
import { RuleResult, Suggestion, RuleSeverity } from '../../types'
import { Rule } from './base'

export class VagueReferenceRule extends Rule {
  /** Rule name */
  readonly name = 'VagueReference'

  /** Analyze text to find vague references and propose replacements */
  analyze(text: string): RuleResult {
    // Strip code blocks to avoid false positives
    const codeFree = this.stripCode(text)

    const pronRegex = /\\b(this|it|that|these|those)\\b/gi
    const matches: Array<{ pronoun: string; index: number }> = []
    let m: RegExpExecArray | null
    // Use a manual index search to capture positions
    while ((m = pronRegex.exec(codeFree)) !== null) {
      const pron = m[1]
      const index = m.index
      matches.push({ pronoun: pron, index })
    }

    const suggestions: Suggestion[] = []
    const replacements: Array<{ pronoun: string; replacement?: string }> = []

    for (const item of matches) {
      const pron = item.pronoun
      const afterIndex = item.index + pron.length
      const after = codeFree.substring(afterIndex)
      const replacement = this.findReplacementCandidate(after)
      replacements.push({ pronoun: pron, replacement })
      const message = replacement
        ? `Replace vague pronoun '${pron}' with '${replacement}'`
        : `Replace vague pronoun '${pron}' with a specific noun`
      suggestions.push({ message, replacement, confidence: replacement ? 0.75 : 0.6 })
    }

    const detected = matches.length > 0
    // Build result
    return {
      ruleName: this.name,
      detected,
      suggestions,
      severity: RuleSeverity.warning
    }
  }

  /** Remove code blocks (```...``` and `...`) from text */
  private stripCode(input: string): string {
    let s = input
    s = s.replace(/```[\s\S]*?```/g, '')
    s = s.replace(/`[^`]*`/g, '')
    return s
  }

  /** Heuristic: look for a noun after the pronoun within next up to 6 words */
  private findReplacementCandidate(after: string): string | undefined {
    const maxLookahead = 6
    const words = after.trim().split(/\s+/)
    const stopwords = new Set(['the','a','an','and','or','but','in','on','with','for','to','of','is','are','was','were','this','that','these','those'])

    for (let i = 0; i < Math.min(words.length, maxLookahead); i++) {
      const token = words[i].replace(/[^A-Za-z]/g, '')
      if (!token) continue
      const w = token
      const lw = w.toLowerCase()
      if (!stopwords.has(lw)) {
        // Return the token as a best-effort noun replacement
        return w
      }
    }
    return undefined
  }
}
