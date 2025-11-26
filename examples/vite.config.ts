import { defineConfig } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
    root: '.',
    base: './',
    build: {
        outDir: '../docs/',
        emptyOutDir: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    echarts: ['echarts']
                }
            }
        }
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            '@soonfx/engine': resolve(__dirname, '../src/index.ts')
        }
    },
    server: {
        port: 3009,
        host: "0.0.0.0",
        open: true
    },
    optimizeDeps: {
        include: ['@soonfx/engine']
    }
})
