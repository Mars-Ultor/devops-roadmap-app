import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Only include visualizer in production builds when ANALYZE env var is set
    process.env.ANALYZE && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  build: {
    rollupOptions: {
      external: ['firebase-admin'], // Exclude server-side Firebase admin SDK
      output: {
        manualChunks: {
          // Separate large data files that are still needed upfront
          'battle-drills': ['./src/data/battleDrills.ts'],
          'scenarios': ['./src/data/scenarios.ts', './src/data/productionScenarios.ts', './src/data/stressScenarios.ts'],
          // Group UI libraries
          'ui-vendor': ['lucide-react', '@radix-ui/react-icons'],
          // Group Firebase
          'firebase-vendor': ['firebase'],
          // Group React ecosystem
          'react-vendor': ['react', 'react-dom', 'react-router-dom', 'zustand'],
          // Group utilities
          'utils-vendor': ['axios', 'react-markdown'],
          // Group terminal/xterm
          'terminal-vendor': ['@xterm/xterm', '@xterm/addon-fit'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase warning limit since we have large data files
    sourcemap: false, // Disable sourcemaps for production
    minify: 'terser', // Use terser for better minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true, // Remove debugger statements
      },
    },
    reportCompressedSize: true, // Show compressed sizes
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    watch: false,
    testTimeout: 5000,
    hookTimeout: 5000,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    server: {
      deps: {
        inline: ['firebase'],
      },
    },
  },
})
