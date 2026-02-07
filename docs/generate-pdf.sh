#!/bin/bash

# APEX OS Executive Summary PDF Generator
# Uses Puppeteer (Chrome headless) for perfect PDF rendering

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     APEX OS PDF GENERATOR - Print Ready Documents             ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Installing..."
    # For macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install node
    else
        echo "Please install Node.js from https://nodejs.org/"
        exit 1
    fi
fi

# Check if Puppeteer is installed
if ! npm list -g puppeteer &> /dev/null; then
    echo "📦 Installing Puppeteer..."
    npm install -g puppeteer
fi

# Create the PDF generation script
cat > /tmp/generate-pdf.js << 'EOF'
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generatePDF() {
    console.log('🚀 Launching browser...');
    
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Load the HTML file
    const htmlPath = path.resolve(process.argv[2] || './EXECUTIVE_SUMMARY_PRINT_READY.html');
    const outputPath = process.argv[3] || './APEX_OS_EXECUTIVE_SUMMARY_v2.pdf';
    
    console.log(`📄 Loading: ${htmlPath}`);
    
    await page.goto(`file://${htmlPath}`, {
        waitUntil: 'networkidle0',
        timeout: 30000
    });
    
    // Wait for fonts to load
    await page.evaluate(() => {
        return document.fonts.ready;
    });
    
    console.log('🎨 Generating PDF...');
    
    // Generate PDF with print settings
    await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        displayHeaderFooter: false,
        margin: {
            top: '0',
            right: '0',
            bottom: '0',
            left: '0'
        }
    });
    
    await browser.close();
    
    console.log('✅ PDF generated successfully!');
    console.log(`📁 Saved to: ${outputPath}`);
    
    // Get file size
    const stats = fs.statSync(outputPath);
    const fileSizeInKB = Math.round(stats.size / 1024);
    console.log(`📊 File size: ${fileSizeInKB} KB`);
}

generatePDF().catch(err => {
    console.error('❌ Error generating PDF:', err);
    process.exit(1);
});
EOF

# Run the PDF generator
echo "🎯 Generating PDF..."
node /tmp/generate-pdf.js "$1" "$2"

if [ $? -eq 0 ]; then
    echo ""
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║  ✅ SUCCESS! Your PDF is ready!                                ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Open the PDF to verify formatting"
    echo "   2. Print a test page (use 'Actual size' setting)"
    echo "   3. Send to investors!"
    echo ""
else
    echo ""
    echo "❌ PDF generation failed. Check errors above."
    exit 1
fi