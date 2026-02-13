#!/usr/bin/env python3
"""
APEX OS Executive Summary PDF Generator
Simple HTML to PDF converter using weasyprint (pure Python, no Chrome needed)
"""

import sys
import os

try:
    from weasyprint import HTML, CSS
    from weasyprint.text.fonts import FontConfiguration
except ImportError:
    print("📦 Installing weasyprint...")
    os.system("pip3 install weasyprint --user")
    print("✅ Installation complete. Please run this script again.")
    sys.exit(0)

# Configuration
HTML_FILE = "EXECUTIVE_SUMMARY_PRINT_READY.html"
OUTPUT_FILE = "APEX_OS_EXECUTIVE_SUMMARY_v2.pdf"

print("╔════════════════════════════════════════════════════════════════╗")
print("║     APEX OS PDF GENERATOR - Print Ready Documents             ║")
print("╚════════════════════════════════════════════════════════════════╝")
print()

# Check if HTML file exists
if not os.path.exists(HTML_FILE):
    print(f"❌ Error: {HTML_FILE} not found!")
    print(f"   Looking in: {os.getcwd()}")
    sys.exit(1)

print(f"📄 Loading: {HTML_FILE}")

# Generate PDF
print("🎨 Generating PDF...")
font_config = FontConfiguration()
html = HTML(filename=HTML_FILE)
html.write_pdf(OUTPUT_FILE, font_config=font_config)

# Check result
if os.path.exists(OUTPUT_FILE):
    file_size = os.path.getsize(OUTPUT_FILE) / 1024
    print()
    print("✅ PDF generated successfully!")
    print(f"📁 Saved to: {OUTPUT_FILE}")
    print(f"📊 File size: {file_size:.1f} KB")
    print()
    print("╔════════════════════════════════════════════════════════════════╗")
    print("║  ✅ SUCCESS! Your PDF is ready!                                ║")
    print("╚════════════════════════════════════════════════════════════════╝")
else:
    print("❌ PDF generation failed!")
    sys.exit(1)