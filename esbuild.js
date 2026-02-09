const esbuild = require('esbuild');
const path = require('path');

const isProduction = process.argv.includes('--minify');
const isWatch = process.argv.includes('--watch');

const baseConfig = {
  bundle: true,
  entryPoints: ['./src/extension.ts'],
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
  outfile: './out/extension.js',
  minify: isProduction,
  sourcemap: !isProduction,
  logLevel: 'info',
};

async function build() {
  const startTime = Date.now();

  try {
    if (isWatch) {
      const context = await esbuild.context(baseConfig);
      await context.watch();
      console.log('[esbuild] Watching for changes...');
    } else {
      await esbuild.build(baseConfig);
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`[esbuild] Build complete in ${duration}s`);
    }
  } catch (error) {
    console.error('[esbuild] Build failed:', error);
    process.exit(1);
  }
}

build();
