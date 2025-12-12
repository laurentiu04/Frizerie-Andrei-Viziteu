import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
	base: "/",
	plugins: [react()],
	build: {
		// Aici specifici directorul de output relativ la folderul 'client'
		outDir: "server/dist",
		emptyOutDir: true,
	},
});
