# PDF Parser Troubleshooting Guide

## Common PDF Parsing Errors

### Error: "Setting up fake worker failed"

**Full Error:**
```
Error: Setting up fake worker failed: "error loading dynamically imported module: 
http://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.394/pdf.worker.min.js?import"
```

**Cause:** PDF.js worker file is not properly configured or accessible.

**Solution:**

1. **Verify worker file exists:**
   ```bash
   # Check if worker file is in public folder
   ls public/pdf.worker.min.mjs
   ```

2. **If file is missing, copy it:**
   ```bash
   # Run the copy script
   node scripts/copy-pdf-worker.js
   
   # Or reinstall dependencies
   yarn install
   ```

3. **Restart dev server:**
   ```bash
   # Stop server (Ctrl+C)
   # Start again
   yarn dev
   ```

4. **Clear browser cache:**
   - Open DevTools (F12)
   - Right-click refresh button
   - Select "Empty Cache and Hard Reload"

### Error: "Failed to parse PDF file"

**Possible Causes:**

1. **Corrupted PDF file**
   - Try opening the PDF in Adobe Reader
   - Try a different PDF file
   - Re-save the PDF from the original source

2. **Password-protected PDF**
   - Remove password protection
   - Use an unprotected version

3. **Scanned PDF (images only)**
   - PDF contains only images, no text
   - Use OCR software to convert to text-based PDF
   - Or fill form manually

4. **Very large PDF**
   - File size exceeds 10MB limit
   - Compress the PDF
   - Remove unnecessary pages

### Error: "Worker script not found"

**Cause:** Worker file path is incorrect.

**Solution:**

1. **Check cvParser.js configuration:**
   ```javascript
   // Should be:
   pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
   ```

2. **Verify file is in public folder:**
   ```bash
   ls public/pdf.worker.min.mjs
   ```

3. **Check Vite is serving public folder:**
   - Files in `public/` should be accessible at `http://localhost:5187/filename`
   - Test: `http://localhost:5187/pdf.worker.min.mjs`

### Browser Console Errors

**"404 Not Found: pdf.worker.min.mjs"**

- Worker file is missing from public folder
- Run: `node scripts/copy-pdf-worker.js`
- Restart dev server

**"CORS policy blocked"**

- Worker file is being loaded from wrong domain
- Check `pdfjsLib.GlobalWorkerOptions.workerSrc` uses relative path
- Should be: `/pdf.worker.min.mjs` not `http://...`

**"Module not found: pdfjs-dist"**

- Dependency not installed
- Run: `yarn install`

## Testing PDF Parsing

### Test with Sample PDF

1. **Create a simple test PDF:**
   - Open Word/Google Docs
   - Type some text with:
     - Your name
     - Email address
     - Phone number
     - List of skills
   - Save as PDF

2. **Upload to app:**
   - Navigate to `/register/candidate`
   - Upload the test PDF
   - Check browser console for errors

3. **Verify extraction:**
   - Check if text is extracted correctly
   - Verify fields are populated

### Debug Mode

Add debug logging to `cvParser.js`:

```javascript
async function extractTextFromPDF(file) {
  console.log('📄 Parsing PDF:', file.name, file.size, 'bytes')
  
  try {
    const arrayBuffer = await file.arrayBuffer()
    console.log('✓ ArrayBuffer created:', arrayBuffer.byteLength, 'bytes')
    
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    console.log('✓ PDF loaded:', pdf.numPages, 'pages')
    
    let fullText = ''
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map(item => item.str).join(' ')
      fullText += pageText + '\n'
      console.log(`✓ Page ${i}/${pdf.numPages} extracted:`, pageText.length, 'chars')
    }
    
    console.log('✓ Total text extracted:', fullText.length, 'chars')
    return fullText
  } catch (error) {
    console.error('✗ PDF parsing failed:', error)
    throw error
  }
}
```

## Performance Issues

### Slow PDF Parsing

**Symptoms:**
- Parsing takes >10 seconds
- Browser becomes unresponsive

**Solutions:**

1. **Reduce PDF size:**
   - Compress images in PDF
   - Remove unnecessary pages
   - Use PDF optimization tools

2. **Show better progress:**
   - Update progress bar per page
   - Show "Processing page X of Y"

3. **Process in chunks:**
   ```javascript
   // Process pages in batches
   for (let i = 1; i <= pdf.numPages; i++) {
     const page = await pdf.getPage(i)
     // ... extract text
     
     // Update progress
     setProgress((i / pdf.numPages) * 100)
     
     // Allow UI to update
     await new Promise(resolve => setTimeout(resolve, 0))
   }
   ```

### Memory Issues

**Symptoms:**
- Browser crashes with large PDFs
- "Out of memory" errors

**Solutions:**

1. **Limit file size:**
   - Enforce 10MB limit strictly
   - Show clear error for large files

2. **Clean up resources:**
   ```javascript
   const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
   
   try {
     // ... extract text
   } finally {
     // Clean up
     await pdf.destroy()
   }
   ```

## Alternative Solutions

### If PDF Parsing Continues to Fail

1. **Use backend parsing:**
   - Implement `/api/candidates/parse-cv` endpoint
   - Use server-side libraries (iTextSharp, PDFBox)
   - More reliable for complex PDFs

2. **Use third-party API:**
   - OpenAI GPT-4 Vision (can read PDF screenshots)
   - Google Document AI
   - AWS Textract
   - Azure Form Recognizer

3. **Allow manual entry:**
   - Always provide "Skip CV Upload" option
   - Make all fields editable
   - Don't block registration on parsing failure

## Verification Checklist

Before deploying, verify:

- [ ] `public/pdf.worker.min.mjs` exists
- [ ] Worker file is ~1MB in size
- [ ] `postinstall` script runs successfully
- [ ] Test PDF uploads work
- [ ] Browser console shows no errors
- [ ] Parsing completes in <5 seconds for typical CVs
- [ ] Error messages are user-friendly
- [ ] Manual entry fallback works

## Getting Help

If issues persist:

1. **Check browser console** for detailed errors
2. **Test with different PDFs** to isolate the issue
3. **Verify PDF.js version** matches worker version
4. **Check GitHub issues** for pdfjs-dist package
5. **Contact development team** with:
   - Error message
   - Browser and version
   - PDF file (if shareable)
   - Steps to reproduce

## Related Files

- **Parser Service**: `src/services/cvParser.js`
- **Copy Script**: `scripts/copy-pdf-worker.js`
- **Worker Config**: Line 6 in `cvParser.js`
- **Package Config**: `package.json` (postinstall script)

## Additional Resources

- [PDF.js Documentation](https://mozilla.github.io/pdf.js/)
- [PDF.js GitHub Issues](https://github.com/mozilla/pdf.js/issues)
- [Vite Static Assets](https://vitejs.dev/guide/assets.html#the-public-directory)
- [Web Workers Guide](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
