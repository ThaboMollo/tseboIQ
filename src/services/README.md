# tseboIQ Services

This directory contains service modules for handling various backend operations and integrations.

## 📁 Files

### `affindaParser.js`
**AI-powered CV parsing service with automatic fallback**

Main service for parsing CVs using Affinda API. Automatically falls back to local parser if Affinda fails or returns low confidence.

**Key Functions:**
- `parseCV(file)` - Parse CV with automatic fallback
- `parseWithAffinda(file)` - Parse using only Affinda API
- `validateParsedData(data)` - Validate parsed CV data
- `calculateConfidence(data)` - Calculate confidence score

**Usage:**
```javascript
import { parseCV } from './affindaParser'

const result = await parseCV(file)
console.log(result.data) // Parsed CV data
console.log(result.source) // 'affinda' or 'local'
console.log(result.confidence) // 0-1
```

### `cvParser.js`
**Local CV parser (fallback)**

Regex-based CV parser that extracts data from PDF and DOCX files without external API calls. Used as fallback when Affinda is unavailable or returns low confidence.

**Key Functions:**
- `parseCV(file)` - Parse CV locally
- `validateParsedData(data)` - Validate parsed data

**Features:**
- PDF text extraction using pdf.js
- DOCX text extraction using mammoth
- Section detection (Experience, Education, Skills, etc.)
- Pattern matching for emails, phones, dates
- Skills database matching

### `profileApi.js`
**Candidate profile API service**

Handles CRUD operations for candidate profiles using Supabase.

**Key Functions:**
- `saveProfile(data)` - Save/update candidate profile
- `getProfile(userId)` - Fetch candidate profile
- `deleteProfile(userId)` - Delete candidate profile

## 🔄 Service Flow

### CV Upload & Parsing Flow

```
User uploads CV
    ↓
affindaParser.parseCV(file)
    ↓
Try Affinda API
    ↓
Success? → Calculate confidence
    ↓
Confidence >= 50%?
    ↓
Yes → Return Affinda result
No → Fall back to cvParser.parseCV(file)
    ↓
Return result with source indicator
```

### Profile Save Flow

```
Parsed CV data
    ↓
User reviews & edits
    ↓
profileApi.saveProfile(data)
    ↓
Validate data
    ↓
Save to Supabase
    ↓
Return success/error
```

## 🎯 Best Practices

### Error Handling

Always wrap service calls in try-catch:

```javascript
try {
  const result = await parseCV(file)
  // Handle success
} catch (error) {
  // Handle error
  console.error('Parse failed:', error.message)
}
```

### Validation

Always validate data before saving:

```javascript
import { validateParsedData } from './affindaParser'

const validation = validateParsedData(data)
if (!validation.isValid) {
  console.error('Validation errors:', validation.errors)
  console.warn('Warnings:', validation.warnings)
}
```

### Progress Tracking

Show progress to users during long operations:

```javascript
setStatus('Uploading CV...')
const result = await parseCV(file)
setStatus('Parsing complete!')
```

## 🔧 Configuration

### Environment Variables

Required in `.env`:

```bash
# Affinda API
VITE_AFFINDA_API_KEY=your_api_key_here

# Supabase (for profile storage)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### PDF.js Worker

The PDF.js worker is configured in `cvParser.js`:

```javascript
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
```

Worker file is copied to public folder during build (see `scripts/copy-pdf-worker.js`).

## 📊 Service Comparison

| Feature | Affinda Parser | Local Parser |
|---------|---------------|--------------|
| **Accuracy** | ~90% | ~70% |
| **Speed** | 2-5s | 1-2s |
| **Cost** | API calls | Free |
| **Offline** | No | Yes |
| **Languages** | Multiple | English |
| **Complex CVs** | Excellent | Good |
| **Scanned PDFs** | Yes (OCR) | No |

## 🚀 Future Enhancements

### Planned Features

1. **GPT-4 Integration**: Add GPT-4 as tertiary fallback
2. **Batch Processing**: Parse multiple CVs at once
3. **CV Storage**: Store CVs in cloud storage (Azure/AWS)
4. **Caching**: Cache parsed results to reduce API calls
5. **Analytics**: Track parsing metrics and success rates
6. **Webhooks**: Support async parsing with webhooks
7. **Custom Training**: Train Affinda on industry-specific CVs

### Integration Ideas

1. **Job Matching**: Auto-match candidates to jobs
2. **Skill Extraction**: Extract skills from job descriptions
3. **Profile Enrichment**: Enrich profiles with LinkedIn data
4. **Duplicate Detection**: Detect duplicate candidate profiles
5. **Quality Scoring**: Score CV quality and completeness

## 📝 Adding New Services

To add a new service:

1. Create new file: `src/services/myService.js`
2. Export functions:
```javascript
export async function myFunction(params) {
  // Implementation
}
```
3. Add documentation to this README
4. Update imports in components

## 🧪 Testing

### Manual Testing

```javascript
// Test Affinda parser
import { parseCV } from './affindaParser'

const file = new File([pdfBlob], 'test.pdf', { type: 'application/pdf' })
const result = await parseCV(file)
console.log('Result:', result)
```

### Unit Testing (Future)

```javascript
// Example test
describe('affindaParser', () => {
  it('should parse CV successfully', async () => {
    const result = await parseCV(mockFile)
    expect(result.success).toBe(true)
    expect(result.data.full_name).toBeDefined()
  })
})
```

## 📚 Documentation

- **Affinda Integration Guide**: `/docs/AFFINDA_INTEGRATION_GUIDE.md`
- **Quick Start**: `/docs/AFFINDA_QUICK_START.md`
- **CV Parser Guide**: `/docs/CV_PARSER_GUIDE.md`

## 🐛 Troubleshooting

### Common Issues

**Issue**: "Module not found"
- **Solution**: Check import paths and file names

**Issue**: "API key invalid"
- **Solution**: Verify API key in `.env` file

**Issue**: "CORS error"
- **Solution**: Affinda API supports CORS, check network tab

**Issue**: "PDF worker not found"
- **Solution**: Run `npm run postinstall` to copy worker file

## 💡 Tips

1. **Use TypeScript**: Consider adding TypeScript for better type safety
2. **Add Logging**: Log service calls for debugging
3. **Cache Results**: Cache parsed CVs to reduce API calls
4. **Monitor Performance**: Track service response times
5. **Handle Errors**: Always provide fallback options

## 📞 Support

- **Developer**: Thabo Mponya
- **Email**: mollo.t.mponya@gmail.com
- **Documentation**: See `/docs` folder

---

**Last Updated**: November 2024
