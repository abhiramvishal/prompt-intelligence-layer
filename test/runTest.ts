import * as path from 'path';
import {
  downloadAndUnzipVSCode,
  runTests,
} from '@vscode/test-electron';

async function main() {
  try {
    // Use absolute paths with proper escaping for paths with spaces
    const extensionDevelopmentPath = path.resolve(__dirname, '../../');
    const extensionTestsPath = path.resolve(__dirname, './suite');
    
    const vscodeExecutablePath = await downloadAndUnzipVSCode('stable');

    // Download VS Code, unzip it and run the integration test
    await runTests({
      vscodeExecutablePath,
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: [
        '--disable-extensions',
        '--disable-updates',
        '--disable-telemetry'
      ],
    });

    process.exit(0);
  } catch (err) {
    console.error('Failed to run tests', err);
    process.exit(1);
  }
}

main();
