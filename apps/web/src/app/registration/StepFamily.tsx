'use client'
import React from 'react'
import { FormData, StepErrors, formatPhone } from './constants'

interface Props {
  data: FormData
  errors: StepErrors
  onChange: (field: string, value: string) => void
  isValid: (field: string) => boolean
}

export default function StepFamily({ data, errors, onChange, isValid }: Props) {
  return (
    <>
      <h3 className="reg-section-header">Family &amp; Contact Details</h3>
      <div className="reg-grid reg-grid-3">
        <div className="reg-field">
          <label className="reg-label">Father Name</label>
          <input className="reg-input" value={data.fatherName}
            onChange={e => onChange('fatherName', e.target.value)} placeholder="Enter father's name" />
        </div>
        <div className="reg-field">
          <label className="reg-label">Mother Name</label>
          <input className="reg-input" value={data.motherName}
            onChange={e => onChange('motherName', e.target.value)} placeholder="Enter mother's name" />
        </div>
        <div className="reg-field">
          <label className="reg-label">Spouse Name</label>
          <input className="reg-input" value={data.spouseName}
            onChange={e => onChange('spouseName', e.target.value)} placeholder="Enter spouse name" />
        </div>
      </div>

      <div className="reg-spacer" />

      <div className="reg-grid reg-grid-2">
        <div className="reg-field">
          <label className="reg-label">Contact No <span className="req">*</span></label>
          <div className="reg-input-wrap">
            <input
              className={`reg-input ${errors.contactNo ? 'error' : isValid('contactNo') ? 'valid' : ''}`}
              value={data.contactNo}
              onChange={e => onChange('contactNo', formatPhone(e.target.value))}
              placeholder="10-digit mobile number"
              inputMode="numeric"
            />
            {isValid('contactNo') && <span className="reg-valid-tick">✓</span>}
          </div>
          {errors.contactNo && <span className="reg-error-msg">⚠ {errors.contactNo}</span>}
        </div>
        <div className="reg-field">
          <label className="reg-label">Alt Contact No</label>
          <div className="reg-input-wrap">
            <input
              className={`reg-input ${errors.altContactNo ? 'error' : ''}`}
              value={data.altContactNo}
              onChange={e => onChange('altContactNo', formatPhone(e.target.value))}
              placeholder="Alternate number"
              inputMode="numeric"
            />
          </div>
          {errors.altContactNo && <span className="reg-error-msg">⚠ {errors.altContactNo}</span>}
        </div>
      </div>

      <div className="reg-spacer" />

      <div className="reg-field">
        <label className="reg-label">Place of Work / Study</label>
        <input className="reg-input" value={data.placeOfWork}
          onChange={e => onChange('placeOfWork', e.target.value)}
          placeholder="Enter workplace or educational institution" />
      </div>
    </>
  )
}
