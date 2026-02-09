/**
 * Simple line-based diff generator between original and optimized text.
 * Produces a list of Change records capturing added/removed/modified lines.
 */
export interface Change {
  type: 'added' | 'removed' | 'modified'
  lineNumber: number
  original: string
  suggested: string
}

export class DiffGenerator {
  /**
   * Generate a minimal, line-by-line diff between original and optimized strings.
   */
  generateDiff(original: string, optimized: string): Change[] {
    const origLines = original.split('\n')
    const newLines = optimized.split('\n')
    const changes: Change[] = []
    const max = Math.max(origLines.length, newLines.length)
    for (let i = 0; i < max; i++) {
      const o = origLines[i]
      const n = newLines[i]
      const lineNo = i + 1
      if (o === undefined) {
        // added line
        changes.push({ type: 'added', lineNumber: lineNo, original: '', suggested: n ?? '' })
      } else if (n === undefined) {
        // removed line
        changes.push({ type: 'removed', lineNumber: lineNo, original: o, suggested: '' })
      } else if (o !== n) {
        changes.push({ type: 'modified', lineNumber: lineNo, original: o, suggested: n })
      }
    }
    return changes
  }
}
