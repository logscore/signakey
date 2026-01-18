import { build } from 'vite';

try {
  await build({
    logLevel: 'info',
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          console.log('Rollup warning:', warning);
          warn(warning);
        }
      }
    }
  });
} catch (err) {
  console.error('=== BUILD ERROR ===');
  console.error('Type:', typeof err);
  console.error('Value:', err);
  console.error('JSON:', JSON.stringify(err, Object.getOwnPropertyNames(err || {}), 2));
  if (err instanceof Error) {
    console.error('Message:', err.message);
    console.error('Stack:', err.stack);
    console.error('Cause:', err.cause);
  }
  process.exit(1);
}
