import { AnalysisResult } from '../types'
import { PatternDetector } from './patternDetector'
import { RuleResult } from '../types'
import { performance } from 'perf_hooks'

/**
 * PromptAnalyzer uses a PatternDetector to run rule analyses against a prompt
 * and returns a structured AnalysisResult containing all rule results.
 */
export class PromptAnalyzer {
  private detector: PatternDetector

  constructor(detector?: PatternDetector) {
    this.detector = detector ?? new PatternDetector([])
  }

  /** Analyze the prompt and return an AnalysisResult summarizing rule results. */
  analyze(prompt: string): AnalysisResult {
    const trimmed = (prompt ?? '').trim()
    if (trimmed.length === 0) {
      return {
        originalPrompt: '',
        optimizedPrompt: '',
        rulesApplied: [],
        totalChanges: 0,
        processingTime: 0
      }
    }

    const start = performance.now()
    const results: RuleResult[] = this.detector.detect(trimmed)
    const duration = performance.now() - start

    const totalChanges = results.reduce((acc, r) => acc + (r.suggestions?.length ?? 0), 0)

    return {
      originalPrompt: trimmed,
      optimizedPrompt: trimmed,
      rulesApplied: results,
      totalChanges,
      processingTime: duration
    }
  }
}
