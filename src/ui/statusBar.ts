import * as vscode from 'vscode'

/** Status bar manager for the extension */
export class StatusBar {
  private item: vscode.StatusBarItem

  constructor(private commandId: string = 'prompt-intelligence-layer.optimizePrompt') {
    this.item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100)
    this.item.command = this.commandId
    this.item.text = '🎯 Optimize'
    this.item.tooltip = 'Optimize current prompt'
  }

  show(): void {
    this.item.show()
  }

  hide(): void {
    this.item.hide()
  }

  updateText(text: string): void {
    this.item.text = text
  }

  dispose(): void {
    this.item.dispose()
  }
}
