// CMA Report Template Component
// This renders as HTML, gets passed to Puppeteer for PDF generation
// Optimized for print: no interactions, all data passed as props

import React from 'react';

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

  const InfoRow = ({ label, value }) => (
    <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
      <td style={{ padding: '10px 0', fontWeight: '600', color: '#262626', width: '40%' }}>{label}</td>
      <td style={{ padding: '10px 0', color: '#262626' }}>{value}</td>
    </tr>
  );

  const CompsTable = ({ comps, isLand }) => (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', fontSize: '12px' }}>
      <thead>
        <tr style={{ background: '#262626', color: '#fff' }}>
          {isLand ? (
            <>
              <th style={{ padding: '8px', textAlign: 'left' }}>Property</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Area</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>Lot m²</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>List Price</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>Sold Price</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>$/m²</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>DOM</th>
            </>
          ) : (
            <>
              <th style={{ padding: '8px', textAlign: 'left' }}>Property</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Area</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>Lot</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>Const</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>List</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>Sold</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>Est. Land</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>Est. Const</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>$/m²</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>DOM</th>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {comps.map((comp, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
            {isLand ? (
              <>
                <td style={{ padding: '8px' }}>{comp.name || '—'}</td>
                <td style={{ padding: '8px' }}>{comp.area || '—'}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>{comp.lot || '—'}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>{fmt(comp.listPrice)}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>{fmt(comp.soldPrice)}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>{fmtD(comp.pricePerM2)}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>{comp.dom}d</td>
              </>
            ) : (
              <>
                <td style={{ padding: '8px' }}>{comp.name || '—'}</td>
                <td style={{ padding: '8px' }}>{comp.area || '—'}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>{comp.lot || '—'}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>{comp.construction || '—'}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>{fmt(comp.listPrice)}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>{fmt(comp.soldPrice)}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>{fmt(comp.estLand)}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>{fmt(comp.estConstruction)}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>{fmtD(comp.constPerM2)}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>{comp.dom}d</td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#262626', lineHeight: '1.6', maxWidth: '8.5in', margin: '0 auto', padding: '0.5in' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '3px solid #AA182E' }}>
        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#262626', marginBottom: '0.25rem' }}>
          MEXHOME <span style={{ color: '#AA182E' }}>|</span> <span style={{ color: '#AA182E' }}>{t.title}</span>
        </div>
        <div style={{ fontSize: '12px', color: '#999' }}>Professional CMA Report — Confidential</div>
      </div>

      {/* Property Overview */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#AA182E', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e0e0e0' }}>{t.overview}</div>
        <table style={{ width: '100%' }}>
          <tbody>
            <InfoRow label={isEN ? 'Property Name' : 'Nombre'} value={propertyName} />
            <InfoRow label={t.agent} value={agentName} />
            <InfoRow label={t.area} value={area} />
            <InfoRow label={t.gps} value={gpsLocation} />
            <InfoRow label={t.lot} value={lotSize + ' m²'} />
            <InfoRow label={t.construction} value={constructionSize + ' m²'} />
            <InfoRow label={t.beds} value={bedrooms} />
            <InfoRow label={t.baths} value={bathrooms} />
            <InfoRow label={t.amenities} value={amenities.join(', ') || '—'} />
          </tbody>
        </table>
      </div>

      {/* Key Takeaways */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#AA182E', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e0e0e0' }}>{t.takeaways}</div>
        <p style={{ margin: '0.5rem 0', fontSize: '13px', color: '#555' }}>{keyTakeaways}</p>
      </div>

      {/* Executive Summary */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#AA182E', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e0e0e0' }}>{t.summary}</div>
        <p style={{ margin: '0.5rem 0', fontSize: '13px', color: '#555' }}>{summary}</p>
      </div>

      <div style={{ borderTop: '2px solid #AA182E', marginBottom: '2rem' }}></div>

      {/* Land Valuation */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#AA182E', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e0e0e0' }}>{t.landValuation}</div>
        <table style={{ width: '100%' }}>
          <tbody>
            <InfoRow label={t.landComps} value={landComps.length} />
            <InfoRow label={t.avgLandPricePerM2} value={fmtD(avgLandPrice)} />
            <InfoRow label={t.subjectLotSize} value={lotSize + ' m²'} />
            <InfoRow label={t.subjectLandValue} value={fmt(subjectLandValue)} />
            <InfoRow label={t.domLand} value={avgDOMLand + ' days'} />
          </tbody>
        </table>
      </div>

      {/* Construction Valuation */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#AA182E', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e0e0e0' }}>{t.constructionValuation}</div>
        <table style={{ width: '100%' }}>
          <tbody>
            <InfoRow label={t.houseComps} value={houseComps.length} />
            <InfoRow label={t.avgConstructionPerM2} value={fmtD(avgConstructionPrice)} />
            <InfoRow label={t.subjectConstruction} value={constructionSize + ' m²'} />
            <InfoRow label={t.subjectConstructionValue} value={fmt(subjectConstructionValue)} />
            <InfoRow label={t.domHouses} value={avgDOMHouses + ' days'} />
          </tbody>
        </table>
      </div>

      {/* Market Insights */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#AA182E', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e0e0e0' }}>{t.marketInsights}</div>
        <table style={{ width: '100%' }}>
          <tbody>
            <InfoRow label={t.estValue} value={fmt(estimatedValue)} />
            <InfoRow label={t.listToSoldRatio} value={(avgListToSoldRatio * 100).toFixed(1) + '%'} />
          </tbody>
        </table>
      </div>

      {/* Pricing Recommendation */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#AA182E', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e0e0e0' }}>{t.pricing}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          <div style={{ padding: '1rem', border: '1px solid #e0e0e0', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#999', marginBottom: '0.5rem' }}>{t.low}</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#AA182E' }}>{fmt(priceLow)}</div>
          </div>
          <div style={{ padding: '1rem', background: '#262626', color: '#fff', textAlign: 'center', gridColumn: '2' }}>
            <div style={{ fontSize: '11px', marginBottom: '0.5rem', opacity: '0.7' }}>SUGGESTED LIST</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff' }}>{fmt(priceMid)}</div>
          </div>
          <div style={{ padding: '1rem', border: '1px solid #e0e0e0', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#999', marginBottom: '0.5rem' }}>{t.high}</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#AA182E' }}>{fmt(priceHigh)}</div>
          </div>
        </div>
      </div>

      {/* Comparables */}
      {landComps.length > 0 && (
        <div style={{ marginBottom: '2rem', pageBreakInside: 'avoid' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#AA182E', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e0e0e0' }}>Land Comparable Properties</div>
          <CompsTable comps={landComps} isLand={true} />
        </div>
      )}

      {houseComps.length > 0 && (
        <div style={{ marginBottom: '2rem', pageBreakInside: 'avoid' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#AA182E', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e0e0e0' }}>House Comparable Properties</div>
          <CompsTable comps={houseComps} isLand={false} />
        </div>
      )}

      <div style={{ borderTop: '2px solid #AA182E', marginBottom: '2rem' }}></div>

      {/* Agent Notes */}
      {adjustmentNotes && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#AA182E', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e0e0e0' }}>{t.notes}</div>
          <p style={{ margin: '0.5rem 0', fontSize: '13px', color: '#555' }}>{adjustmentNotes}</p>
        </div>
      )}

      {/* Disclaimer */}
      <div style={{ fontSize: '11px', color: '#999', marginTop: '3rem', paddingTop: '1rem', borderTop: '1px solid #e0e0e0', fontStyle: 'italic' }}>
        {t.disclaimer}
      </div>
    </div>
  );
};

export default CMAReportTemplate;
