import tailwindcss from "@tailwindcss/vite";
import reactSwc from "@vitejs/plugin-react-swc";
import react from "@vitejs/plugin-react";
import { defineConfig, PluginOption } from "vite";

import sparkPlugin from "@github/spark/spark-vite-plugin";
import createIconImportProxy from "@github/spark/vitePhosphorIconProxyPlugin";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    mode === 'test' ? react({ include: /\.(jsx|tsx)$/ }) : reactSwc({
      devTarget: 'esnext',
    }),
    tailwindcss(),
    // DO NOT REMOVE (but skip in test mode to avoid issues)
    ...(mode === 'test' ? [] : [
      createIconImportProxy() as PluginOption,
      sparkPlugin() as PluginOption,
    ]),
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        '**/*.test.{ts,tsx}',
        'dist/',
        'coverage/',
      ],
    },
  },
}));
