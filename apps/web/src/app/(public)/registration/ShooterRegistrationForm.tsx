'use client'
import React, { useState, useCallback } from 'react'
import './registration.css'
import { STEPS, INITIAL_FORM_DATA, FormData, StepErrors, validateStep } from './constants'
import StepPersonal from './StepPersonal'
import StepFamily from './StepFamily'
import StepAddress from './StepAddress'
import StepSport from './StepSport'
import StepSizing from './StepSizing'
import StepReview from './StepReview'

export default function ShooterRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({ ...INITIAL_FORM_DATA })
  const [errors, setErrors] = useState<StepErrors>({})
  const [files, setFiles] = useState<Record<string, File | null>>({})
  const [certified, setCertified] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [refNum, setRefNum] = useState('')

  const handleChange = useCallback((field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  const handleFileChange = useCallback((key: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [key]: file }))
    setErrors(prev => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  const isFieldValid = useCallback((field: string) => {
    const v = formData[field]
    return typeof v === 'string' && v.trim().length > 0
  }, [formData])

  const goNext = () => {
    const stepErrors = validateStep(currentStep, formData, files)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }
    setErrors({})
    setCurrentStep(prev => Math.min(prev + 1, 6))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goBack = () => {
    setErrors({})
    setCurrentStep(prev => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToStep = (step: number) => {
    setErrors({})
    setCurrentStep(step)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = () => {
    const num = `REG-2025-${String(Math.floor(100000 + Math.random() * 900000))}`
    setRefNum(num)
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (submitted) {
    return (
      <div className="reg-wrapper">
        <div className="reg-card" style={{ maxWidth: 600 }}>
          <div className="reg-success">
            <div className="reg-success-check">✓</div>
            <h2>Registration Submitted Successfully!</h2>
            <p>Your application is under review. Your PCI ID will be</p>
            <p>assigned by the admin within 7 working days.</p>
            <div className="reg-success-ref">{refNum}</div>
            <div className="reg-success-card">
              <h3>Next Steps</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li>📧 A confirmation email will be sent to your registered contact</li>
                <li>🔍 Your documents will be verified by the PSAI committee</li>
                <li>🏅 Once approved, your PCI ID will be assigned and communicated</li>
                <li>📋 You may be contacted for additional information if needed</li>
                <li>🎯 Upon ID assignment, you can participate in sanctioned events</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="reg-wrapper">
      <div className="reg-header">
        <h1>PSAI — Shooter Registration</h1>
        <p>Para Shooting Committee of India</p>
      </div>

      {/* Progress Bar */}
      <div className="reg-progress">
        {STEPS.map((step, idx) => {
          const isCompleted = currentStep > step.num
          const isActive = currentStep === step.num
          return (
            <div
              key={step.num}
              className={`reg-progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed clickable' : ''}`}
              onClick={() => isCompleted && goToStep(step.num)}
            >
              <div className="reg-progress-circle">
                {isCompleted ? '✓' : step.num}
              </div>
              <span className="reg-progress-label">{step.label}</span>
              {idx < STEPS.length - 1 && <div className="reg-progress-line" />}
            </div>
          )
        })}
      </div>

      {/* Form Card */}
      <div className="reg-card">
        {currentStep === 1 && (
          <StepPersonal data={formData} errors={errors} onChange={handleChange} isValid={isFieldValid} />
        )}
        {currentStep === 2 && (
          <StepFamily data={formData} errors={errors} onChange={handleChange} isValid={isFieldValid} />
        )}
        {currentStep === 3 && (
          <StepAddress data={formData} errors={errors} onChange={handleChange} isValid={isFieldValid} />
        )}
        {currentStep === 4 && (
          <StepSport data={formData} errors={errors} onChange={handleChange} />
        )}
        {currentStep === 5 && (
          <StepSizing data={formData} errors={errors} onChange={handleChange} files={files} onFileChange={handleFileChange} />
        )}
        {currentStep === 6 && (
          <StepReview data={formData} files={files} onGoToStep={goToStep}
            certified={certified} setCertified={setCertified} onSubmit={handleSubmit} />
        )}

        {/* Navigation */}
        {currentStep < 6 && (
          <div className="reg-nav">
            {currentStep > 1 ? (
              <button type="button" className="reg-btn reg-btn-outline" onClick={goBack}>
                ← Back
              </button>
            ) : <div />}
            <button type="button" className="reg-btn reg-btn-primary" onClick={goNext}>
              Next →
            </button>
          </div>
        )}
        {currentStep === 6 && (
          <div className="reg-nav" style={{ justifyContent: 'flex-start' }}>
            <button type="button" className="reg-btn reg-btn-outline" onClick={goBack}>
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
