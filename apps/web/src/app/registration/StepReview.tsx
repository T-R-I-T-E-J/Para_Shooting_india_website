'use client'
import React from 'react'
import { FormData, EQUIPMENT_TOGGLES, DOCUMENTS, EquipmentKey } from './constants'

interface Props {
  data: FormData
  files: Record<string, File | null>
  onGoToStep: (step: number) => void
  certified: boolean
  setCertified: (v: boolean) => void
  onSubmit: () => void
}

function ReviewSection({ title, items, editStep, onGoToStep }: {
  title: string
  items: { label: string; value: string }[]
  editStep: number
  onGoToStep: (s: number) => void
}) {
  return (
    <div className="reg-review-section">
      <div className="reg-review-header">
        <span className="reg-review-title">{title}</span>
        <button className="reg-review-edit" type="button" onClick={() => onGoToStep(editStep)}>Edit</button>
      </div>
      <div className="reg-review-grid">
        {items.filter(i => i.value).map((item, idx) => (
          <div className="reg-review-item" key={idx}>
            <div className="reg-review-item-label">{item.label}</div>
            <div className="reg-review-item-value">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function StepReview({ data, files, onGoToStep, certified, setCertified, onSubmit }: Props) {
  const personalItems = [
    { label: 'First Name', value: data.firstName },
    { label: 'Middle Name', value: data.middleName },
    { label: 'Surname', value: data.surname },
    { label: 'Date of Birth', value: data.dob },
    { label: 'Gender', value: data.gender },
    { label: 'Place of Birth', value: data.placeOfBirth },
    { label: 'Nationality', value: data.nationality },
    { label: 'Marital Status', value: data.maritalStatus },
  ]

  const familyItems = [
    { label: 'Father Name', value: data.fatherName },
    { label: 'Mother Name', value: data.motherName },
    { label: 'Spouse Name', value: data.spouseName },
    { label: 'Contact No', value: data.contactNo },
    { label: 'Alt Contact', value: data.altContactNo },
    { label: 'Place of Work', value: data.placeOfWork },
  ]

  const addressItems = [
    { label: 'Residential State', value: data.residentialState },
    { label: 'City', value: data.residentialCity },
    { label: 'District', value: data.residentialDistrict },
    { label: 'Domicile State', value: data.domicileState },
    { label: 'Address', value: data.address as string },
    { label: 'Pincode', value: data.pincode },
    { label: 'Aadhar No', value: data.aadharNo },
    { label: 'PAN No', value: data.panNo },
    { label: 'Passport No', value: data.passportNo },
    { label: 'Passport Issue', value: data.passportIssueDate },
    { label: 'Passport Expiry', value: data.passportExpiryDate },
    { label: 'Issuing Authority', value: data.passportAuthority },
    { label: 'Place of Issue', value: data.placeOfIssue },
  ]

  const equipmentStr = EQUIPMENT_TOGGLES
    .filter(t => data[t.key as EquipmentKey] === true)
    .map(t => t.label)
    .join(', ') || 'None'

  const sportItems = [
    { label: 'Event Type', value: data.eventType },
    { label: 'Education', value: data.education },
    { label: 'PCI ID', value: 'Pending Admin Assignment' },
    { label: 'PCI Card Expiry', value: data.pciCardExpiry },
    { label: 'NSRS ID', value: data.nsrsId },
    { label: 'SDMS No', value: data.sdmsNo },
    { label: 'Classification', value: data.paraClassification },
    { label: 'Equipment', value: equipmentStr },
  ]

  const uploadedDocs = DOCUMENTS.filter(d => files[d.key]).map(d => d.name).join(', ') || 'None'
  const sizingItems = [
    { label: 'Weight', value: data.weight ? `${data.weight} kg` : '' },
    { label: 'Shoe Size', value: data.shoeSize },
    { label: 'Track Suit', value: data.trackSuitSize },
    { label: 'T-Shirt', value: data.tshirtSize },
    { label: 'Documents', value: uploadedDocs },
  ]

  return (
    <>
      <h3 className="reg-section-header">Review Your Registration</h3>

      <ReviewSection title="Personal Information" items={personalItems} editStep={1} onGoToStep={onGoToStep} />
      <ReviewSection title="Family & Contact" items={familyItems} editStep={2} onGoToStep={onGoToStep} />
      <ReviewSection title="Address & Identity" items={addressItems} editStep={3} onGoToStep={onGoToStep} />
      <ReviewSection title="Sport Profile & Classification" items={sportItems} editStep={4} onGoToStep={onGoToStep} />
      <ReviewSection title="Sizing & Documents" items={sizingItems} editStep={5} onGoToStep={onGoToStep} />

      <div className="reg-spacer" />

      <div className="reg-checkbox" onClick={() => setCertified(!certified)}>
        <div className={`reg-checkbox-box ${certified ? 'checked' : ''}`}>
          {certified && <span style={{ color: '#0a1628', fontSize: '0.85rem', fontWeight: 700 }}>✓</span>}
        </div>
        <span className="reg-checkbox-text">
          I certify that all information provided in this registration form is true, complete, and accurate to the best of my knowledge.
          I understand that providing false information may result in disqualification.
        </span>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button type="button" className="reg-btn reg-btn-gold" disabled={!certified} onClick={onSubmit}>
          Submit Registration →
        </button>
      </div>
    </>
  )
}
