import * as path from 'path';
import Mocha from 'mocha';

export async function run(): Promise<void> {
  // Create the mocha test
  const mocha = new Mocha({
    ui: 'tdd',
    color: true,
    reporter: 'spec',
  });

  const testsRoot = path.resolve(__dirname, '.');
  
  // Directly add the extension test file
  mocha.addFile(path.resolve(testsRoot, 'extension.test.js'));

  return new Promise<void>((c, e) => {
    mocha.run((failures: number) => {
      if (failures > 0) {
        e(new Error(`${failures} tests failed`));
      } else {
        c();
      }
    });
  });
}
