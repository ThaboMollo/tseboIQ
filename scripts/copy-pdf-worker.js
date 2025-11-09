/* eslint-env node */
import { copyFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const projectRoot = join(__dirname, '..')
const publicDir = join(projectRoot, 'public')
const workerSource = join(projectRoot, 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.mjs')
const workerDest = join(publicDir, 'pdf.worker.min.mjs')

try {
  // Create public directory if it doesn't exist
  if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true })
    console.log('✓ Created public directory')
  }

  // Copy worker file
  if (existsSync(workerSource)) {
    copyFileSync(workerSource, workerDest)
    console.log('✓ PDF.js worker copied to public folder')
  } else {
    console.warn('⚠ PDF.js worker not found. Run npm install first.')
  }
} catch (error) {
  console.error('✗ Error copying PDF.js worker:', error.message)
  process.exit(1)
}
