# Build Scripts

This folder contains build and setup scripts for the tseboIQ project.

## copy-pdf-worker.js

Copies the PDF.js worker file from `node_modules` to the `public` folder.

### Why is this needed?

The `pdfjs-dist` library requires a separate worker file to parse PDF documents. This worker must be accessible as a static file. The script:

1. Creates the `public` directory if it doesn't exist
2. Copies `pdf.worker.min.mjs` from `node_modules/pdfjs-dist/build/` to `public/`

### When does it run?

- Automatically after `npm install` or `yarn install` (via `postinstall` script)
- Manually: `node scripts/copy-pdf-worker.js`

### Troubleshooting

**Error: PDF.js worker not found**
- Run `npm install` or `yarn install` first to install dependencies

**Error: Permission denied**
- Check folder permissions
- Run as administrator if needed

**CV parsing still fails**
- Verify `public/pdf.worker.min.mjs` exists
- Check browser console for worker loading errors
- Restart dev server after running the script
