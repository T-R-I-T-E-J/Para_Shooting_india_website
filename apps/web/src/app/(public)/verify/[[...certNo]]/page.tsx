'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import '../verify.css';

// ----------------------------------------
// MOCK DATABASE
// ----------------------------------------
const MOCK_DB: Record<string, any> = {
  "PCI-PSAI-6NPSC-2025-0004": {
    status: "VERIFIED",
    athleteName: "RUDRANSH KHANDELWAL",
    state: "RAJASTHAN",
    competitorNo: "2005",
    certNo: "PCI/PSAI/6NPSC/2025/0004",
    competitionName: "6th National Para Shooting Championship 2025",
    venue: "Dr. Karni Singh Shooting Range, Delhi",
    dates: "5th – 10th December 2025",
    generated: "15 December 2025",
    events: [
      { event: "P1 - 10M Air Pistol Men SH1 - Final", score: "240.5", rank: "GOLD", badge: "gold" },
      { event: "P4 - 50M Pistol Mixed SH1 - Final", score: "230.1", rank: "GOLD", badge: "gold" },
      { event: "P1 - 10M Air Pistol Men SH1 - Qualification", score: "564", rank: "1", badge: "gold" },
      { event: "P4 - 50M Pistol Mixed SH1 - Qualification", score: "538", rank: "1", badge: "gold" },
      { event: "P1 - 10M Air Pistol Men SH1 - Team", score: "1678", rank: "GOLD", badge: "gold" },
      { event: "P4 - 50M Pistol Mixed SH1 - Team", score: "1589", rank: "SILVER", badge: "silver" },
      { event: "P3 - 25M Pistol Mixed SH1 - Qualification", score: "542", rank: "5", badge: "other" },
      { event: "P3 - 25M Pistol Mixed SH1 - Final", score: "12", rank: "7", badge: "other" }
    ]
  },
  "PCI-PSAI-6NPSC-2025-0006": {
    status: "VERIFIED",
    athleteName: "MONA AGARWAL",
    state: "RAJASTHAN",
    competitorNo: "2018",
    certNo: "PCI/PSAI/6NPSC/2025/0006",
    competitionName: "6th National Para Shooting Championship 2025",
    venue: "Dr. Karni Singh Shooting Range, Delhi",
    dates: "5th – 10th December 2025",
    generated: "15 December 2025",
    events: [
      { event: "R2 - 10M Air Rifle Women SH1 - Final", score: "248.5", rank: "GOLD", badge: "gold" },
      { event: "R2 - 10M Air Rifle Women SH1 - Qualification", score: "625.3", rank: "1", badge: "gold" },
      { event: "R3 - 10M Air Rifle Prone Mixed SH1 - Qualification", score: "632.1", rank: "2", badge: "silver" },
      { event: "R8 - 50M Rifle 3 Positions Women SH1 - Final", score: "450.2", rank: "BRONZE", badge: "bronze" },
      { event: "R8 - 50M Rifle 3 Positions Women SH1 - Qualification", score: "1150", rank: "4", badge: "other" }
    ]
  },
  "PCI-PSAI-6NPSC-2025-0099": {
    status: "REVOKED",
    revokeDate: "20 December 2025",
    reason: "Administrative Error in Score Calculation",
    certNo: "PCI/PSAI/6NPSC/2025/0099"
  }
};

type ViewState = 'SEARCH' | 'LOADING' | 'VERIFIED' | 'NOT_FOUND' | 'REVOKED';

export default function CertificateVerificationPage() {
  const router = useRouter();
  const params = useParams();

  const [viewState, setViewState] = useState<ViewState>('SEARCH');
  const [searchInput, setSearchInput] = useState('');
  const [certData, setCertData] = useState<any>(null);
  const [requestedCert, setRequestedCert] = useState<string>('');

  // Extract from Next.js catch-all routes
  // e.g. /verify/PCI/PSAI/6NPSC/2025/0004 or /verify/PCI-PSAI-6NPSC-2025-0004
  const certPathArray = params?.certNo as string[] | undefined;

  useEffect(() => {
    if (certPathArray && certPathArray.length > 0) {
      // Join multi-segment URL by dashes to normalize
      const normalizedQuery = certPathArray.join('-').toUpperCase();
      setRequestedCert(normalizedQuery);
      
      // Re-map actual readable cert if it was passed via slash format
      const readable = certPathArray.join('/');
      setSearchInput(readable);

      initiateVerification(normalizedQuery, readable);
    } else {
      setViewState('SEARCH');
    }
  }, [certPathArray]);

  const initiateVerification = (queryHash: string, readable: string) => {
    setViewState('LOADING');
    
    // Simulate 1.5s network delay
    setTimeout(() => {
      const data = MOCK_DB[queryHash];
      
      if (!data) {
        setRequestedCert(readable || queryHash);
        setViewState('NOT_FOUND');
      } else if (data.status === 'REVOKED') {
        setCertData(data);
        setViewState('REVOKED');
      } else if (data.status === 'VERIFIED') {
        setCertData(data);
        setViewState('VERIFIED');
      }
    }, 1500);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    
    // Convert slashes to dashes for the URL pattern
    const urlSafe = searchInput.trim().replace(/\//g, '-').toUpperCase();
    router.push(`/verify/${urlSafe}`);
  };

  const resetSearch = () => {
    setSearchInput('');
    setCertData(null);
    router.push('/verify');
  };

  const renderBadgeClass = (badge: string) => {
    switch (badge) {
      case 'gold': return { row: 'rank-gold-row', text: 'rank-gold-text' };
      case 'silver': return { row: 'rank-silver-row', text: 'rank-silver-text' };
      case 'bronze': return { row: 'rank-bronze-row', text: 'rank-bronze-text' };
      default: return { row: '', text: 'rank-other-text' };
    }
  };

  const mockHash = "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824";

  return (
    <div className="verify-container">

      {/* -------------------- STATE 1: SEARCH -------------------- */}
      {viewState === 'SEARCH' && (
        <div className="search-card animate-fade-in">
          <div className="search-header">
            <div className="logo-placeholder">PCI</div>
            <h1 className="search-title">Certificate Verification Portal</h1>
          </div>
          <div className="gold-divider"></div>
          
<<<<<<< Updated upstream
          <label htmlFor="cert-search" className="search-label">Enter Certificate Number to Verify</label>
          <form onSubmit={handleSearchSubmit}>
            <input 
              id="cert-search"
=======
          <label className="search-label">Enter Certificate Number to Verify</label>
          <form onSubmit={handleSearchSubmit}>
            <input 
>>>>>>> Stashed changes
              type="text" 
              className="search-input"
              placeholder="PCI/PSAI/6NPSC/2025/XXXX" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              autoFocus
            />
            <div className="format-hint">Found on the bottom-right of your certificate</div>
            
            <div className="search-actions">
              <button type="submit" className="btn-verify">
                <span>🔍</span> Verify Certificate
              </button>
              <button type="button" className="btn-scan" onClick={() => alert('Camera QR Scanner integration would open here.')}>
                <span>📷</span> Scan QR Code
              </button>
            </div>
          </form>

          <div className="info-box">
            This portal allows you to verify the authenticity of certificates issued by the Paralympic Committee of India for para shooting championships. All certificates issued after 2024 can be verified here.
          </div>
        </div>
      )}

      {/* -------------------- STATE 2: LOADING -------------------- */}
      {viewState === 'LOADING' && (
        <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: '15vh' }}>
          <div className="spinner"></div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Verifying certificate...</h2>
          <p style={{ color: '#cbd5e1' }}>Checking PCI database for <strong>{requestedCert}</strong></p>
        </div>
      )}

      {/* -------------------- STATE 3: VERIFIED -------------------- */}
      {viewState === 'VERIFIED' && certData && (
        <div className="verified-wrapper animate-fade-in">
          
          <div className="top-nav">
<<<<<<< Updated upstream
            <button type="button" onClick={resetSearch} className="verify-another-link text-blue-300 hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 text-sm font-semibold">← Verify Another Certificate</button>
=======
            <a onClick={resetSearch} className="verify-another-link">← Verify Another Certificate</a>
>>>>>>> Stashed changes
          </div>

          <div className="success-banner">
            ✅ AUTHENTIC CERTIFICATE VERIFIED
          </div>

          <div className="result-card result-card-verified">
            
            {/* Header */}
            <div className="card-header">
              <div className="logos-row">
                <div style={{ width: '60px', height: '60px', background: '#003087', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>PCI</div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div className="header-text">PARALYMPIC COMMITTEE OF INDIA</div>
                  <div className="header-sub">Certificate of Participation — VERIFIED ✅</div>
                </div>
                <div style={{ width: '60px', height: '60px', background: '#C8A415', borderRadius: '8px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>PSAI</div>
              </div>
              <div className="gold-divider" style={{ width: '100%', marginBottom: '0' }}></div>
            </div>

            {/* Verification Stamp SVG Overlay */}
            <div className="stamp-container">
<<<<<<< Updated upstream
              <svg aria-hidden="true" width="120" height="120" viewBox="0 0 120 120">
=======
              <svg width="120" height="120" viewBox="0 0 120 120">
>>>>>>> Stashed changes
                <defs>
                  <path id="circlePath" d="M 60, 60 m -45, 0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0" />
                </defs>
                <circle cx="60" cy="60" r="50" fill="none" stroke="#2e7d32" strokeWidth="2" strokeDasharray="5,5" />
                <circle cx="60" cy="60" r="55" fill="none" stroke="#2e7d32" strokeWidth="1" />
                <text fill="#2e7d32" fontSize="9" fontWeight="bold" letterSpacing="2">
                  <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
                    PARALYMPIC COMMITTEE OF INDIA •
                  </textPath>
                </text>
                <text x="60" y="55" textAnchor="middle" fill="#2e7d32" fontSize="16" fontWeight="bold">VERIFIED</text>
                <text x="60" y="75" textAnchor="middle" fill="#2e7d32" fontSize="8" fontWeight="bold">15 DEC 2025</text>
              </svg>
            </div>

            {/* Data Grid */}
            <div className="info-grid">
              <div className="info-col">
                <div className="info-item">
                  <span className="info-label">Athlete Name</span>
                  <span className="info-value value-athlete">{certData.athleteName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">State</span>
                  <span className="info-value">{certData.state}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Competitor No</span>
                  <span className="info-value">{certData.competitorNo}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Certificate No</span>
                  <span className="info-value" style={{ color: '#c62828' }}>{certData.certNo}</span>
                </div>
              </div>

              <div className="info-col">
                <div className="info-item">
                  <span className="info-label">Competition</span>
                  <span className="info-value">{certData.competitionName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Venue</span>
                  <span className="info-value">{certData.venue}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Dates</span>
                  <span className="info-value">{certData.dates}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Generated</span>
                  <span className="info-value">{certData.generated}</span>
                </div>
              </div>
            </div>

            {/* Results Table */}
            <div className="results-section">
              <div className="results-title">Competition Results</div>
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th className="col-score">Score</th>
                    <th className="col-rank">Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {certData.events.map((ev: any, idx: number) => {
                    const badgeUi = renderBadgeClass(ev.badge);
                    return (
                      <tr key={idx} className={badgeUi.row}>
                        <td>{ev.event}</td>
                        <td className="col-score">{ev.score}</td>
                        <td className={`col-rank ${badgeUi.text}`}>{ev.rank}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="action-buttons">
              <button className="btn-action" onClick={() => window.print()}>
                🖨️ Print this page
              </button>
              <button className="btn-action">
                ⬇️ Download Certificate PDF
              </button>
              <button className="btn-action">
                🔗 Share
              </button>
            </div>
          </div>

          <div className="security-box">
            <p style={{ margin: '0 0 0.5rem 0' }}>This verification was performed at <strong>{new Date().toLocaleString()}</strong>.</p>
            <p style={{ margin: '0 0 0.5rem 0' }}>Certificate hash fingerprint: <span style={{ fontFamily: 'monospace', color: '#fff' }}>{mockHash}</span></p>
            <p style={{ margin: '0' }}>If you believe this certificate is fraudulent, contact: <a href="mailto:psai@pci.nic.in">psai@pci.nic.in</a></p>
          </div>
        </div>
      )}

      {/* -------------------- STATE 4: NOT FOUND -------------------- */}
      {viewState === 'NOT_FOUND' && (
        <div className="verified-wrapper animate-fade-in" style={{ textAlign: 'center' }}>
          
          <div className="top-nav" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
<<<<<<< Updated upstream
            <button type="button" onClick={resetSearch} className="verify-another-link text-blue-300 hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 text-sm font-semibold">← Go Back to Search</button>
=======
            <a onClick={resetSearch} className="verify-another-link">← Go Back to Search</a>
>>>>>>> Stashed changes
          </div>

          <div className="red-cross">❌</div>
          <h2 className="invalid-title">Certificate Not Found</h2>

          <div className="result-card result-card-invalid">
            <p className="invalid-desc">
              The certificate number <strong>{requestedCert}</strong> was not found in our database.
            </p>

            <div className="invalid-reasons">
              <p>Possible reasons:</p>
              <ul>
                <li>The certificate number was typed incorrectly.</li>
                <li>The certificate has not been officially issued yet.</li>
                <li>The certificate may have been revoked or invalidated.</li>
              </ul>
            </div>

            <div className="bottom-actions">
              <button className="btn-primary-small" onClick={resetSearch}>
                🔍 Try Another Number
              </button>
              <button className="btn-primary-small" style={{ background: '#475569' }}>
                📧 Contact Support
              </button>
            </div>
          </div>

          <div className="support-footer">
            Support: <a href="mailto:psai@pci.nic.in">psai@pci.nic.in</a> | Phone: +91-11-XXXX-XXXX
          </div>
        </div>
      )}

      {/* -------------------- STATE 5: REVOKED -------------------- */}
      {viewState === 'REVOKED' && certData && (
        <div className="verified-wrapper animate-fade-in" style={{ textAlign: 'center' }}>
          
          <div className="top-nav" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
<<<<<<< Updated upstream
            <button type="button" onClick={resetSearch} className="verify-another-link text-blue-300 hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 text-sm font-semibold">← Go Back to Search</button>
=======
            <a onClick={resetSearch} className="verify-another-link">← Go Back to Search</a>
>>>>>>> Stashed changes
          </div>

          <div className="result-card result-card-revoked">
            <h2 className="revoked-title">⚠️ Certificate Revoked</h2>
            <p className="invalid-desc" style={{ marginBottom: '1.5rem' }}>
              The certificate <strong>{certData.certNo}</strong> has been officially revoked by the administration and is no longer valid.
            </p>

            <div className="revoked-reasons">
              <p><strong>Revocation Date:</strong> {certData.revokeDate}</p>
              <p style={{ marginTop: '0.5rem' }}><strong>Reason:</strong> {certData.reason}</p>
            </div>

            <div className="bottom-actions">
              <button className="btn-primary-small" onClick={resetSearch}>
                🔍 Try Another Number
              </button>
              <button className="btn-primary-small" style={{ background: '#475569' }}>
                📧 Dispute Revocation
              </button>
            </div>
          </div>

          <div className="support-footer">
            Support: <a href="mailto:psai@pci.nic.in">psai@pci.nic.in</a>
          </div>
        </div>
      )}

    </div>
  );
}
