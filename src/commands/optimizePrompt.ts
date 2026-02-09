import * as vscode from 'vscode'
import { PatternDetector } from '../optimizer/patternDetector'
import { VagueReferenceRule } from '../optimizer/rules/vagueReference'
import { MissingContextRule } from '../optimizer/rules/missingContext'
import { CompoundQuestionRule } from '../optimizer/rules/compoundQuestion'
import { LackSpecificityRule } from '../optimizer/rules/lackSpecificity'
import { MissingConstraintsRule } from '../optimizer/rules/missingConstraints'
import { PromptAnalyzer } from '../optimizer/promptAnalyzer'
import { PromptOptimizer } from '../optimizer/promptOptimizer'
import { DiffGenerator } from '../optimizer/diffGenerator'
import { OptimizationPanel } from '../ui/optimizationPanel'
import { AnalysisResult } from '../types'
import { Change } from '../optimizer/diffGenerator'

/** Async command handler to perform optimization and return user choice. */
export async function optimizePromptCommand(): Promise<'optimized'|'original'|'cancel'> {
  // Get prompt from active editor or prompt input
  const editor = vscode.window.activeTextEditor
  let prompt = ''
  if (editor) {
    const sel = editor.selection
    prompt = editor.document.getText(sel) || editor.document.getText()
  }
  if (!prompt) {
    const input = await vscode.window.showInputBox({ prompt: 'Enter prompt to optimize' })
    if (!input) return 'cancel'
    prompt = input
  }

  if (!prompt || prompt.trim().length === 0) {
    vscode.window.showWarningMessage('No prompt provided for optimization.')
    return 'cancel'
  }
  if (prompt.length > 10000) {
    vscode.window.showWarningMessage('Prompt is too long (max 10000 chars).')
    return 'cancel'
  }

  // Build detector with a stable set of rules
  const detector = new PatternDetector([
    new VagueReferenceRule(),
    new MissingContextRule(),
    new CompoundQuestionRule(),
    new LackSpecificityRule(),
    new MissingConstraintsRule()
  ])
  const analyzer = new PromptAnalyzer(detector)
  let analysis: AnalysisResult
  try {
    analysis = analyzer.analyze(prompt)
  } catch (e) {
    vscode.window.showErrorMessage(`Analysis failed: ${e}`)
    return 'cancel'
  }

  if (analysis.processingTime > 200) {
    vscode.window.showWarningMessage(`Optimization analysis time high: ${analysis.processingTime.toFixed(0)}ms`)
  }

  const optimizer = new PromptOptimizer()
  const optimized = optimizer.optimize(prompt, analysis)
  const diffGen = new DiffGenerator()
  const changes: Change[] = diffGen.generateDiff(prompt, optimized.after)

  const panel = new OptimizationPanel()
  const choice = await panel.show(prompt, optimized.after, changes)
  // Log the choice for auditing
  console.log(`Optimization choice: ${choice}`)
  return choice
}
