import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import styleImport, { VantResolve } from "vite-plugin-style-import"

// https://vitejs.dev/config/
export default defineConfig(() => {
	return {
		plugins: [
			vue(),
			styleImport({
				resolves: [VantResolve()],
			}),
		],

		build: {
			minify: "terser",
			terserOptions: {
				compress: {
					// 在生产环境中移除console.log
					drop_console: true,
					drop_debugger: true,
				},
			},
			rollupOptions: {
				output: {
					entryFileNames: "[name]-[hash].js",
					chunkFileNames: "[name]-[hash].js",
					assetFileNames: "[name]-[hash].[ext]",
				},
			},
		},
	}
})
