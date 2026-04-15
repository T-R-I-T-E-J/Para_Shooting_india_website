'use client';

import React, { useState, useEffect, useRef } from 'react';
import './generate.css';

type Step = 'CONFIGURE' | 'PROGRESS' | 'COMPLETE';

interface LogEntry {
  id: number;
  time: string;
  type: 'success' | 'warning' | 'error';
  message: string;
}

export default function GenerateCertificatesPage() {
  const [currentStep, setCurrentStep] = useState<Step>('CONFIGURE');

  // CONFIGURE STATE
  const [generationMode, setGenerationMode] = useState<'all' | 'pending' | 'specific' | 'regenerate'>('pending');
  const [sendEmail, setSendEmail] = useState(true);
  const [makePublic, setMakePublic] = useState(true);
  const [includeQr, setIncludeQr] = useState(false);
  const [watermarkTime, setWatermarkTime] = useState(true);

  // PROGRESS STATE
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [totalItems, setTotalItems] = useState(275);
  const [errorsCount, setErrorsCount] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  // COMPLETE STATE
  // Fixed static values for the final view as per requirement

  // Scroll to bottom of logs
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Simulate Progress
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (currentStep === 'PROGRESS' && !isPaused && progress < 100) {
      interval = setInterval(() => {
        setCompleted(prev => {
          const next = prev + 1;
          const newProgress = Math.floor((next / totalItems) * 100);
          setProgress(newProgress);
          
          if (next >= totalItems) {
            clearInterval(interval);
            setTimeout(() => setCurrentStep('COMPLETE'), 500);
          }
          
          return next;
        });

        const now = new Date();
        const timeStr = `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
        
        // Randomly simulate different log types
        const rand = Math.random();
        let logType: 'success' | 'warning' | 'error' = 'success';
        let msg = '';
        
        if (rand > 0.98) {
          logType = 'error';
          msg = '❌ Failed to generate for SID-1099';
          setErrorsCount(e => e + 1);
        } else if (rand > 0.90) {
          logType = 'warning';
          msg = '⚠️ AKASH (2079) — merged from 2 rows — PDF: 178KB';
        } else {
          msg = `✅ Athlete ${Math.floor(Math.random() * 9000) + 1000} — ${Math.floor(Math.random() * 5) + 1} events — PDF: ${Math.floor(Math.random() * 100) + 90}KB`;
        }

        setLogs(prev => [...prev, { id: Date.now(), time: timeStr, type: logType, message: msg }]);
      }, 150); // fast simulation
    }

    return () => clearInterval(interval);
  }, [currentStep, isPaused, progress, totalItems]);


  const startGeneration = () => {
    // Determine how many to simulate based on selection
    setTotalItems(generationMode === 'all' ? 275 : generationMode === 'pending' ? 245 : 275);
    setCompleted(0);
    setProgress(0);
    setErrorsCount(0);
    setLogs([]);
    setCurrentStep('PROGRESS');
  };

  return (
    <div className="admin-certificates-container">
      <div className="cert-title">
        <span>⚙️</span> Generate Certificates
      </div>

      {currentStep === 'CONFIGURE' && (
        <div className="cert-card animate-fade-in">
          
          {/* Competition Info - Read Only */}
          <div className="competition-info">
            <h3>6th National Para Shooting Championship 2025</h3>
            <p>Dr. Karni Singh Shooting Range, Delhi | 5th - 10th Dec 2025 | Total Athletes: 275</p>
          </div>

          <div className="options-section">
            <div className="options-title">Generation Options</div>
            
            <div className="radio-group">
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="gen-mode" 
                  checked={generationMode === 'all'} 
                  onChange={() => setGenerationMode('all')} 
                />
                Generate for ALL participants (275 athletes)
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="gen-mode" 
                  checked={generationMode === 'pending'} 
                  onChange={() => setGenerationMode('pending')} 
                />
                Generate for PENDING only (athletes without certs) (245 athletes)
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="gen-mode" 
                  checked={generationMode === 'specific'} 
                  onChange={() => setGenerationMode('specific')} 
                />
                Generate for SPECIFIC athletes
              </label>
              {generationMode === 'specific' && (
                <input type="text" className="search-box" placeholder="Search athletes by name or ID..." />
              )}
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="gen-mode" 
                  checked={generationMode === 'regenerate'} 
                  onChange={() => setGenerationMode('regenerate')} 
                />
                REGENERATE all (overwrites existing PDFs)
              </label>
            </div>
          </div>

          <div className="options-section">
            <div className="options-title">Output Configuration</div>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />
                Send email notification to each athlete when ready
              </label>
              <label className="checkbox-label">
                <input type="checkbox" checked={makePublic} onChange={(e) => setMakePublic(e.target.checked)} />
                Make certificates publicly downloadable immediately
              </label>
              <label className="checkbox-label">
                <input type="checkbox" checked={includeQr} onChange={(e) => setIncludeQr(e.target.checked)} />
                Include QR code for verification
              </label>
              <label className="checkbox-label">
                <input type="checkbox" checked={watermarkTime} onChange={(e) => setWatermarkTime(e.target.checked)} />
                Watermark with generation timestamp
              </label>
            </div>
          </div>

          <button className="btn-generate" onClick={startGeneration}>
            <span>🚀</span> Start Generation ({generationMode === 'all' ? 275 : generationMode === 'pending' ? 245 : 'All Selected'})
          </button>
        </div>
      )}

      {currentStep === 'PROGRESS' && (
        <div className="cert-card animate-fade-in progress-section">
          <div style={{ textAlign: 'left', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 600 }}>
            Generating Certificates...
          </div>
          
          <div className="progress-track" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <div className="progress-fill" style={{ width: `${progress}%` }}>
              {progress > 5 ? `${progress}%` : ''}
            </div>
          </div>

          <div className="progress-stats-row">
            <span>✅ Completed: {completed}</span>
            <span>⏳ Remaining: {totalItems - completed}</span>
            <span style={{ color: errorsCount > 0 ? '#fca5a5' : 'inherit' }}>❌ Errors: {errorsCount}</span>
          </div>

          <div className="progress-eta">
            <span>Estimated time: ~{Math.ceil((totalItems - completed) * 0.15)} sec remaining</span>
            <span>Speed: ~400 certificates/minute</span>
          </div>

          <div className="progress-actions">
            <button className="btn-secondary" onClick={() => setIsPaused(!isPaused)}>
              {isPaused ? '▶️ Resume' : '⏸ Pause'}
            </button>
            <button className="btn-secondary btn-danger" onClick={() => setCurrentStep('CONFIGURE')}>
              🛑 Cancel
            </button>
          </div>

          <div className="live-log">
            {logs.map(log => {
               let colorClass = 'log-success';
               if (log.type === 'warning') colorClass = 'log-warning';
               if (log.type === 'error') colorClass = 'log-error';
               
               return (
                 <p key={log.id}>
                   <span className="log-time">{log.time}</span>
                   <span className={colorClass}>{log.message}</span>
                 </p>
               );
            })}
            <div ref={logEndRef} />
          </div>
        </div>
      )}

      {currentStep === 'COMPLETE' && (
        <div className="cert-card animate-fade-in complete-section">
          
          <div className="celebration-card">
            <h2 className="celebration-title">🎉 Certificate Generation Complete!</h2>
          </div>

          <div className="summary-grid">
            <div className="summary-stat">
              <span className="stat-value">{completed}</span>
              <span className="stat-label">Generated</span>
            </div>
            <div className="summary-stat">
              <span className="stat-value" style={{ color: errorsCount > 0 ? '#fca5a5' : '#fff' }}>{errorsCount}</span>
              <span className="stat-label">Errors</span>
            </div>
            <div className="summary-stat">
              <span className="stat-value">{(completed * 0.13).toFixed(1)} MB</span>
              <span className="stat-label">Total Size</span>
            </div>
            <div className="summary-stat">
              <span className="stat-value">0m {Math.floor(completed * 0.15)}s</span>
              <span className="stat-label">Time Elapsed</span>
            </div>
          </div>

          {errorsCount > 0 && (
            <div className="error-card">
              <h4>{errorsCount} athletes could not be processed:</h4>
              <ul>
                <li>DEVENDRA JHA (reason: missing result data)</li>
                <li>R.K. SHARMA (reason: no events found)</li>
              </ul>
              <button className="btn-secondary">Retry Failed</button>
            </div>
          )}

          <div className="action-row">
            <button className="action-btn btn-primary">
              📦 Download All as ZIP
            </button>
            <button className="action-btn btn-outline" style={{ background: '#005a32', borderColor: '#005a32' }}>
              📧 Email All Athletes
            </button>
            <button className="action-btn btn-outline">
              📋 View Certificate List
            </button>
            <button className="action-btn btn-outline" onClick={() => setCurrentStep('CONFIGURE')}>
              🔄 Generate Again
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
