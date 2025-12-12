import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
	base: "/Frizerie-Andrei-Viziteu/",
	plugins: [react()],
	build: {
		// Aici specifici directorul de output relativ la folderul 'client'
		// Calea corectă este '../server/dist'
		outDir: "../server/dist",
		emptyOutDir: true,
	},
});
