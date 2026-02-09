/**
 * MissingContextRule extends the generic Rule base class.
 * It detects phrases that reference a file or code context without
 * providing an explicit file path or code reference.
 * Patterns are pattern-matched (no AI) for performance targets <20ms.
 */
import { RuleResult, Suggestion, RuleSeverity } from '../../types'
import { Rule } from './base'

export class MissingContextRule extends Rule {
  /** Rule name */
  readonly name = 'MissingContext'

  /** Analyze the text for missing file/context references. */
  analyze(text: string): RuleResult {
    // Work on a version with code blocks removed to reduce false positives
    const codeFree = this.stripCode(text)

    // Detect phrases like "the file", "the function", etc.
    const phraseRegex = /\bthe\s+(file|function|class|component|module)\b/gi
    let m: RegExpExecArray | null
    const suggestions: Suggestion[] = []
    let detected = false

    while ((m = phraseRegex.exec(codeFree)) !== null) {
      detected = true
      const keyword = m[1]
      const phraseEnd = m.index + m[0].length
      // Look ahead for a path or code reference within the next 200 chars
      const after = codeFree.slice(phraseEnd, phraseEnd + 200)
      const hasPath = /[\/\\][^\s]+|[A-Za-z0-9_]+\.[A-Za-z0-9]+/.test(after)

      const replacementNote = hasPath
        ? `Provide a specific reference to the ${keyword} (e.g., path/to/file.ts or module/name)`
        : `Add a file path or inline code reference for the ${keyword}`

      suggestions.push({
        message: replacementNote,
        replacement: undefined,
        confidence: hasPath ? 0.7 : 0.6
      })
    }

    // Secondary detection: explicit code discussion without file context
    const codeDiscussion = /\b(in|within)\s+(the\s+)?(code|source|repo|repository|project)\b/gi
    while ((m = codeDiscussion.exec(codeFree)) !== null) {
      detected = true
      suggestions.push({
        message: 'Add a file reference or concrete code location to clarify this discussion',
        confidence: 0.5
      })
    }

    return {
      ruleName: this.name,
      detected,
      suggestions,
      severity: RuleSeverity.warning
    }
  }

  /** Utility: remove simple code blocks to avoid false positives */
  private stripCode(input: string): string {
    let s = input
    // Triple-backtick blocks
    s = s.replace(/```[\s\S]*?```/g, '')
    // Inline code blocks
    s = s.replace(/`[^`]*`/g, '')
    return s
  }
}
