'use client'
import React from 'react'
import { MARITAL_STATUS, FormData, StepErrors } from './constants'

interface Props {
  data: FormData
  errors: StepErrors
  onChange: (field: string, value: string) => void
  isValid: (field: string) => boolean
}

export default function StepPersonal({ data, errors, onChange, isValid }: Props) {
  return (
    <>
      <h3 className="reg-section-header">Personal Information</h3>
      <div className="reg-grid reg-grid-3">
        {/* First Name */}
        <div className="reg-field">
          <label className="reg-label">First Name <span className="req">*</span></label>
          <div className="reg-input-wrap">
            <input
              className={`reg-input ${errors.firstName ? 'error' : isValid('firstName') ? 'valid' : ''}`}
              value={data.firstName}
              onChange={e => onChange('firstName', e.target.value)}
              placeholder="Enter first name"
            />
            {isValid('firstName') && <span className="reg-valid-tick">✓</span>}
          </div>
          {errors.firstName && <span className="reg-error-msg">⚠ {errors.firstName}</span>}
        </div>

        {/* Middle Name */}
        <div className="reg-field">
          <label className="reg-label">Middle Name</label>
          <input className="reg-input" value={data.middleName}
            onChange={e => onChange('middleName', e.target.value)} placeholder="Enter middle name" />
        </div>

        {/* Surname */}
        <div className="reg-field">
          <label className="reg-label">Surname <span className="req">*</span></label>
          <div className="reg-input-wrap">
            <input
              className={`reg-input ${errors.surname ? 'error' : isValid('surname') ? 'valid' : ''}`}
              value={data.surname}
              onChange={e => onChange('surname', e.target.value)}
              placeholder="Enter surname"
            />
            {isValid('surname') && <span className="reg-valid-tick">✓</span>}
          </div>
          {errors.surname && <span className="reg-error-msg">⚠ {errors.surname}</span>}
        </div>
      </div>

      <div className="reg-spacer" />

      <div className="reg-grid reg-grid-2">
        {/* Date of Birth */}
        <div className="reg-field">
          <label className="reg-label">Date of Birth <span className="req">*</span></label>
          <input
            type="date"
            className={`reg-input ${errors.dob ? 'error' : data.dob ? 'valid' : ''}`}
            value={data.dob}
            onChange={e => onChange('dob', e.target.value)}
          />
          {errors.dob && <span className="reg-error-msg">⚠ {errors.dob}</span>}
        </div>

        {/* Nationality */}
        <div className="reg-field">
          <label className="reg-label">Nationality</label>
          <input className="reg-input" value={data.nationality}
            onChange={e => onChange('nationality', e.target.value)} />
        </div>
      </div>

      <div className="reg-spacer" />

      {/* Gender */}
      <div className="reg-field">
        <label className="reg-label">Gender <span className="req">*</span></label>
        <div className="reg-radio-group">
          {['MALE', 'FEMALE', 'OTHER'].map(g => (
            <button key={g} type="button"
              className={`reg-radio-btn ${data.gender === g ? 'selected' : ''}`}
              onClick={() => onChange('gender', g)}>{g}</button>
          ))}
        </div>
        {errors.gender && <span className="reg-error-msg">⚠ {errors.gender}</span>}
      </div>

      <div className="reg-spacer" />

      <div className="reg-grid reg-grid-2">
        {/* Place of Birth */}
        <div className="reg-field">
          <label className="reg-label">Place of Birth</label>
          <input className="reg-input" value={data.placeOfBirth}
            onChange={e => onChange('placeOfBirth', e.target.value)} placeholder="Enter place of birth" />
        </div>

        {/* Marital Status */}
        <div className="reg-field">
          <label className="reg-label">Marital Status</label>
          <select className="reg-select" value={data.maritalStatus}
            onChange={e => onChange('maritalStatus', e.target.value)}>
            <option value="">Select status</option>
            {MARITAL_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
    </>
  )
}
