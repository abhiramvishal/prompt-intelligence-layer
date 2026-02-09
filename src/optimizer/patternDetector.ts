import { RuleResult } from '../types'
import { Rule } from './rules/base'
import { performance } from 'perf_hooks'
import { RuleSeverity } from '../types'

/**
 * PatternDetector runs a collection of Rule instances against a prompt.
 * - Executes all rules (enabled by default) and collects their RuleResult outputs
 * - Attempts to run in parallel (via Promises) but relies on synchronous rule.analysis
 * - Tracks per-rule execution time and throws if any rule exceeds 50ms
 */
export class PatternDetector {
  private timings: Map<string, number> = new Map()

  constructor(private rules: Rule[]) {}

  /** Maximum allowed time per rule in milliseconds */
  private static readonly PER_RULE_LIMIT = 50

  /** Run all rules against the given prompt and return their results */
  detect(prompt: string): RuleResult[] {
    this.timings.clear()

    const results: RuleResult[] = []
    let idx = 0
    for (const r of this.rules) {
      const enabled = (r as any).enabled !== false
      const name = (r as any).name ?? `rule${idx}`
      if (!enabled) {
        results.push({
          ruleName: name,
          detected: false,
          suggestions: [],
          severity: RuleSeverity.info
        } as RuleResult)
        idx++
        continue
      }

      const start = performance.now()
      // @ts-ignore - Rule has analyze(text): RuleResult
      const res = (r as any).analyze(prompt) as RuleResult
      const duration = performance.now() - start
      this.timings.set(name, duration)

      if (duration > PatternDetector.PER_RULE_LIMIT) {
        throw new Error(`Rule '${name}' exceeded time limit: ${duration.toFixed(2)}ms`)
      }

      results.push(res)
      idx++
    }

    return results
  }

  /** Expose per-rule timings for diagnostics */
  getTimings(): Map<string, number> {
    return new Map(this.timings)
  }
}
