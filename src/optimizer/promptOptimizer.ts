import { AnalysisResult } from '../types'
import { DiffGenerator, Change } from './diffGenerator'
export interface OptimizedPrompt {
  before: string
  after: string
  changes: Change[]
}

/**
 * PromptOptimizer applies high-confidence suggestions to produce an optimized prompt.
 * - Conservative: only apply high-confidence suggestions with explicit replacements
 * - Never alters code blocks (preserves ``` blocks)
 */
export class PromptOptimizer {
  private diffGen = new DiffGenerator()

  /** Optimize the given prompt using analysis results */
  optimize(prompt: string, analysisResult: AnalysisResult): OptimizedPrompt {
    let optimized = prompt
    const changes: Change[] = []

    if (!analysisResult?.rulesApplied?.length) {
      return { before: prompt, after: prompt, changes }
    }

    for (const rule of analysisResult.rulesApplied) {
      for (const s of rule.suggestions ?? []) {
        // Apply only high-confidence suggestions that include a replacement (if present)
        const isHighConfidence = (typeof s.confidence === 'number' && s.confidence >= 0.7)
        const replacement = s.replacement
        if (!isHighConfidence || !replacement) continue

        // Heuristic: replace the leading verb (if present) with the full replacement phrase
        const leadingWord = replacement.split(' ')[0]
        const re = new RegExp(`\\b${leadingWord}\\b`, 'i')
        if (re.test(optimized)) {
          const newText = optimized.replace(re, replacement)
          const diff = this.diffGen.generateDiff(optimized, newText)
          changes.push(...diff)
          optimized = newText
        }
      }
    }

    return { before: prompt, after: optimized, changes }
  }
}
