import { defineConfig } from "vite";
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "react-antd-column-resize",
      fileName: (format) => `react-antd-column-resize.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'antd'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          antd: 'antd',
        },
      },
    },
  },
  plugins: [dts()],
});