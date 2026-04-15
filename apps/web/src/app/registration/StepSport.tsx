'use client'
import React from 'react'
import { CLASSIFICATION_ROWS, EQUIPMENT_TOGGLES, FormData, StepErrors, EquipmentKey } from './constants'

interface Props {
  data: FormData
  errors: StepErrors
  onChange: (field: string, value: string | boolean) => void
}

export default function StepSport({ data, errors, onChange }: Props) {
  return (
    <>
      <h3 className="reg-section-header">Event Type</h3>
      <div className="reg-event-cards">
        {[
          { id: 'RIFLE', icon: '🎯', name: 'Rifle' },
          { id: 'PISTOL', icon: '🔫', name: 'Pistol' },
          { id: 'SHOTGUN', icon: '💥', name: 'Shotgun' },
        ].map(ev => (
          <button key={ev.id} type="button"
            className={`reg-event-card ${data.eventType === ev.id ? 'selected' : ''}`}
            onClick={() => onChange('eventType', ev.id)}>
            <div className="icon">{ev.icon}</div>
            <div className="name">{ev.name}</div>
          </button>
        ))}
      </div>

      <div className="reg-spacer" />

      <div className="reg-grid reg-grid-2">
        <div className="reg-field">
          <label className="reg-label">Education</label>
          <input className="reg-input" value={data.education}
            onChange={e => onChange('education', e.target.value)} placeholder="Highest qualification" />
        </div>
        <div className="reg-field">
          <label className="reg-label">PCI ID No</label>
          <div className="reg-pci-badge">
            <span className="reg-pci-pulse" />
            ⏳ Pending Admin Assignment
          </div>
        </div>
      </div>

      <div className="reg-spacer" />

      <div className="reg-grid reg-grid-3">
        <div className="reg-field">
          <label className="reg-label">PCI Card Expiry</label>
          <input type="date" className="reg-input" value={data.pciCardExpiry}
            onChange={e => onChange('pciCardExpiry', e.target.value)} />
        </div>
        <div className="reg-field">
          <label className="reg-label">NSRS ID No</label>
          <input className="reg-input" value={data.nsrsId}
            onChange={e => onChange('nsrsId', e.target.value)} placeholder="NSRS ID" />
        </div>
        <div className="reg-field">
          <label className="reg-label">SDMS No</label>
          <input className="reg-input" value={data.sdmsNo}
            onChange={e => onChange('sdmsNo', e.target.value)} placeholder="SDMS number" />
        </div>
      </div>

      <div className="reg-spacer" />

      <h3 className="reg-section-header">Para Classification <span className="req">*</span></h3>
      <div className="reg-class-grid">
        {CLASSIFICATION_ROWS.map((row, ri) => (
          <div className="reg-class-row" key={ri}>
            {row.map(cls => (
              <button key={cls} type="button"
                className={`reg-class-btn ${data.paraClassification === cls ? 'selected' : ''}`}
                onClick={() => onChange('paraClassification', cls)}>
                {cls}
              </button>
            ))}
          </div>
        ))}
      </div>
      {errors.paraClassification && <span className="reg-error-msg" style={{ marginTop: 8 }}>⚠ {errors.paraClassification}</span>}

      <div className="reg-spacer" />

      <h3 className="reg-section-header">Equipment Adaptations</h3>
      <div className="reg-toggles">
        {EQUIPMENT_TOGGLES.map(t => {
          const val = data[t.key as EquipmentKey] as boolean
          return (
            <div className="reg-toggle-item" key={t.key}>
              <span className="reg-toggle-label">{t.label}</span>
              <div className="reg-toggle-pill">
                <button type="button"
                  className={`reg-toggle-opt ${val ? 'yes-active' : ''}`}
                  onClick={() => onChange(t.key, true)}>YES</button>
                <button type="button"
                  className={`reg-toggle-opt ${!val ? 'no-active' : ''}`}
                  onClick={() => onChange(t.key, false)}>NO</button>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
