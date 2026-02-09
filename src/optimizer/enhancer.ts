import { AnalysisResult } from '../types'

/** Conservative enhancer that makes minimal, safe improvements */
export class PromptEnhancer {
  enhance(prompt: string, _analysis: AnalysisResult): string {
    let p = prompt.trim()
    // Simple safety: ensure ending punctuation
    if (p.length > 0 && !/[.!?]$/.test(p)) {
      p = p + '.'
    }
    return p
  }
}
