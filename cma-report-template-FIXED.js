// CMA Report Template Component
// This renders as HTML, gets passed to Puppeteer for PDF generation
// Optimized for print: no interactions, all data passed as props

const React = require('react');

const CMAReportTemplate = ({ data }) => {
  const {
    propertyName = 'Property Name',
    agentName = 'Agent Name',
    area = 'Area',
    gpsLocation = '—',
    lotSize = '—',
    constructionSize = '—',
    bedrooms = '—',
    bathrooms = '—',
    amenities = [],
    landComps = [],
    houseComps = [],
    keyTakeaways = '—',
    summary = '—',
    adjustmentNotes = '—',
    avgLandPrice = 0,
    avgConstructionPrice = 0,
    subjectLandValue = 0,
    subjectConstructionValue = 0,
    estimatedValue = 0,
    avgListToSoldRatio = 0,
    avgDOMLand = 0,
    avgDOMHouses = 0,
    priceLow = 0,
    priceMid = 0,
    priceHigh = 0,
    language = 'EN',
  } = data || {};

  const isEN = language === 'EN';
  
  const fmt = (n) => n ? '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 }) : '—';
  const fmtD = (n) => n ? '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—';

  const T = {
    EN: {
      title: 'Comparative Market Analysis',
      overview: 'Property Overview',
      agent: 'Agent',
      area: 'Area',
      gps: 'GPS Location',
      lot: 'Lot Size',
      construction: 'Construction',
      beds: 'Bedrooms',
      baths: 'Bathrooms',
      amenities: 'Amenities',
      takeaways: 'Key Takeaways',
      summary: 'Executive Summary',
      landValuation: 'Land Valuation',
      landComps: 'Land Comps Used',
      avgLandPricePerM2: 'Avg Land Price / m²',
      subjectLotSize: 'Subject Lot Size',
      subjectLandValue: 'Subject Land Value',
      domLand: 'Avg DOM (Land)',
      constructionValuation: 'Construction Valuation',
      houseComps: 'House Comps Used',
      avgConstructionPerM2: 'Avg Construction / m²',
      subjectConstruction: 'Subject Construction',
      subjectConstructionValue: 'Subject Const. Value',
      domHouses: 'Avg DOM (Houses)',
      marketInsights: 'Market Insights',
      estValue: 'Estimated Historical Value',
      listToSoldRatio: 'List-to-Sold Ratio',
      pricing: 'Pricing Recommendation',
      low: 'Conservative (Low)',
      suggested: 'Suggested List Price',
      high: 'Optimistic (High)',
      notes: 'Agent Notes',
      disclaimer: 'Disclaimer: This CMA is for informational purposes only and does not constitute a formal appraisal.',
    },
    ES: {
      title: 'Análisis Comparativo de Mercado',
      overview: 'Resumen de Propiedad',
      agent: 'Agente',
      area: 'Área',
      gps: 'Ubicación GPS',
      lot: 'Terreno',
      construction: 'Construcción',
      beds: 'Recámaras',
      baths: 'Baños',
      amenities: 'Amenidades',
      takeaways: 'Puntos Clave',
      summary: 'Resumen Ejecutivo',
      landValuation: 'Valuación de Terreno',
      landComps: 'Comps Terreno',
      avgLandPricePerM2: 'Prom Terreno / m²',
      subjectLotSize: 'Terreno Sujeto',
      subjectLandValue: 'Valor Terreno',
      domLand: 'Días Mercado (Terreno)',
      constructionValuation: 'Valuación Construcción',
      houseComps: 'Comps Casas',
      avgConstructionPerM2: 'Prom Const / m²',
      subjectConstruction: 'Const Sujeto',
      subjectConstructionValue: 'Valor Const',
      domHouses: 'Días Mercado (Casas)',
      marketInsights: 'Insights Mercado',
      estValue: 'Valor Histórico Estimado',
      listToSoldRatio: 'Ratio Lista / Venta',
      pricing: 'Recomendación de Precio',
      low: 'Conservador (Bajo)',
      suggested: 'Precio Lista Sugerido',
      high: 'Optimista (Alto)',
      notes: 'Notas del Agente',
      disclaimer: 'Aviso: Este CMA es con fines informativos únicamente y no constituye un avalúo formal.',
    }
  };

  const t = T[isEN ? 'EN' : 'ES'];

  const InfoRow = ({ label, value }) => 
    React.createElement('tr', { style: { borderBottom: '1px solid #e0e0e0' } },
      React.createElement('td', { style: { padding: '10px 0', fontWeight: '600', color: '#262626', width: '40%' } }, label),
      React.createElement('td', { style: { padding: '10px 0', color: '#262626' } }, value)
    );

  const CompsTable = ({ comps, isLand }) => {
    const rows = comps.map((comp, i) => {
      if (isLand) {
        return React.createElement('tr', { key: i, style: { borderBottom: '1px solid #eee' } },
          React.createElement('td', { style: { padding: '8px' } }, comp.name || '—'),
          React.createElement('td', { style: { padding: '8px' } }, comp.area || '—'),
          React.createElement('td', { style: { padding: '8px', textAlign: 'right' } }, comp.lot || '—'),
          React.createElement('td', { style: { padding: '8px', textAlign: 'right' } }, fmt(comp.listPrice)),
          React.createElement('td', { style: { padding: '8px', textAlign: 'right' } }, fmt(comp.soldPrice)),
          React.createElement('td', { style: { padding: '8px', textAlign: 'right' } }, fmtD(comp.pricePerM2)),
          React.createElement('td', { style: { padding: '8px', textAlign: 'right' } }, comp.dom + 'd')
        );
      } else {
        return React.createElement('tr', { key: i, style: { borderBottom: '1px solid #eee' } },
          React.createElement('td', { style: { padding: '8px' } }, comp.name || '—'),
          React.createElement('td', { style: { padding: '8px' } }, comp.area || '—'),
          React.createElement('td', { style: { padding: '8px', textAlign: 'right' } }, comp.lot || '—'),
          React.createElement('td', { style: { padding: '8px', textAlign: 'right' } }, comp.construction || '—'),
          React.createElement('td', { style: { padding: '8px', textAlign: 'right' } }, fmt(comp.listPrice)),
          React.createElement('td', { style: { padding: '8px', textAlign: 'right' } }, fmt(comp.soldPrice)),
          React.createElement('td', { style: { padding: '8px', textAlign: 'right' } }, fmt(comp.estLand)),
          React.createElement('td', { style: { padding: '8px', textAlign: 'right' } }, fmt(comp.estConstruction)),
          React.createElement('td', { style: { padding: '8px', textAlign: 'right' } }, fmtD(comp.constPerM2)),
          React.createElement('td', { style: { padding: '8px', textAlign: 'right' } }, comp.dom + 'd')
        );
      }
    });

    const headers = isLand ? 
      [React.createElement('th', { style: { padding: '8px', textAlign: 'left' }, key: 'h1' }, 'Property'),
       React.createElement('th', { style: { padding: '8px', textAlign: 'left' }, key: 'h2' }, 'Area'),
       React.createElement('th', { style: { padding: '8px', textAlign: 'right' }, key: 'h3' }, 'Lot m²'),
       React.createElement('th', { style: { padding: '8px', textAlign: 'right' }, key: 'h4' }, 'List Price'),
       React.createElement('th', { style: { padding: '8px', textAlign: 'right' }, key: 'h5' }, 'Sold Price'),
       React.createElement('th', { style: { padding: '8px', textAlign: 'right' }, key: 'h6' }, '$/m²'),
       React.createElement('th', { style: { padding: '8px', textAlign: 'right' }, key: 'h7' }, 'DOM')] :
      [React.createElement('th', { style: { padding: '8px', textAlign: 'left' }, key: 'h1' }, 'Property'),
       React.createElement('th', { style: { padding: '8px', textAlign: 'left' }, key: 'h2' }, 'Area'),
       React.createElement('th', { style: { padding: '8px', textAlign: 'right' }, key: 'h3' }, 'Lot'),
       React.createElement('th', { style: { padding: '8px', textAlign: 'right' }, key: 'h4' }, 'Const'),
       React.createElement('th', { style: { padding: '8px', textAlign: 'right' }, key: 'h5' }, 'List'),
       React.createElement('th', { style: { padding: '8px', textAlign: 'right' }, key: 'h6' }, 'Sold'),
       React.createElement('th', { style: { padding: '8px', textAlign: 'right' }, key: 'h7' }, 'Est. Land'),
       React.createElement('th', { style: { padding: '8px', textAlign: 'right' }, key: 'h8' }, 'Est. Const'),
       React.createElement('th', { style: { padding: '8px', textAlign: 'right' }, key: 'h9' }, '$/m²'),
       React.createElement('th', { style: { padding: '8px', textAlign: 'right' }, key: 'h10' }, 'DOM')];

    return React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse', marginTop: '1rem', fontSize: '12px' } },
      React.createElement('thead', null,
        React.createElement('tr', { style: { background: '#262626', color: '#fff' } }, ...headers)
      ),
      React.createElement('tbody', null, ...rows)
    );
  };

  return React.createElement('div', { style: { fontFamily: 'Arial, sans-serif', color: '#262626', lineHeight: '1.6', maxWidth: '8.5in', margin: '0 auto', padding: '0.5in' } },
    // Header
    React.createElement('div', { style: { marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '3px solid #AA182E' } },
      React.createElement('div', { style: { fontSize: '28px', fontWeight: 'bold', color: '#262626', marginBottom: '0.25rem' } },
        'MEXHOME ', React.createElement('span', { style: { color: '#AA182E' } }, '| Comparative Market Analysis')
      ),
      React.createElement('div', { style: { fontSize: '12px', color: '#999' } }, 'Professional CMA Report — Confidential')
    ),

    // Property Overview
    React.createElement('div', { style: { marginBottom: '2rem' } },
      React.createElement('div', { style: { fontSize: '14px', fontWeight: 'bold', color: '#AA182E', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e0e0e0' } }, t.overview),
      React.createElement('table', { style: { width: '100%' } },
        React.createElement('tbody', null,
          React.createElement(InfoRow, { label: 'Property Name', value: propertyName }),
          React.createElement(InfoRow, { label: t.agent, value: agentName }),
          React.createElement(InfoRow, { label: t.area, value: area }),
          React.createElement(InfoRow, { label: t.gps, value: gpsLocation }),
          React.createElement(InfoRow, { label: t.lot, value: lotSize + ' m²' }),
          React.createElement(InfoRow, { label: t.construction, value: constructionSize + ' m²' }),
          React.createElement(InfoRow, { label: t.beds, value: bedrooms }),
          React.createElement(InfoRow, { label: t.baths, value: bathrooms }),
          React.createElement(InfoRow, { label: t.amenities, value: amenities.join(', ') || '—' })
        )
      )
    ),

    // Key Takeaways
    React.createElement('div', { style: { marginBottom: '2rem' } },
      React.createElement('div', { style: { fontSize: '14px', fontWeight: 'bold', color: '#AA182E', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e0e0e0' } }, t.takeaways),
      React.createElement('p', { style: { margin: '0.5rem 0', fontSize: '13px', color: '#555' } }, keyTakeaways)
    ),

    // Executive Summary
    React.createElement('div', { style: { marginBottom: '2rem' } },
      React.createElement('div', { style: { fontSize: '14px', fontWeight: 'bold', color: '#AA182E', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e0e0e0' } }, t.summary),
      React.createElement('p', { style: { margin: '0.5rem 0', fontSize: '13px', color: '#555' } }, summary)
    ),

    React.createElement('div', { style: { borderTop: '2px solid #AA182E', marginBottom: '2rem' } }),

    // Land Valuation
    React.createElement('div', { style: { marginBottom: '2rem' } },
      React.createElement('div', { style: { fontSize: '14px', fontWeight: 'bold', color: '#AA182E', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e0e0e0' } }, t.landValuation),
      React.createElement('table', { style: { width: '100%' } },
        React.createElement('tbody', null,
          React.createElement(InfoRow, { label: t.landComps, value: landComps.length }),
          React.createElement(InfoRow, { label: t.avgLandPricePerM2, value: fmtD(avgLandPrice) }),
          React.createElement(InfoRow, { label: t.subjectLotSize, value: lotSize + ' m²' }),
          React.createElement(InfoRow, { label: t.subjectLandValue, value: fmt(subjectLandValue) }),
          React.createElement(InfoRow, { label: t.domLand, value: avgDOMLand + ' days' })
        )
      )
    ),

    // Construction Valuation
    React.createElement('div', { style: { marginBottom: '2rem' } },
      React.createElement('div', { style: { fontSize: '14px', fontWeight: 'bold', color: '#AA182E', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e0e0e0' } }, t.constructionValuation),
      React.createElement('table', { style: { width: '100%' } },
        React.createElement('tbody', null,
          React.createElement(InfoRow, { label: t.houseComps, value: houseComps.length }),
          React.createElement(InfoRow, { label: t.avgConstructionPerM2, value: fmtD(avgConstructionPrice) }),
          React.createElement(InfoRow, { label: t.subjectConstruction, value: constructionSize + ' m²' }),
          React.createElement(InfoRow, { label: t.subjectConstructionValue, value: fmt(subjectConstructionValue) }),
          React.createElement(InfoRow, { label: t.domHouses, value: avgDOMHouses + ' days' })
        )
      )
    ),

    // Market Insights
    React.createElement('div', { style: { marginBottom: '2rem' } },
      React.createElement('div', { style: { fontSize: '14px', fontWeight: 'bold', color: '#AA182E', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e0e0e0' } }, t.marketInsights),
      React.createElement('table', { style: { width: '100%' } },
        React.createElement('tbody', null,
          React.createElement(InfoRow, { label: t.estValue, value: fmt(estimatedValue) }),
          React.createElement(InfoRow, { label: t.listToSoldRatio, value: (avgListToSoldRatio * 100).toFixed(1) + '%' })
        )
      )
    ),

    // Pricing Recommendation
    React.createElement('div', { style: { marginBottom: '2rem' } },
      React.createElement('div', { style: { fontSize: '14px', fontWeight: 'bold', color: '#AA182E', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e0e0e0' } }, t.pricing),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' } },
        React.createElement('div', { style: { padding: '1rem', border: '1px solid #e0e0e0', textAlign: 'center' } },
          React.createElement('div', { style: { fontSize: '11px', color: '#999', marginBottom: '0.5rem' } }, t.low),
          React.createElement('div', { style: { fontSize: '20px', fontWeight: 'bold', color: '#AA182E' } }, fmt(priceLow))
        ),
        React.createElement('div', { style: { padding: '1rem', background: '#262626', color: '#fff', textAlign: 'center' } },
          React.createElement('div', { style: { fontSize: '11px', marginBottom: '0.5rem', opacity: '0.7' } }, 'SUGGESTED LIST'),
          React.createElement('div', { style: { fontSize: '22px', fontWeight: 'bold', color: '#fff' } }, fmt(priceMid))
        ),
        React.createElement('div', { style: { padding: '1rem', border: '1px solid #e0e0e0', textAlign: 'center' } },
          React.createElement('div', { style: { fontSize: '11px', color: '#999', marginBottom: '0.5rem' } }, t.high),
          React.createElement('div', { style: { fontSize: '20px', fontWeight: 'bold', color: '#AA182E' } }, fmt(priceHigh))
        )
      )
    ),

    // Comparables
    landComps.length > 0 && React.createElement('div', { style: { marginBottom: '2rem' } },
      React.createElement('div', { style: { fontSize: '14px', fontWeight: 'bold', color: '#AA182E', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e0e0e0' } }, 'Land Comparable Properties'),
      React.createElement(CompsTable, { comps: landComps, isLand: true })
    ),

    houseComps.length > 0 && React.createElement('div', { style: { marginBottom: '2rem' } },
      React.createElement('div', { style: { fontSize: '14px', fontWeight: 'bold', color: '#AA182E', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e0e0e0' } }, 'House Comparable Properties'),
      React.createElement(CompsTable, { comps: houseComps, isLand: false })
    ),

    React.createElement('div', { style: { borderTop: '2px solid #AA182E', marginBottom: '2rem' } }),

    // Agent Notes
    adjustmentNotes && React.createElement('div', { style: { marginBottom: '2rem' } },
      React.createElement('div', { style: { fontSize: '14px', fontWeight: 'bold', color: '#AA182E', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e0e0e0' } }, t.notes),
      React.createElement('p', { style: { margin: '0.5rem 0', fontSize: '13px', color: '#555' } }, adjustmentNotes)
    ),

    // Disclaimer
    React.createElement('div', { style: { fontSize: '11px', color: '#999', marginTop: '3rem', paddingTop: '1rem', borderTop: '1px solid #e0e0e0', fontStyle: 'italic' } },
      t.disclaimer
    )
  );
};

module.exports = CMAReportTemplate;
