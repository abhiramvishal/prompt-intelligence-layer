import * as vscode from 'vscode'
import { optimizePromptCommand } from './commands/optimizePrompt'
import { StatusBar } from './ui/statusBar'
import { OptimizationPanel } from './ui/optimizationPanel'

let statusBar: StatusBar | undefined
let optimizationPanel: OptimizationPanel | undefined

/**
 * Activation function for the extension.
 * - Registers the optimizePrompt command
 * - Creates a status bar item
 * - Logs activation and exposes a minimal API object
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('Prompt Intelligence Layer: activated')

  // Status bar
  statusBar = new StatusBar()
  statusBar.show()
  context.subscriptions.push(statusBar)

  // Optimization panel (lazy creation)
  optimizationPanel = new OptimizationPanel()
  context.subscriptions.push(optimizationPanel)

  // Command registration
  context.subscriptions.push(
    vscode.commands.registerCommand('prompt-intelligence-layer.optimizePrompt', optimizePromptCommand)
  )

  return {
    name: 'prompt-intelligence-layer-api'
  }
}

export function deactivate() {
  statusBar?.dispose()
  optimizationPanel?.dispose()
  console.log('Prompt Intelligence Layer: deactivated')
}
