import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path'; // Stellen Sie sicher, dass path importiert wird

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    alias: {
      $data: path.resolve('src/data'), // Alias für das Data-Verzeichnis
      $lib: path.resolve('src/lib'),   // Optional, falls noch nicht konfiguriert
    }
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    allowedHosts: ['dkwdp.f4.htw-berlin.de']
  }
});