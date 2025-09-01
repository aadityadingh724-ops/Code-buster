# LibreTranslate Setup Guide

## Option 1: Self-Hosted with Docker (Recommended)

### Prerequisites
- Docker installed on your system
- At least 2GB RAM available

### Quick Setup
```bash
# Pull and run LibreTranslate container
docker run -ti --rm -p 5000:5000 libretranslate/libretranslate

# Or with custom configuration
docker run -ti --rm -p 5000:5000 -e LT_LOAD_ONLY=en,hi,ml,ta,te libretranslate/libretranslate
```

### Configuration for your project
Update your `.env.local`:
```bash
# For self-hosted instance
LIBRETRANSLATE_URL=http://localhost:5000

# Optional: Add API key if you set one
LIBRETRANSLATE_API_KEY=your_api_key_here
```

## Option 2: LibreTranslate.com (Paid Service)

### Steps to get API key:
1. Visit https://libretranslate.com
2. Sign up for an account
3. Choose a plan ($10/month for 1M characters)
4. Get your API key from dashboard
5. Update `.env.local`:

```bash
LIBRETRANSLATE_URL=https://libretranslate.com
LIBRETRANSLATE_API_KEY=your_api_key_from_dashboard
```

## Option 3: Alternative Translation Services

### Google Translate API
- More reliable but requires billing setup
- $20 per 1M characters
- Setup: https://cloud.google.com/translate

### Azure Translator
- Microsoft's translation service
- Free tier: 2M characters/month
- Setup: https://azure.microsoft.com/en-us/services/cognitive-services/translator/

### AWS Translate
- Amazon's translation service
- $15 per 1M characters
- Setup: https://aws.amazon.com/translate/

## Current Setup in Your Project

Your project currently uses:
1. **Pre-built translations** for instant loading (Hindi, Malayalam, Tamil, Telugu)
2. **Fallback to LibreTranslate** public instances
3. **No API key required** for basic functionality

## Recommendations for SIH

### For Development/Demo:
✅ **Current setup is perfect** - works offline with pre-built translations

### For Production:
1. **Self-host LibreTranslate** with Docker
2. **Or use LibreTranslate.com** paid service
3. **Or keep pre-built translations** (most reliable)

## Language Support

### Currently Supported:
- English ✅ (native)
- Hindi ✅ (pre-translated)
- Malayalam ✅ (pre-translated)
- Tamil ✅ (pre-translated)
- Telugu ✅ (pre-translated)

### To Add More Languages:
Add more pre-translated content in `/pages/api/translate.js`
