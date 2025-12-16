import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // This removes console logs and debuggers from the production build
    minify: 'esbuild', 
    sourcemap: false, // Prevents users from seeing your source code in DevTools
  },
  esbuild: {
    // Specifically drops these members
    drop: ['console', 'debugger'],
  },
})

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'


// export default defineConfig({
//   plugins: [react()],
// })

