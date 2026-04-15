'use client'
import React from 'react'
import { INDIAN_STATES, FormData, StepErrors, formatAadhar, formatPAN, formatPincode } from './constants'

interface Props {
  data: FormData
  errors: StepErrors
  onChange: (field: string, value: string) => void
  isValid: (field: string) => boolean
}

export default function StepAddress({ data, errors, onChange, isValid }: Props) {
  return (
    <>
      <h3 className="reg-section-header">Address Details</h3>
      <div className="reg-grid reg-grid-3">
        <div className="reg-field">
          <label className="reg-label">Residential State</label>
          <select className="reg-select" value={data.residentialState}
            onChange={e => onChange('residentialState', e.target.value)}>
            <option value="">Select state</option>
            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="reg-field">
          <label className="reg-label">Residential City</label>
          <input className="reg-input" value={data.residentialCity}
            onChange={e => onChange('residentialCity', e.target.value)} placeholder="Enter city" />
        </div>
        <div className="reg-field">
          <label className="reg-label">Residential District</label>
          <input className="reg-input" value={data.residentialDistrict}
            onChange={e => onChange('residentialDistrict', e.target.value)} placeholder="Enter district" />
        </div>
      </div>

      <div className="reg-spacer" />

      <div className="reg-grid reg-grid-2">
        <div className="reg-field">
          <label className="reg-label">Domicile State</label>
          <select className="reg-select" value={data.domicileState}
            onChange={e => onChange('domicileState', e.target.value)}>
            <option value="">Select state</option>
            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="reg-field">
          <label className="reg-label">Pincode</label>
          <div className="reg-input-wrap">
            <input
              className={`reg-input ${errors.pincode ? 'error' : ''}`}
              value={data.pincode}
              onChange={e => onChange('pincode', formatPincode(e.target.value))}
              placeholder="6-digit pincode"
              inputMode="numeric"
            />
          </div>
          {errors.pincode && <span className="reg-error-msg">⚠ {errors.pincode}</span>}
        </div>
      </div>

      <div className="reg-spacer" />

      <div className="reg-field">
        <label className="reg-label">Address</label>
        <textarea className="reg-textarea" value={data.address as string}
          onChange={e => onChange('address', e.target.value)} placeholder="Full residential address" rows={3} />
      </div>

      <div className="reg-spacer" />

      <h3 className="reg-section-header">Identity Documents</h3>
      <div className="reg-grid reg-grid-2">
        <div className="reg-field">
          <label className="reg-label">Aadhar No</label>
          <div className="reg-input-wrap">
            <input
              className={`reg-input ${errors.aadharNo ? 'error' : ''}`}
              value={data.aadharNo}
              onChange={e => onChange('aadharNo', formatAadhar(e.target.value))}
              placeholder="XXXX-XXXX-XXXX"
            />
          </div>
          {errors.aadharNo && <span className="reg-error-msg">⚠ {errors.aadharNo}</span>}
        </div>
        <div className="reg-field">
          <label className="reg-label">PAN No</label>
          <div className="reg-input-wrap">
            <input
              className={`reg-input ${errors.panNo ? 'error' : ''}`}
              value={data.panNo}
              onChange={e => onChange('panNo', formatPAN(e.target.value))}
              placeholder="AAAAA9999A"
            />
          </div>
          {errors.panNo && <span className="reg-error-msg">⚠ {errors.panNo}</span>}
        </div>
      </div>

      <div className="reg-spacer" />

      <div className="reg-grid reg-grid-2">
        <div className="reg-field">
          <label className="reg-label">Passport No</label>
          <input className="reg-input" value={data.passportNo}
            onChange={e => onChange('passportNo', e.target.value)} placeholder="Passport number" />
        </div>
        <div className="reg-field">
          <label className="reg-label">Passport Issuing Authority</label>
          <input className="reg-input" value={data.passportAuthority}
            onChange={e => onChange('passportAuthority', e.target.value)} placeholder="Issuing authority" />
        </div>
      </div>

      <div className="reg-spacer" />

      <div className="reg-grid reg-grid-3">
        <div className="reg-field">
          <label className="reg-label">Date of Issue</label>
          <input type="date" className="reg-input" value={data.passportIssueDate}
            onChange={e => onChange('passportIssueDate', e.target.value)} />
        </div>
        <div className="reg-field">
          <label className="reg-label">Date of Expiry</label>
          <input type="date" className="reg-input" value={data.passportExpiryDate}
            onChange={e => onChange('passportExpiryDate', e.target.value)} />
        </div>
        <div className="reg-field">
          <label className="reg-label">Place of Issue</label>
          <input className="reg-input" value={data.placeOfIssue}
            onChange={e => onChange('placeOfIssue', e.target.value)} placeholder="Place of issue" />
        </div>
      </div>
    </>
  )
}
