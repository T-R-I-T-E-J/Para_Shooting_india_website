import React from 'react'

export interface CertificateDocumentProps {
  certNo: string
  compNo: string
  athleteName: string
  state: string
  championshipName: string
  venue: string
  dates: string
  events: {
    name: string
    score: string | null
    position: string | null
    mqs: string | null
  }[]
}

export default function CertificateDocument({
  certNo,
  compNo,
  athleteName,
  state,
  championshipName,
  venue,
  dates,
  events,
}: CertificateDocumentProps) {
  
  // Format dates text for ordinal suffixes
  const formatTextWithOrdinals = (text: string) => {
    return text.replace(/(\d+)(st|nd|rd|th)/gi, '$1<sup>$2</sup>')
  }

  const participationHtml = `has participated in the <b>${championshipName}</b> held at <b>${venue},</b> from <b>${formatTextWithOrdinals(dates)},</b> and has obtained the following result:–`

  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: '#ffffff',
        border: '8px solid #1a2f6e',
        padding: '14px',
        width: '100%',
        minHeight: '600px',
        fontFamily: "'Times New Roman', Times, serif",
      }}
    >
      {/* Inner outline at 14px inset */}
      <div
        style={{
          border: '3px solid #c8a018',
          height: '100%',
          position: 'relative',
        }}
      >
        {/* Left & Right Edge Decorations */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: '28px',
            background: 'linear-gradient(to right, #1a2f6e, transparent)',
            opacity: 0.12,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: '28px',
            background: 'linear-gradient(to left, #1a2f6e, transparent)',
            opacity: 0.12,
            pointerEvents: 'none',
          }}
        />

        {/* SECTION 1 — CERTIFICATE HEADER */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: '18px 28px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* LEFT: PCI Logo block */}
          <div style={{ textAlign: 'center', width: '120px' }}>
            <div
              style={{
                width: '36px',
                height: '20px',
                margin: '0 auto 4px',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #ddd',
              }}
            >
              <div style={{ flex: 1, backgroundColor: '#FF9933' }}></div>
              <div
                style={{
                  flex: 1,
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Ashoka Chakra simulation */}
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    border: '1px solid #000080',
                  }}
                ></div>
              </div>
              <div style={{ flex: 1, backgroundColor: '#138808' }}></div>
            </div>
            <div style={{ fontSize: '5px', textTransform: 'uppercase', color: '#333' }}>
              PARALYMPIC COMMITTEE INDIA
            </div>
            {/* Paralympic symbol approximation */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginTop: '4px' }}>
              <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
                <path d="M4 10C6 10 8 8 8 5" stroke="#cc0000" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 10C14 10 16 8 16 5" stroke="#003399" strokeWidth="2" strokeLinecap="round" />
                <path d="M20 10C22 10 24 8 24 5" stroke="#009933" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* CENTER: Organization heading */}
          <div style={{ textAlign: 'center', flex: 1, padding: '0 20px' }}>
            <h1
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: '20px',
                fontWeight: 700,
                fontStyle: 'italic',
                color: '#1a2f6e',
                margin: '0 0 6px 0',
                textTransform: 'uppercase',
              }}
            >
              PARALYMPIC COMMITTEE OF INDIA
            </h1>
            <p
              style={{
                fontSize: '8px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: '#333',
                margin: 0,
                textTransform: 'uppercase',
                lineHeight: 1.6,
              }}
            >
              RECOGNISED BY MINISTRY OF YOUTH AFFAIRS &amp; SPORTS,
              <br />
              GOVERNMENT OF INDIA
              <br />
              AFFILIATED MEMBER OF: IPC GERMANY, IWAS UK, APC UAE
            </p>
          </div>

          {/* RIGHT: PSAI Logo block */}
          <div style={{ textAlign: 'center', width: '120px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '2px solid #1a2f6e',
                margin: '0 auto 6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a2f6e" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2v20 M2 12h20" />
              </svg>
            </div>
            <div style={{ fontSize: '6px', textTransform: 'uppercase', color: '#1a2f6e', fontWeight: 700 }}>
              PARA SHOOTING ASSOCIATION OF INDIA
            </div>
            <div style={{ color: '#c8a018', fontSize: '10px', marginTop: '2px' }}>★★★★</div>
          </div>
        </div>

        {/* GOLD DIVIDER */}
        <div
          style={{
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #c8a018 20%, #c8a018 80%, transparent)',
            margin: '6px 10px',
          }}
        ></div>

        {/* SECTION 2 — CERTIFICATE NUMBER ROW */}
        <div style={{ padding: '0 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ fontFamily: 'Arial, sans-serif' }}>
            <div style={{ fontSize: '10px', marginBottom: '4px' }}>
              <span style={{ fontWeight: 700, color: '#000' }}>NO.: </span>
              <span style={{ fontWeight: 700, color: '#CC0000' }}>{certNo}</span>
            </div>
            <div style={{ fontSize: '12px' }}>
              <span style={{ fontWeight: 700, color: '#000' }}>COMPETITOR NUMBER:- </span>
              <span style={{ fontWeight: 700, color: '#000', textDecoration: 'underline' }}>{compNo}</span>
            </div>
          </div>
        </div>

        {/* PHOTO PLACEHOLDER (absolute positioned, top-right of inner area) */}
        <div
          style={{
            position: 'absolute',
            top: '80px',
            right: '28px',
            width: '65px',
            height: '78px',
            border: '2px solid #ccc',
            backgroundColor: '#e8e8e8',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <div style={{ fontSize: '6px', color: '#666', marginTop: '4px', textAlign: 'center' }}>
            Athlete<br />Photo
          </div>
        </div>

        {/* SECTION 3 — BIG "CERTIFICATE" WORD */}
        <div style={{ textAlign: 'center', margin: '20px 0', position: 'relative' }}>
          <div
            style={{
              fontFamily: '"Times New Roman", Times, serif',
              fontSize: '52px', // Responsive size handled in parent wrapper normally, keeping base size
              fontWeight: 900,
              letterSpacing: '0.15em',
              color: '#2a2a2a',
              position: 'relative',
              display: 'inline-block',
            }}
          >
            CERTIFICATE
            {/* Gold underline pseudo element */}
            <div
              style={{
                position: 'absolute',
                bottom: '-2px',
                left: '15%',
                width: '70%',
                height: '2px',
                backgroundColor: '#c8a018',
              }}
            ></div>
          </div>
        </div>

        {/* SECTION 4 — CERTIFIED THAT + ATHLETE NAME */}
        <div style={{ textAlign: 'center', margin: '10px 0', padding: '0 20%' }}>
          <div
            style={{
              fontSize: '12px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#555',
              fontFamily: 'Arial, sans-serif',
              marginBottom: '10px',
            }}
          >
            CERTIFIED THAT
          </div>
          <div
            style={{
              fontSize: '28px',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#1a2f6e',
              textDecoration: 'underline',
              fontFamily: 'Georgia, serif',
              letterSpacing: '0.05em',
              marginBottom: '10px',
            }}
          >
            {athleteName}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: '#333',
              textTransform: 'uppercase',
              fontFamily: 'Arial, sans-serif',
              marginBottom: '10px',
            }}
          >
            OF
          </div>
          <div
            style={{
              fontSize: '16px',
              fontWeight: 700,
              textTransform: 'uppercase',
              textDecoration: 'underline',
              color: '#1a2f6e',
              fontFamily: 'Georgia, serif',
            }}
          >
            {state}
          </div>
        </div>

        {/* SECTION 5 — PARTICIPATION PARAGRAPH */}
        <div
          style={{
            fontFamily: '"Times New Roman", Times, serif',
            fontSize: '14px',
            lineHeight: 1.7,
            color: '#222',
            padding: '10px 48px 4px',
            textAlign: 'center',
          }}
          dangerouslySetInnerHTML={{ __html: participationHtml }}
        />

        {/* SECTION 6 — RESULTS TABLE */}
        <div style={{ margin: '14px 28px' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontFamily: 'Arial, sans-serif',
              fontSize: '11px',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#1a2f6e', color: 'white' }}>
                <th style={{ padding: '7px 8px', fontSize: '10px', letterSpacing: '0.04em', border: '1px solid #ddd' }}>Sr. No.</th>
                <th style={{ padding: '7px 8px', fontSize: '10px', letterSpacing: '0.04em', border: '1px solid #ddd', textAlign: 'left' }}>Event</th>
                <th style={{ padding: '7px 8px', fontSize: '10px', letterSpacing: '0.04em', border: '1px solid #ddd' }}>MQS</th>
                <th style={{ padding: '7px 8px', fontSize: '10px', letterSpacing: '0.04em', border: '1px solid #ddd' }}>Achieved Score</th>
                <th style={{ padding: '7px 8px', fontSize: '10px', letterSpacing: '0.04em', border: '1px solid #ddd' }}>Rank</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, idx) => {
                const bg = idx % 2 === 0 ? '#fff' : '#f0f4ff'
                const rankDisplay = event.position ? String(event.position).trim().toLowerCase() : ''
                
                let rankStyles: React.CSSProperties = {
                   color: '#1a2f6e', fontWeight: 700, textTransform: 'uppercase'
                }
                
                if (rankDisplay === '1' || rankDisplay.includes('gold')) {
                  rankStyles = { backgroundColor: '#FFFDE7', color: '#7A6008', fontWeight: 800, textTransform: 'uppercase' }
                } else if (rankDisplay === '2' || rankDisplay.includes('silver')) {
                  rankStyles = { backgroundColor: '#F1F5F9', color: '#475569', fontWeight: 800, textTransform: 'uppercase' }
                } else if (rankDisplay === '3' || rankDisplay.includes('bronze')) {
                  rankStyles = { backgroundColor: '#FEF3C7', color: '#92400E', fontWeight: 800, textTransform: 'uppercase' }
                }

                return (
                  <tr key={idx} style={{ backgroundColor: bg, border: '1px solid #ddd' }}>
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #ddd' }}>{idx + 1}.</td>
                    <td style={{ padding: '6px', textAlign: 'left', color: '#1a2f6e', fontWeight: 600, fontSize: '10px', border: '1px solid #ddd' }}>
                      {event.name || '-'}
                    </td>
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #ddd' }}>{event.mqs || ''}</td>
                    <td style={{ padding: '6px', textAlign: 'center', color: '#CC0000', fontWeight: 'bold', border: '1px solid #ddd' }}>
                      {event.score || '-'}
                    </td>
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #ddd', ...rankStyles }}>
                      {event.position || '-'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div style={{ fontSize: '9px', fontStyle: 'italic', color: '#555', fontFamily: 'Arial, sans-serif', marginTop: '4px' }}>
            *DECIMAL SCORE
          </div>
        </div>

        {/* SECTION 7 — SIGNATURES */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            padding: '18px 28px 8px',
            borderTop: '1px solid #ddd',
            margin: '8px 28px 0',
            textAlign: 'center',
          }}
        >
          {/* SIGNATORY 1 */}
          <div>
            <div style={{ width: '80%', height: '1px', backgroundColor: '#333', margin: '0 auto 8px' }}></div>
            <div style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', color: '#1a2f6e', fontFamily: 'Arial, sans-serif' }}>
              DEVENDRA
            </div>
            <div style={{ fontSize: '8px', fontStyle: 'italic', fontFamily: '"Times New Roman", Times, serif', lineHeight: 1.4, color: '#333', marginTop: '2px' }}>
              Padma Bhushan, Khel Ratna Awardee<br />
              President,<br />
              Paralympic Committee of India
            </div>
          </div>
          {/* SIGNATORY 2 */}
          <div>
            <div style={{ width: '80%', height: '1px', backgroundColor: '#333', margin: '0 auto 8px' }}></div>
            <div style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', color: '#1a2f6e', fontFamily: 'Arial, sans-serif' }}>
              JAYAWANT GUNDU H.
            </div>
            <div style={{ fontSize: '8px', fontStyle: 'italic', fontFamily: '"Times New Roman", Times, serif', lineHeight: 1.4, color: '#333', marginTop: '2px' }}>
              International Coach &amp; Referee<br />
              Secretary General,<br />
              Paralympic Committee of India
            </div>
          </div>
          {/* SIGNATORY 3 */}
          <div>
            <div style={{ width: '80%', height: '1px', backgroundColor: '#333', margin: '0 auto 8px' }}></div>
            <div style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', color: '#1a2f6e', fontFamily: 'Arial, sans-serif' }}>
              JAIPRAKASH NAUTIYAL
            </div>
            <div style={{ fontSize: '8px', fontStyle: 'italic', fontFamily: '"Times New Roman", Times, serif', lineHeight: 1.4, color: '#333', marginTop: '2px' }}>
              Dronacharya Awardee<br />
              Chairperson<br />
              STC – Para Shooting, PCI
            </div>
          </div>
        </div>

        {/* SECTION 8 — SPONSORS ROW */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '14px',
            flexWrap: 'wrap',
            padding: '16px 28px 28px',
          }}
        >
          {['AU SPORTS', 'AARYANS GROUP', 'ACRE', 'WHEELING HAPPINESS', 'THUMS UP', 'PUNJAB & SIND BANK', 'CASHEW', 'INDIAN OIL'].map((sponsor, i) => (
            <div
              key={i}
              style={{
                fontSize: '8px',
                fontWeight: 700,
                border: '1px solid #ddd',
                borderRadius: '3px',
                padding: '3px 8px',
                color: '#666',
                fontFamily: 'Arial, sans-serif',
              }}
            >
              {sponsor}
            </div>
          ))}
        </div>

        {/* SECTION 9 — QR CODE */}
        <div
          style={{
            position: 'absolute',
            bottom: '28px',
            right: '28px',
            width: '52px',
            height: '52px',
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Decorative approximation of QR code */}
          <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor" color="#333">
            <path d="M0 0h14v14H0V0zm2 2v10h10V2H2zm2 2h6v6H4V4zm20-4h14v14H24V0zm2 2v10h10V2H26zm2 2h6v6h-6V4zM0 24h14v14H0V24zm2 2v10h10V26H2zm2 2h6v6H4v-6zm16-4h4v4h-4v-4zm4 4h4v4h-4v-4zm-4 4h4v4h-4v-4zm0-12h4v4h-4v-4zm8 0h4v4h-4v-4zm0 8h4v4h-4v-4zm4-4h4v4h-4v-4zm0-8h4v4h-4v-4z"/>
          </svg>
        </div>

      </div>
    </div>
  )
}
