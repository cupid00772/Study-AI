import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'mermaid-core',
              test: (id) => {
                const normalized = id.replace(/\\/g, '/');
                if (normalized.includes('/node_modules/mermaid/dist/mermaid.core.mjs')) return true;
                if (normalized.includes('/node_modules/dagre-d3-es/')) return true;
                if (
                  normalized.includes('/node_modules/mermaid/dist/chunks/mermaid.core/') &&
                  /\/(flowDiagram-|dagre-|stateDiagram-v2-|mindmap-definition-)/.test(normalized)
                ) {
                  return true;
                }
                return false;
              },
            },
          ],
        },
      },
    },
  },
})
