const { spawn } = require('child_process');
const path = require('path');

const clientPath = path.join(__dirname, 'stockManager/client');
console.log('Testing Vite in:', clientPath);

const vite = spawn('npx', ['vite'], {
  cwd: clientPath,
  stdio: ['pipe', 'pipe', 'pipe']
});

vite.stdout.on('data', (data) => {
  console.log('Vite stdout:', data.toString());
});

vite.stderr.on('data', (data) => {
  console.error('Vite stderr:', data.toString());
});

vite.on('close', (code) => {
  console.log('Vite exited with code:', code);
});

// Stop after 5 seconds
setTimeout(() => {
  vite.kill();
  process.exit(0);
}, 5000);