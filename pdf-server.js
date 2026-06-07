// Express + Puppeteer PDF Generation Server
// npm install express puppeteer react react-dom

const express = require('express');
const puppeteer = require('puppeteer');
const ReactDOMServer = require('react-dom/server');
const React = require('react');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json({ limit: '10mb' }));

// Import the CMA report template
// In production, compile the JSX to plain JS or use babel-register
const CMAReportTemplate = require('./cma-report-template.jsx');

const PORT = process.env.PORT || 3001;

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Main PDF generation endpoint
app.post('/api/generate-cma-pdf', async (req, res) => {
  try {
    const { data, filename = 'MexHome_CMA_Report' } = req.body;

    if (!data) {
      return res.status(400).json({ error: 'Missing data field' });
    }

    // Render React component to HTML
    const reportElement = React.createElement(CMAReportTemplate, { data });
    const htmlString = ReactDOMServer.renderToStaticMarkup(reportElement);

    // Wrap in basic HTML document for Puppeteer
    const fullHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${filename}</title>
        <style>
          body { margin: 0; padding: 0; }
          @media print {
            body { margin: 0; }
            @page { margin: 0.5in; size: letter; }
          }
        </style>
      </head>
      <body>
        ${htmlString}
      </body>
      </html>
    `;

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(fullHTML, { waitUntil: 'networkidle0' });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'letter',
      margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
      printBackground: true,
    });

    await browser.close();

    // Send PDF as response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF', details: error.message });
  }
});

// For testing: Generate HTML preview (useful for debugging)
app.post('/api/preview-cma-html', async (req, res) => {
  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ error: 'Missing data field' });
    }

    const reportElement = React.createElement(CMAReportTemplate, { data });
    const htmlString = ReactDOMServer.renderToStaticMarkup(reportElement);

    const fullHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>CMA Preview</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 2rem; }
        </style>
      </head>
      <body>
        ${htmlString}
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(fullHTML);

  } catch (error) {
    console.error('Preview error:', error);
    res.status(500).json({ error: 'Failed to generate preview', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`PDF Server running on port ${PORT}`);
  console.log(`POST ${process.env.APP_URL || 'http://localhost:' + PORT}/api/generate-cma-pdf`);
});
