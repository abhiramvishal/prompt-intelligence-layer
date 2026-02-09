import * as path from 'path';
import * as Mocha from 'mocha';
import * as glob from 'glob';

export async function run(): Promise<void> {
  // Create the mocha test
  const mocha = new Mocha({
    ui: 'tdd',
    color: true,
    reporter: 'spec',
  });

  const testsRoot = path.resolve(__dirname, '..');
  const files = await glob.glob('**/**.test.ts', { cwd: testsRoot });

  // Add files to the test suite
  files.forEach((f) => {
    mocha.addFile(path.resolve(testsRoot, f));
  });

  return new Promise((c, e) => {
    mocha.run((failures) => {
      if (failures > 0) {
        e(new Error(`${failures} tests failed`));
      } else {
        c();
      }
    });
  });
}
