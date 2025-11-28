// vitest.config.ts
// 1) Importamos defineConfig desde 'vitest/config' para habilitar la clave "test".
import { defineConfig } from 'vitest/config'

// 2) Config propia de Vitest (JS DOM + setup).
export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './vitest.setup.ts',
    },
})
