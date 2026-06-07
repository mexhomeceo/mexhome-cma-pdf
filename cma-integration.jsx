// Integration layer: Connect your React CMA intake form to Puppeteer PDF backend

import React, { useState } from 'react';

export const usePDFGenerator = (apiBaseUrl) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generatePDF = async (cmaData, propertyName) => {
    setLoading(true);
    setError(null);

    try {
      // Send data to backend PDF generation endpoint
      const response = await fetch(`${apiBaseUrl}/api/generate-cma-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: cmaData,
          filename: `MexHome_CMA_${propertyName.replace(/\s+/g, '_')}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`PDF generation failed: ${response.statusText}`);
      }

      // Get PDF as blob and trigger download
      const pdfBlob = await response.blob();
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `MexHome_CMA_${propertyName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setLoading(false);
      return { success: true };
    } catch (err) {
      const errorMsg = err.message || 'Failed to generate PDF';
      setError(errorMsg);
      setLoading(false);
      return { success: false, error: errorMsg };
    }
  };

  const previewHTML = async (cmaData) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/preview-cma-html`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: cmaData }),
      });

      if (!response.ok) {
        throw new Error('Preview generation failed');
      }

      const html = await response.text();
      const previewWindow = window.open('', 'CMA_Preview');
      previewWindow.document.write(html);
      previewWindow.document.close();
    } catch (err) {
      setError(err.message || 'Failed to generate preview');
    }
  };

  return { generatePDF, previewHTML, loading, error };
};

// Example usage in your Step 6 (Generate Report) component:
export const GenerateReportStep = ({ cmaData, onBack, onComplete }) => {
  const apiBaseUrl = process.env.REACT_APP_PDF_API_URL || 'http://localhost:3001';
  const { generatePDF, previewHTML, loading, error } = usePDFGenerator(apiBaseUrl);

  const handleDownloadPDF = async () => {
    const result = await generatePDF(cmaData, cmaData.propertyName);
    if (result.success) {
      onComplete?.();
    }
  };

  const handlePreview = async () => {
    await previewHTML(cmaData);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Generate Report</h2>

      {error && (
        <div style={{ background: '#ffebee', color: '#c62828', padding: '1rem', marginBottom: '1rem', borderRadius: '4px' }}>
          ❌ {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button
          onClick={handlePreview}
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '14px',
            background: '#1B4965',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? '0.6' : '1',
          }}
        >
          {loading ? '⏳ Generating...' : '👁️ Preview HTML'}
        </button>

        <button
          onClick={handleDownloadPDF}
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '14px',
            fontWeight: '600',
            background: '#AA182E',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? '0.6' : '1',
          }}
        >
          {loading ? '⏳ Generating PDF...' : '⬇️ Download PDF Report'}
        </button>

        <button
          onClick={onBack}
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '14px',
            background: '#e0e0e0',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          ← Back
        </button>
      </div>
    </div>
  );
};
