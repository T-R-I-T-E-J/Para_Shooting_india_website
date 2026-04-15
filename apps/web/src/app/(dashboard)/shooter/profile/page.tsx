'use client'

import { useState, useRef, useEffect } from 'react'
import { DashboardHeader } from '@/components/dashboard'
import { 
  User, MapPin, Camera, Shield, Save, 
  CheckCircle, Briefcase, Globe, Info, FileText, Lock, X
} from 'lucide-react'
import clsx from 'clsx'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'

const tabs = [
  { id: 'personal', label: 'Personal Details', icon: User },
  { id: 'guardian', label: 'Parent/Guardian', icon: Briefcase },
  { id: 'address', label: 'Address Details', icon: MapPin },
  { id: 'passport', label: 'Passport Details', icon: Globe },
  { id: 'media', label: 'Photo & Signature', icon: Camera },
]

const classifications = [
  { code: 'SH1', description: 'Athletes with lower limb impairment - Able to support rifle/pistol without support' },
  { code: 'SH2', description: 'Athletes with upper limb impairment - Require shooting stand for support' },
  { code: 'SH-VI', description: 'Visual Impairment - Rifle' },
  { code: 'SG-S', description: 'Shotgun Standing' },
  { code: 'SG-L', description: 'Shotgun Seated' },
  { code: 'SH1 A', description: 'SH1 Subcategory A' },
  { code: 'SH1 B', description: 'SH1 Subcategory B' },
  { code: 'SH1 C', description: 'SH1 Subcategory C' },
  { code: 'SH2 A', description: 'SH2 Subcategory A' },
  { code: 'SH2 B', description: 'SH2 Subcategory B' },
  { code: 'SH2 C', description: 'SH2 Subcategory C' },
  { code: 'SH2 Aa', description: 'SH2 Subcategory Aa' },
  { code: 'SH2 Ba', description: 'SH2 Subcategory Ba' },
  { code: 'SH2 Ca', description: 'SH2 Subcategory Ca' },
  { code: 'SH2 Ab', description: 'SH2 Subcategory Ab' },
  { code: 'SH2 Bb', description: 'SH2 Subcategory Bb' },
  { code: 'SH2 Cb', description: 'SH2 Subcategory Cb' },
]

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

interface ShooterProfileData {
  // Personal
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string; // Used as primary contact
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  nationality: string;
  placeOfBirth: string;
  maritalStatus: string;
  education: string;
  
  // Guardian & Contact
  guardianName: string;
  guardianRelation: string; // To keep backward compat or just map to Father/Mother/Spouse
  fatherName: string;
  motherName: string;
  spouseName: string;
  alternatePhone: string;
  placeOfWorkStudy: string;
  
  // Address
  address: string;
  city: string;
  state: string;
  pincode: string;
  district: string;
  domicileState: string;
  
  // Identity
  aadharNumber: string;
  panNumber: string;
  
  // Passport
  passportNumber: string;
  passportIssue: string;
  passportExpiry: string;
  placeOfIssue: string;
  issuingAuthority: string;
  
  // Sport Profile
  classification: string;
  classificationDate: string;
  nextReviewDate: string;
  psciId: string;
  pciId: string;
  category: string;
  membership: string;
  memberSince: string;
  eventType: string;
  sdmsNo: string;
  nsrsId: string;
  pciCardExpiry: string;

  // Equipment Adaptations
  triggerAdaptation: boolean;
  loader: boolean;
  wheelchair: boolean;
  loadingDevice: boolean;

  // Sizing
  weight: string;
  shoeSize: string;
  trackSuitSize: string;
  tShirtSize: string;

  // Media
  photoUrl: string | null;
  signatureUrl: string | null;
  birthCertificateUrl: string | null;
  aadharCardUrl: string | null;
  panCardUrl: string | null;
  passportDocUrl: string | null;
  armsLicenseUrl: string | null;
  affidavitUrl: string | null;
  ipcCardUrl: string | null;
}

interface TabProps {
  formData: ShooterProfileData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
  onSave: (section: string) => void;
  onCancel: () => void;
}

// Global Toast logic wrapped in the main component

const PersonalTab = ({ formData, handleChange, handleCheckboxChange, isEditing, onSave, onCancel }: TabProps) => (
  <div className="space-y-8 animate-fade-in">
    {/* Personal Information */}
    <div className="space-y-4">
      <h3 className="font-heading font-semibold text-lg text-primary flex items-center gap-2 border-b border-neutral-200 pb-2">
        <User className="w-5 h-5" />
        Personal Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="label">First Name</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} disabled={!isEditing} className={clsx('input', !isEditing && 'bg-neutral-50 px-0 border-transparent font-medium text-neutral-800')} />
        </div>
        <div>
          <label className="label">Middle Name</label>
          <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} disabled={!isEditing} placeholder={!isEditing ? "Not provided" : ""} className={clsx('input', !isEditing && 'bg-neutral-50 px-0 border-transparent font-medium text-neutral-800')} />
        </div>
        <div>
          <label className="label">Last Name</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} disabled={!isEditing} className={clsx('input', !isEditing && 'bg-neutral-50 px-0 border-transparent font-medium text-neutral-800')} />
        </div>
        <div>
          <label className="label">Date of Birth</label>
          {isEditing ? (
            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="input" />
          ) : (
            <div className="bg-neutral-50 py-2 font-medium text-neutral-800">
              {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : <span className="text-neutral-400 font-normal">Not provided</span>}
            </div>
          )}
        </div>
        <div>
          <label className="label">Gender</label>
          {isEditing ? (
            <select name="gender" value={formData.gender} onChange={handleChange} className="input">
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          ) : (
            <div className="bg-neutral-50 py-2 font-medium text-neutral-800">
              {formData.gender ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) : <span className="text-neutral-400 font-normal">Not provided</span>}
            </div>
          )}
        </div>
        <div>
          <label className="label">Place of Birth</label>
          <input type="text" name="placeOfBirth" value={formData.placeOfBirth} onChange={handleChange} disabled={!isEditing} placeholder={!isEditing ? "Not provided" : ""} className={clsx('input', !isEditing && 'bg-neutral-50 px-0 border-transparent font-medium text-neutral-800')} />
        </div>
        <div>
          <label className="label">Nationality</label>
          <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} disabled={!isEditing} className={clsx('input', !isEditing && 'bg-neutral-50 px-0 border-transparent font-medium text-neutral-800')} />
        </div>
        <div>
          <label className="label">Marital Status</label>
          {isEditing ? (
            <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="input">
              <option value="">Select status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          ) : (
            <div className="bg-neutral-50 py-2 font-medium text-neutral-800">{formData.maritalStatus || <span className="text-neutral-400 font-normal">Not provided</span>}</div>
          )}
        </div>
        <div>
          <label className="label">Blood Group</label>
          {isEditing ? (
            <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="input">
              <option value="">Select blood group</option>
              <option value="A+">A+</option>
              <option value="A-">A−</option>
              <option value="B+">B+</option>
              <option value="B-">B−</option>
              <option value="O+">O+</option>
              <option value="O-">O−</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB−</option>
            </select>
          ) : (
            <div className="bg-neutral-50 py-2 font-medium text-neutral-800">{formData.bloodGroup || <span className="text-neutral-400 font-normal">Not provided</span>}</div>
          )}
        </div>
        <div>
          <label className="label">Education</label>
          <input type="text" name="education" value={formData.education} onChange={handleChange} disabled={!isEditing} placeholder={!isEditing ? "Not provided" : ""} className={clsx('input', !isEditing && 'bg-neutral-50 px-0 border-transparent font-medium text-neutral-800')} />
        </div>
      </div>
    </div>

    {/* Sport Profile */}
    <div className="space-y-4">
      <h3 className="font-heading font-semibold text-lg text-primary flex items-center gap-2 border-b border-neutral-200 pb-2">
        Sport Profile
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="label">PCI / NPSML ID</label>
          <input type="text" value={formData.psciId} disabled className="input bg-neutral-50 px-0 border-transparent font-data font-bold text-neutral-800" />
        </div>
        <div>
          <label className="label">Member Since</label>
          <input type="text" value={formData.memberSince} disabled className="input bg-neutral-50 px-0 border-transparent font-medium text-neutral-800" />
        </div>
        <div>
          <label className="label">Event Type</label>
          {isEditing ? (
            <select name="eventType" value={formData.eventType} onChange={handleChange} className="input">
              <option value="">Select event type</option>
              <option value="Rifle">Rifle</option>
              <option value="Pistol">Pistol</option>
              <option value="Shotgun">Shotgun</option>
            </select>
          ) : (
            <div className="bg-neutral-50 py-2 font-medium text-neutral-800">{formData.eventType || <span className="text-neutral-400 font-normal">Not provided</span>}</div>
          )}
        </div>
        <div>
          <label className="label">WSPS Category</label>
          {isEditing ? (
            <select name="category" value={formData.category} onChange={handleChange} className="input">
              <optgroup label="Main Categories">
                <option value="">Select category</option>
                <option value="SH1">SH1</option>
                <option value="SH2">SH2</option>
                <option value="SH-VI">SH-VI</option>
                <option value="SG-S">SG-S</option>
                <option value="SG-L">SG-L</option>
              </optgroup>
              <optgroup label="SH1 Subcategories">
                <option value="SH1 A">SH1 A</option>
                <option value="SH1 B">SH1 B</option>
                <option value="SH1 C">SH1 C</option>
              </optgroup>
              <optgroup label="SH2 Subcategories">
                <option value="SH2 A">SH2 A</option>
                <option value="SH2 B">SH2 B</option>
                <option value="SH2 C">SH2 C</option>
                <option value="SH2 Aa">SH2 Aa</option>
                <option value="SH2 Ba">SH2 Ba</option>
                <option value="SH2 Ca">SH2 Ca</option>
                <option value="SH2 Ab">SH2 Ab</option>
                <option value="SH2 Bb">SH2 Bb</option>
                <option value="SH2 Cb">SH2 Cb</option>
              </optgroup>
            </select>
          ) : (
            <div className="bg-neutral-50 py-2 font-bold text-accent">{formData.category || <span className="text-neutral-400 font-normal">Not provided</span>}</div>
          )}
        </div>
        <div>
          <label className="label">SDMS No</label>
          <input type="text" name="sdmsNo" value={formData.sdmsNo} onChange={handleChange} disabled={!isEditing} placeholder={!isEditing ? "Not provided" : ""} className={clsx('input font-data', !isEditing && 'bg-neutral-50 px-0 border-transparent font-medium text-neutral-800')} />
        </div>
        <div>
          <label className="label">NSRS ID</label>
          <input type="text" name="nsrsId" value={formData.nsrsId} onChange={handleChange} disabled={!isEditing} placeholder={!isEditing ? "Not provided" : ""} className={clsx('input font-data', !isEditing && 'bg-neutral-50 px-0 border-transparent font-medium text-neutral-800')} />
        </div>
        <div>
          <label className="label">PCI Card Expiry</label>
          {isEditing ? (
            <input type="date" name="pciCardExpiry" value={formData.pciCardExpiry} onChange={handleChange} className="input font-data" />
          ) : (
            <div className="bg-neutral-50 py-2 font-medium text-neutral-800">
              {formData.pciCardExpiry ? new Date(formData.pciCardExpiry).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : <span className="text-neutral-400 font-normal">Not provided</span>}
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Equipment & Sizing */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Adaptations */}
      <div className="space-y-4">
        <h3 className="font-heading font-semibold text-lg text-primary flex items-center gap-2 border-b border-neutral-200 pb-2">
          Equipment Adaptations
        </h3>
        <div className="space-y-3">
          {[
            { key: 'triggerAdaptation', label: 'Trigger Adaptation' },
            { key: 'loader', label: 'Loader' },
            { key: 'wheelchair', label: 'Wheelchair' },
            { key: 'loadingDevice', label: 'Loading Device' }
          ].map((item) => (
            <div key={item.key} className="flex justify-between items-center bg-white p-3 rounded-md border border-neutral-200">
              <span className="font-medium text-neutral-700">{item.label}</span>
              {isEditing ? (
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name={item.key} checked={formData[item.key as keyof ShooterProfileData] as boolean} onChange={handleCheckboxChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              ) : (
                <span className={clsx("text-xs font-bold px-2 py-1 rounded", formData[item.key as keyof ShooterProfileData] ? "bg-green-100 text-green-800" : "bg-neutral-100 text-neutral-600")}>
                  {formData[item.key as keyof ShooterProfileData] ? "YES" : "NO"}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sizing */}
      <div className="space-y-4">
        <h3 className="font-heading font-semibold text-lg text-primary flex items-center gap-2 border-b border-neutral-200 pb-2">
          Sizing
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="label">Weight (kg)</label>
            <input type="number" step="0.1" name="weight" value={formData.weight} onChange={handleChange} disabled={!isEditing} placeholder={!isEditing ? "Not set" : ""} className={clsx('input', !isEditing && 'bg-neutral-50 px-0 border-transparent font-medium text-neutral-800')} />
          </div>
          <div>
            <label className="label">Shoe Size</label>
            <input type="text" name="shoeSize" value={formData.shoeSize} onChange={handleChange} disabled={!isEditing} placeholder={!isEditing ? "Not set" : ""} className={clsx('input', !isEditing && 'bg-neutral-50 px-0 border-transparent font-medium text-neutral-800')} />
          </div>
          <div>
            <label className="label">Track Suit Size</label>
            {isEditing ? (
              <select name="trackSuitSize" value={formData.trackSuitSize} onChange={handleChange} className="input">
                <option value="">Select Size</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            ) : (
              <div className="bg-neutral-50 py-2 font-medium text-neutral-800">{formData.trackSuitSize || "Not set"}</div>
            )}
          </div>
          <div>
            <label className="label">T-Shirt Size</label>
            {isEditing ? (
              <select name="tShirtSize" value={formData.tShirtSize} onChange={handleChange} className="input">
                <option value="">Select Size</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            ) : (
              <div className="bg-neutral-50 py-2 font-medium text-neutral-800">{formData.tShirtSize || "Not set"}</div>
            )}
          </div>
        </div>
      </div>
    </div>

    {isEditing && (
      <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
        <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
        <button type="button" onClick={() => onSave('personal')} className="btn-primary">
          <Save className="w-4 h-4 mr-2" /> Save Changes
        </button>
      </div>
    )}
  </div>
)

const GuardianTab = ({ formData, handleChange, isEditing, onSave, onCancel }: TabProps) => (
  <div className="space-y-8 animate-fade-in">
    {/* Family Information */}
    <div className="space-y-4">
      <h3 className="font-heading font-semibold text-lg text-primary flex items-center gap-2 border-b border-neutral-200 pb-2">
        <Briefcase className="w-5 h-5" />
        Family Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="label">Father's Name</label>
          <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} disabled={!isEditing} placeholder={!isEditing ? "Not provided" : ""} className={clsx('input', !isEditing && 'bg-neutral-50 px-0 border-transparent font-medium text-neutral-800')} />
        </div>
        <div>
          <label className="label">Mother's Name</label>
          <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} disabled={!isEditing} placeholder={!isEditing ? "Not provided" : ""} className={clsx('input', !isEditing && 'bg-neutral-50 px-0 border-transparent font-medium text-neutral-800')} />
        </div>
        <div>
          <label className="label">Spouse's Name</label>
          <input type="text" name="spouseName" value={formData.spouseName} onChange={handleChange} disabled={!isEditing} placeholder={!isEditing ? "Not provided" : ""} className={clsx('input', !isEditing && 'bg-neutral-50 px-0 border-transparent font-medium text-neutral-800')} />
        </div>
      </div>
    </div>

    {/* Contact Information */}
    <div className="space-y-4">
      <h3 className="font-heading font-semibold text-lg text-primary flex items-center gap-2 border-b border-neutral-200 pb-2">
        Contact Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="label">Primary Contact</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} className={clsx('input', !isEditing && 'bg-neutral-50 px-0 border-transparent font-medium text-neutral-800')} />
          {isEditing && formData.phone && formData.phone.replace(/\D/g, '').length !== 10 && (
            <p className="text-xs text-red-500 mt-1">Must be exactly 10 digits</p>
          )}
        </div>
        <div>
          <label className="label">Alt Contact</label>
          <input type="tel" name="alternatePhone" value={formData.alternatePhone} onChange={handleChange} disabled={!isEditing} placeholder={!isEditing ? "Not provided" : ""} className={clsx('input', !isEditing && 'bg-neutral-50 px-0 border-transparent font-medium text-neutral-800')} />
        </div>
        <div>
          <label className="label">Email Address</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} disabled className="input bg-neutral-50 px-0 border-transparent font-medium text-neutral-800" />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <label className="label">Place of Work / Study</label>
          <input type="text" name="placeOfWorkStudy" value={formData.placeOfWorkStudy} onChange={handleChange} disabled={!isEditing} placeholder={!isEditing ? "Not provided" : ""} className={clsx('input', !isEditing && 'bg-neutral-50 px-0 border-transparent font-medium text-neutral-800')} />
        </div>
      </div>
    </div>

    {isEditing && (
      <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
        <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
        <button type="button" onClick={() => onSave('family')} className="btn-primary">
          <Save className="w-4 h-4 mr-2" /> Save Changes
        </button>
      </div>
    )}
  </div>
)

const AddressTab = ({ formData, handleChange, isEditing, onSave, onCancel }: TabProps) => (
  <div className="space-y-8 animate-fade-in">
    {/* Residential Address */}
    <div className="space-y-4">
      <h3 className="font-heading font-semibold text-lg text-primary flex items-center gap-2 border-b border-neutral-200 pb-2">
        <MapPin className="w-5 h-5" />
        Residential Address
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="md:col-span-2 lg:col-span-3">
          <label className="label">Address</label>
          <textarea name="address" value={formData.address} onChange={handleChange} disabled={!isEditing} rows={2} className={clsx('input', !isEditing && 'bg-neutral-50 px-0 border-transparent font-medium text-neutral-800 shadow-none')} />
        </div>
        <div>
          <label className="label">City</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} disabled={!isEditing} className={clsx('input', !isEditing && 'bg-neutral-50 px-0 border-transparent font-medium text-neutral-800')} />
        </div>
        <div>
          <label className="label">District</label>
          <input type="text" name="district" value={formData.district} onChange={handleChange} disabled={!isEditing} className={clsx('input', !isEditing && 'bg-neutral-50 px-0 border-transparent font-medium text-neutral-800')} />
        </div>
        <div>
          <label className="label">State</label>
          {isEditing ? (
            <select name="state" value={formData.state} onChange={handleChange} className="input">
              <option value="">Select State</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Delhi">Delhi</option>
              <option value="Haryana">Haryana</option>
              {/* Other states ommitted for brevity, assume full list in production */}
              <option value="Maharashtra">Maharashtra</option>
            </select>
          ) : (
            <div className="bg-neutral-50 py-2 font-medium text-neutral-800">{formData.state || "Not set"}</div>
          )}
        </div>
        <div>
          <label className="label">Pincode</label>
          <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} disabled={!isEditing} className={clsx('input', !isEditing && 'bg-neutral-50 px-0 border-transparent font-medium text-neutral-800')} />
          {isEditing && formData.pincode && formData.pincode.length !== 6 && (
            <p className="text-xs text-red-500 mt-1">Must be exactly 6 digits</p>
          )}
        </div>
        <div>
          <label className="label">Domicile State</label>
          {isEditing ? (
            <select name="domicileState" value={formData.domicileState} onChange={handleChange} className="input">
              <option value="">Select State</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Delhi">Delhi</option>
              <option value="Haryana">Haryana</option>
              <option value="Maharashtra">Maharashtra</option>
            </select>
          ) : (
            <div className="bg-neutral-50 py-2 font-medium text-neutral-800">{formData.domicileState || "Not set"}</div>
          )}
        </div>
      </div>
    </div>

    {/* Identity Numbers */}
    <div className="space-y-4">
      <h3 className="font-heading font-semibold text-lg text-primary flex items-center gap-2 border-b border-neutral-200 pb-2">
        <Shield className="w-5 h-5" />
        Identity Numbers
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="label">Aadhar Number</label>
          <input type="text" name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} disabled={!isEditing} placeholder={!isEditing ? "Not provided" : ""} className={clsx('input font-data tracking-wider', !isEditing && 'bg-neutral-50 px-0 border-transparent font-bold text-neutral-800')} />
          {isEditing && formData.aadharNumber && formData.aadharNumber.replace(/\D/g, '').length !== 12 && (
            <p className="text-xs text-red-500 mt-1">Must be exactly 12 digits</p>
          )}
        </div>
        <div>
          <label className="label">PAN Number</label>
          <input type="text" name="panNumber" value={formData.panNumber} onChange={handleChange} disabled={!isEditing} placeholder={!isEditing ? "Not provided" : ""} className={clsx('input font-data tracking-wider uppercase', !isEditing && 'bg-neutral-50 px-0 border-transparent font-bold text-neutral-800')} />
          {isEditing && formData.panNumber && formData.panNumber.length !== 10 && (
            <p className="text-xs text-red-500 mt-1">Must be exactly 10 characters</p>
          )}
        </div>
      </div>
    </div>

    {isEditing && (
      <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
        <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
        <button type="button" onClick={() => onSave('address')} className="btn-primary">
          <Save className="w-4 h-4 mr-2" /> Save Changes
        </button>
      </div>
    )}
  </div>
)

const PassportTab = ({ formData, handleChange, isEditing, onSave, onCancel }: TabProps) => {
  const isExpiringSoon = formData.passportExpiry ? (new Date(formData.passportExpiry).getTime() - Date.now()) < (6 * 30 * 24 * 60 * 60 * 1000) : false;
  const isExpired = formData.passportExpiry ? new Date(formData.passportExpiry).getTime() < Date.now() : false;

  if (!isEditing && !formData.passportNumber) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <Globe className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
        <h4 className="font-heading font-semibold text-lg text-neutral-700">No passport details added yet</h4>
        <p className="text-sm text-neutral-500 mb-6 max-w-sm mx-auto">Passport details are mandatory for participation in international competitions.</p>
        {/* We can let user click the global edit button to add, or provide a shortcut here */}
        <p className="text-sm text-primary font-medium">Click "Edit Information" above to add your passport.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-4">
        <h3 className="font-heading font-semibold text-lg text-primary flex items-center gap-2 border-b border-neutral-200 pb-2">
          <Globe className="w-5 h-5" />
          Passport Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="label">Passport Number</label>
            <input type="text" name="passportNumber" value={formData.passportNumber} onChange={handleChange} disabled={!isEditing} className={clsx('input font-data uppercase', !isEditing && 'bg-neutral-50 px-0 border-transparent font-bold text-neutral-800')} />
          </div>
          <div>
            <label className="label">Date of Issue</label>
            <input type="date" name="passportIssue" value={formData.passportIssue} onChange={handleChange} disabled={!isEditing} className={clsx('input', !isEditing && 'bg-neutral-50 px-0 border-transparent font-medium text-neutral-800')} />
          </div>
          <div>
            <label className="label">Date of Expiry</label>
            <div className="flex items-center gap-2">
              <input type="date" name="passportExpiry" value={formData.passportExpiry} onChange={handleChange} disabled={!isEditing} className={clsx('input flex-1', !isEditing && 'bg-neutral-50 px-0 border-transparent font-medium text-neutral-800')} />
              {!isEditing && formData.passportExpiry && (
                isExpired ? (
                  <span className="badge-error text-xs">Expired</span>
                ) : isExpiringSoon ? (
                  <span className="badge-warning text-xs">Expiring Soon</span>
                ) : (
                  <span className="badge-success text-xs">Valid</span>
                )
              )}
            </div>
          </div>
          <div>
            <label className="label">Issuing Authority</label>
            <input type="text" name="issuingAuthority" value={formData.issuingAuthority} onChange={handleChange} disabled={!isEditing} placeholder={!isEditing ? "Not provided" : ""} className={clsx('input', !isEditing && 'bg-neutral-50 px-0 border-transparent font-medium text-neutral-800')} />
          </div>
          <div>
            <label className="label">Place of Issue</label>
            <input type="text" name="placeOfIssue" value={formData.placeOfIssue} onChange={handleChange} disabled={!isEditing} placeholder={!isEditing ? "Not provided" : ""} className={clsx('input', !isEditing && 'bg-neutral-50 px-0 border-transparent font-medium text-neutral-800')} />
          </div>
          <div>
            <label className="label">Nationality</label>
            {isEditing ? (
              <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} className="input" />
            ) : (
              <div className="bg-neutral-50 py-2 font-medium text-neutral-800">{formData.nationality || "Indian"}</div>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
          <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
          <button type="button" onClick={() => onSave('passport')} className="btn-primary">
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </button>
        </div>
      )}
    </div>
  )
}

const DocumentUploadCard = ({ 
  label, field, currentUrl, onDocumentUpdate, showToast, maxSizeMB = 2, accept = "image/jpeg,image/png,application/pdf"
}: { 
  label: string, field: string, currentUrl: string | null, maxSizeMB?: number, accept?: string,
  onDocumentUpdate: (f: string, u: string) => void, showToast: any
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > maxSizeMB * 1024 * 1024) {
        showToast(`${label} must be less than ${maxSizeMB}MB`, "error")
        return
      }
      setIsUploading(true)
      try {
        const formData = new FormData()
        formData.append('document', file)
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
        const res = await fetch(`${API_URL}/upload/document`, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        })
        if (!res.ok) throw new Error('Upload failed')
        const json = await res.json()
        const data = json.data || json
        const url = data.file?.url || data.url
        onDocumentUpdate(field, url)
        showToast(`${label} uploaded successfully`, "success")
      } catch (err) {
        showToast(`Failed to upload ${label}. Please try again.`, "error")
      } finally {
        setIsUploading(false)
      }
    }
  }

  return (
    <div className="border border-neutral-200 rounded-md p-4 text-center bg-white hover:bg-neutral-50 transition-colors relative">
      <h4 className="font-semibold text-sm text-neutral-700 mb-3">{label}</h4>
      <div className="w-12 h-12 bg-neutral-100 mx-auto mb-3 rounded-full flex items-center justify-center">
        {currentUrl ? (
          <CheckCircle className="w-6 h-6 text-green-500" />
        ) : (
          <FileText className="w-6 h-6 text-neutral-400" />
        )}
      </div>
      {isUploading ? (
        <div className="w-full max-w-[150px] mx-auto bg-neutral-200 rounded-full h-1 mb-2 overflow-hidden">
          <div className="bg-primary h-1 rounded-full animate-[progress_1s_ease-in-out_infinite] w-1/2"></div>
        </div>
      ) : (
        <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-outline text-xs px-3 py-1.5 h-auto">
          {currentUrl ? "Replace" : "Upload"}
        </button>
      )}
      <p className="text-[10px] text-neutral-400 mt-2">Max {maxSizeMB}MB, {accept.includes('pdf') ? 'PDF/JPG/PNG' : 'JPG/PNG'}</p>
      <input type="file" ref={fileInputRef} className="hidden" accept={accept} onChange={handleUpload} />
    </div>
  )
}

const MediaTab = ({ formData, onDocumentUpdate, showToast }: { formData: ShooterProfileData, onDocumentUpdate: (field: string, url: string) => void, showToast: (msg: string, t: 'success'|'error'|'info') => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const signatureInputRef = useRef<HTMLInputElement>(null)
  const [isPhotoUploading, setIsPhotoUploading] = useState(false)
  const [isSigUploading, setIsSigUploading] = useState(false)

  const photo = formData.photoUrl;
  const signature = formData.signatureUrl;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 2 * 1024 * 1024) {
        showToast("Photo must be less than 2MB", "error")
        return
      }
      setIsPhotoUploading(true)
      try {
        const formData = new FormData()
        formData.append('profilePicture', file)
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
        const res = await fetch(`${API_URL}/upload/profile-picture`, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        })
        if (!res.ok) throw new Error('Upload failed')
        const json = await res.json()
        const data = json.data || json
        const url = data.file?.url || data.url
        onDocumentUpdate('photoUrl', url)
        showToast("Profile photo uploaded successfully", "success")
      } catch (err) {
        showToast("Failed to upload photo. Please try again.", "error")
      } finally {
        setIsPhotoUploading(false)
      }
    }
  }

  const handleSignatureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 1 * 1024 * 1024) {
        showToast("Signature must be less than 1MB", "error")
        return
      }
      setIsSigUploading(true)
      try {
        const formData = new FormData()
        formData.append('document', file)
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
        const res = await fetch(`${API_URL}/upload/document`, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        })
        if (!res.ok) throw new Error('Upload failed')
        const json = await res.json()
        const data = json.data || json
        const url = data.file?.url || data.url
        onDocumentUpdate('signatureUrl', url)
        showToast("Specimen signature uploaded successfully", "success")
      } catch (err) {
        showToast("Failed to upload signature. Please try again.", "error")
      } finally {
        setIsSigUploading(false)
      }
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-4">
        <h3 className="font-heading font-semibold text-lg text-primary flex items-center gap-2 border-b border-neutral-200 pb-2">
            <Camera className="w-5 h-5" />
            Photo & Signature
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
            <div className="space-y-4">
              <label className="label">Profile Photo</label>
              <div className="border-2 border-dashed border-neutral-200 rounded-card p-8 text-center bg-neutral-50 relative group">
                <div className="w-40 h-40 bg-neutral-200 mx-auto mb-4 rounded-full overflow-hidden flex items-center justify-center relative border-4 border-white shadow-sm">
                  {photo ? (
                    <>
                      <Image src={photo} alt="Profile" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white" onClick={() => fileInputRef.current?.click()}>
                        <div className="text-center">
                          <Camera className="w-6 h-6 mx-auto mb-1" />
                          <span className="text-xs font-semibold">Change</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <User className="w-16 h-16 text-neutral-400" />
                  )}
                </div>
                {isPhotoUploading ? (
                  <div className="w-full max-w-[200px] mx-auto bg-neutral-200 rounded-full h-1.5 mb-2 overflow-hidden">
                    <div className="bg-primary h-1.5 rounded-full animate-[progress_1s_ease-in-out_infinite] w-1/2"></div>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-outline text-sm">Upload Photo</button>
                )}
                <p className="text-xs text-neutral-500 mt-2">Max 2MB, JPG/PNG only</p>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/jpeg,image/png" onChange={handlePhotoUpload} />
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="label">Specimen Signature</label>
              <div className="border-2 border-dashed border-neutral-200 rounded-card p-8 text-center bg-neutral-50 relative group">
                <div className="w-full max-w-[240px] h-32 bg-white mx-auto mb-4 border border-neutral-200 rounded-md flex items-center justify-center relative overflow-hidden">
                  {signature ? (
                    <>
                      <Image src={signature} alt="Signature" fill className="object-contain p-2" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white" onClick={() => signatureInputRef.current?.click()}>
                        <div className="text-center">
                          <FileText className="w-6 h-6 mx-auto mb-1" />
                          <span className="text-xs font-semibold">Change</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <FileText className="w-10 h-10 text-neutral-300" />
                  )}
                </div>
                {isSigUploading ? (
                  <div className="w-full max-w-[200px] mx-auto bg-neutral-200 rounded-full h-1.5 mb-2 overflow-hidden">
                    <div className="bg-primary h-1.5 rounded-full animate-[progress_1s_ease-in-out_infinite] w-1/2"></div>
                  </div>
                ) : (
                  <button type="button" onClick={() => signatureInputRef.current?.click()} className="btn-outline text-sm">Upload Signature</button>
                )}
                <p className="text-xs text-neutral-500 mt-2">Max 1MB, JPG/PNG only</p>
                <input type="file" ref={signatureInputRef} className="hidden" accept="image/jpeg,image/png" onChange={handleSignatureUpload} />
              </div>
            </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-neutral-200">
        <h3 className="font-heading font-semibold text-lg text-primary flex items-center gap-2 pb-2">
            <FileText className="w-5 h-5" />
            Additional Documents
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-2">
          <DocumentUploadCard field="birthCertificateUrl" label="Birth Certificate" currentUrl={formData.birthCertificateUrl} onDocumentUpdate={onDocumentUpdate} showToast={showToast} />
          <DocumentUploadCard field="aadharCardUrl" label="Aadhar Card" currentUrl={formData.aadharCardUrl} onDocumentUpdate={onDocumentUpdate} showToast={showToast} />
          <DocumentUploadCard field="panCardUrl" label="PAN Card" currentUrl={formData.panCardUrl} onDocumentUpdate={onDocumentUpdate} showToast={showToast} />
          <DocumentUploadCard field="passportDocUrl" label="Passport" currentUrl={formData.passportDocUrl} onDocumentUpdate={onDocumentUpdate} showToast={showToast} />
          <DocumentUploadCard field="armsLicenseUrl" label="Arms License" currentUrl={formData.armsLicenseUrl} onDocumentUpdate={onDocumentUpdate} showToast={showToast} />
          <DocumentUploadCard field="affidavitUrl" label="Affidavit" currentUrl={formData.affidavitUrl} onDocumentUpdate={onDocumentUpdate} showToast={showToast} />
          <DocumentUploadCard field="ipcCardUrl" label="IPC Card" currentUrl={formData.ipcCardUrl} onDocumentUpdate={onDocumentUpdate} showToast={showToast} />
        </div>
      </div>

      {/* Classification Summary Card */}
      <div className="card bg-primary/5 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-card flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-primary">WSPS Classification:</span>
              <span className="font-heading font-bold text-lg text-accent">{formData.classification}</span>
            </div>
            <p className="text-sm text-neutral-600 mb-3">
              {classifications.find(c => c.code === formData.classification)?.description}
            </p>
            <div className="flex flex-wrap gap-4 text-xs">
              <span className="bg-white px-2 py-1 rounded border border-neutral-200 font-medium">Classified on: {formData.classificationDate || 'N/A'}</span>
              <span className="bg-white px-2 py-1 rounded border border-neutral-200 font-medium text-amber-600">Next Review: {formData.nextReviewDate || 'N/A'}</span>
            </div>
            <div className="mt-3">
              <button className="text-sm text-interactive font-medium hover:underline">
                Request Re-classification
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ShooterProfilePage = () => {
  const [activeTab, setActiveTab] = useState('personal')
  const [isEditing, setIsEditing] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastIdRef = useRef(0)
  
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = ++toastIdRef.current
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, type === 'error' ? 5000 : 3000)
  }

  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [profileStatus, setProfileStatus] = useState<string>('incomplete')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<ShooterProfileData>({
    firstName: user?.firstName || '',
    middleName: '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    nationality: 'Indian',
    placeOfBirth: '',
    maritalStatus: '',
    education: '',
    
    guardianName: '',
    guardianRelation: '',
    fatherName: '',
    motherName: '',
    spouseName: '',
    alternatePhone: '',
    placeOfWorkStudy: '',
    
    address: '',
    city: '',
    state: '',
    pincode: '',
    district: '',
    domicileState: '',
    
    aadharNumber: '',
    panNumber: '',
    
    passportNumber: '',
    passportIssue: '',
    passportExpiry: '',
    placeOfIssue: '',
    issuingAuthority: '',
    
    classification: '',
    classificationDate: '',
    nextReviewDate: '',
    psciId: '',
    pciId: '',
    category: '',
    membership: '',
    memberSince: '',
    eventType: '',
    sdmsNo: '',
    nsrsId: '',
    pciCardExpiry: '',

    triggerAdaptation: false,
    loader: false,
    wheelchair: false,
    loadingDevice: false,

    weight: '',
    shoeSize: '',
    trackSuitSize: '',
    tShirtSize: '',

    photoUrl: null,
    signatureUrl: null,
    birthCertificateUrl: null,
    aadharCardUrl: null,
    panCardUrl: null,
    passportDocUrl: null,
    armsLicenseUrl: null,
    affidavitUrl: null,
    ipcCardUrl: null,
  })

  useEffect(() => {
    async function fetchProfile() {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
        const res = await fetch(`${API_URL}/shooters/me`, {
          credentials: 'include'
        })
        if (res.ok) {
          const profileData = await res.json()
           const data = profileData.data || profileData
           if (data) {
             setProfileStatus(data.registration_status || 'incomplete')
             setFormData(prev => ({
               ...prev,
               // User account fields (from user relation)
               firstName: data.user?.first_name || data.user?.firstName || prev.firstName,
               lastName: data.user?.last_name || data.user?.lastName || prev.lastName,
               middleName: data.user?.middle_name || data.user?.middleName || data.middle_name || prev.middleName,
               phone: data.user?.phone || data.user?.phone_number || prev.phone,
               email: user?.email || data.user?.email || prev.email,
               // Personal
               dateOfBirth: data.date_of_birth ? String(data.date_of_birth).substring(0, 10) : prev.dateOfBirth,
               gender: data.gender || prev.gender,
               bloodGroup: data.blood_group || prev.bloodGroup,
               nationality: data.nationality || prev.nationality,
               placeOfBirth: data.place_of_birth || prev.placeOfBirth,
               maritalStatus: data.marital_status || prev.maritalStatus,
               // Sport profile
               eventType: data.event_type || prev.eventType,
               category: data.category || prev.category,
               pciId: data.pci_id || prev.pciId,
               sdmsNo: data.sdms_no || prev.sdmsNo,
               nsrsId: data.nsrs_id || prev.nsrsId,
               pciCardExpiry: data.pci_card_expiry || prev.pciCardExpiry,
               psciId: data.shooter_id || prev.psciId,
               memberSince: data.created_at ? String(data.created_at).substring(0, 10) : prev.memberSince,
               // Guardian / Parent
               guardianName: data.guardian_name || prev.guardianName,
               fatherName: data.father_name || prev.fatherName,
               motherName: data.mother_name || prev.motherName,
               spouseName: data.spouse_name || prev.spouseName,
               alternatePhone: data.alternate_phone || prev.alternatePhone,
               placeOfWorkStudy: data.place_of_work_study || prev.placeOfWorkStudy,
               // Address
               address: data.address || prev.address,
               city: data.city || prev.city,
               state: data.residential_state || prev.state,
               pincode: data.pincode || prev.pincode,
               district: data.district || prev.district,
               domicileState: data.domicile_state || prev.domicileState,
               // Identity
               aadharNumber: data.aadhar_no || prev.aadharNumber,
               panNumber: data.pan_no || prev.panNumber,
               // Passport
               passportNumber: data.passport_no || prev.passportNumber,
               passportIssue: data.passport_issue_date ? String(data.passport_issue_date).substring(0, 10) : prev.passportIssue,
               passportExpiry: data.passport_expiry_date ? String(data.passport_expiry_date).substring(0, 10) : prev.passportExpiry,
               placeOfIssue: data.passport_place_of_issue || prev.placeOfIssue,
               issuingAuthority: data.passport_issued_by || prev.issuingAuthority,
               // Equipment
               triggerAdaptation: data.trigger_adaptation ?? prev.triggerAdaptation,
               loader: data.loader ?? prev.loader,
               wheelchair: data.wheelchair ?? prev.wheelchair,
               loadingDevice: data.loading_device ?? prev.loadingDevice,
               weight: data.weight ? String(data.weight) : prev.weight,
               shoeSize: data.shoe_size ? String(data.shoe_size) : prev.shoeSize,
               trackSuitSize: data.track_suit_size || prev.trackSuitSize,
               tShirtSize: data.t_shirt_size || prev.tShirtSize,
               // Document URLs
               photoUrl: data.photo_url || prev.photoUrl,
               signatureUrl: data.signature_url || prev.signatureUrl,
               birthCertificateUrl: data.birth_certificate_url || prev.birthCertificateUrl,
               aadharCardUrl: data.aadhar_card_url || prev.aadharCardUrl,
               panCardUrl: data.pan_card_url || prev.panCardUrl,
               passportDocUrl: data.passport_doc_url || prev.passportDocUrl,
               armsLicenseUrl: data.arms_license_url || prev.armsLicenseUrl,
               affidavitUrl: data.affidavit_url || prev.affidavitUrl,
               ipcCardUrl: data.ipc_card_url || prev.ipcCardUrl,
             }))
           }
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [])

  // Calculate completion percentage — each profile section counts equally
  // 7 sections: personal basics, contact, parent/guardian, address, sport profile, photo, signature
  let completedSections = 0;

  // 1. Personal Basics (name, DOB, gender, blood group) — 15%
  if (formData.firstName && formData.lastName && formData.dateOfBirth && formData.gender) { completedSections += 15; }

  // 2. Contact info (phone, email) — 10%
  if (formData.phone && formData.email) { completedSections += 10; }

  // 3. Address details — 15%
  if (formData.address && formData.city && formData.state && formData.pincode) { completedSections += 15; }

  // 4. Parent/Guardian info — 10%
  if (formData.guardianName || formData.fatherName || formData.motherName) { completedSections += 10; }

  // 5. Sport profile (event type and category) — 15%
  if (formData.eventType && formData.category) { completedSections += 15; }

  // 6. Profile photo — 20%
  if (formData.photoUrl) { completedSections += 20; }

  // 7. Signature — 10%
  if (formData.signatureUrl) { completedSections += 10; }

  // 8. Any supporting document uploaded — 5% bonus
  if (formData.aadharCardUrl || formData.panCardUrl || formData.birthCertificateUrl || formData.passportDocUrl) { completedSections += 5; }

  const completionPercentage = completedSections > 100 ? 100 : completedSections;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleDocumentUpdate = (field: string, url: string) => {
    setFormData({ ...formData, [field]: url })
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked })
  }

  const { refreshUser } = useAuth()

  const handleSubmitProfile = async () => {
    if (!confirm('Are you sure you want to submit your profile for review? You won\'t be able to edit it until the admin reviews it.')) return
    try {
      setIsSubmitting(true)
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
      const res = await fetch(`${API_URL}/shooters/submit`, {
        method: 'POST',
        credentials: 'include',
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => null)
        throw new Error(errData?.message || 'Failed to submit profile')
      }
      setProfileStatus('pending')
      showToast('Profile submitted for review successfully!', 'success')
    } catch (err: any) {
      showToast(err.message || 'Error submitting profile', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSave = async (section: string) => {
    // Map formData to backend DTO
    const backendData = {
      date_of_birth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : undefined,
      gender: formData.gender || undefined,
      blood_group: formData.bloodGroup || undefined,
      nationality: formData.nationality,
      emergency_contact_name: formData.guardianName,
      emergency_contact_phone: formData.alternatePhone,
      event_type: formData.eventType,
      category: formData.category,
      pci_id: formData.pciId,
      // Pass other fields
      guardian_name: formData.guardianName,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      // Document URLs
      photo_url: formData.photoUrl,
      signature_url: formData.signatureUrl,
      birth_certificate_url: formData.birthCertificateUrl,
      aadhar_card_url: formData.aadharCardUrl,
      pan_card_url: formData.panCardUrl,
      passport_doc_url: formData.passportDocUrl,
      arms_license_url: formData.armsLicenseUrl,
      affidavit_url: formData.affidavitUrl,
      ipc_card_url: formData.ipcCardUrl,
    }

    try {
      setIsLoading(true)
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
      const res = await fetch(`${API_URL}/shooters/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(backendData)
      })

      if (!res.ok) {
        let errMsg = 'Failed to update profile';
        try {
          const errorData = await res.json();
          errMsg = errorData.message || errMsg;
          if (Array.isArray(errorData.message)) {
            errMsg = errorData.message.join(', ');
          }
        } catch (e) {}
        throw new Error(errMsg);
      }

      try {
        const updatedProfile = await res.json();
        const data = updatedProfile.data || updatedProfile;
        // Only update status from server response — never force 'pending' on a regular save
        if (data && data.registration_status && data.registration_status !== profileStatus) {
          setProfileStatus(data.registration_status);
        }
      } catch (e) {}

      setIsEditing(false)
      showToast(`${section.charAt(0).toUpperCase() + section.slice(1)} details updated successfully`, 'success')
      await refreshUser()
    } catch (err: any) {
      console.error(err)
      showToast(err.message || 'Error saving profile. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
  }

  const renderTabContent = () => {
      switch (activeTab) {
          case 'personal':
              return <PersonalTab formData={formData} handleChange={handleChange} handleCheckboxChange={handleCheckboxChange} isEditing={isEditing} onSave={handleSave} onCancel={cancelEdit} />;
          case 'guardian':
              return <GuardianTab formData={formData} handleChange={handleChange} handleCheckboxChange={handleCheckboxChange} isEditing={isEditing} onSave={handleSave} onCancel={cancelEdit} />;
          case 'address':
            return <AddressTab formData={formData} handleChange={handleChange} handleCheckboxChange={handleCheckboxChange} isEditing={isEditing} onSave={handleSave} onCancel={cancelEdit} />;
          case 'passport':
            return <PassportTab formData={formData} handleChange={handleChange} handleCheckboxChange={handleCheckboxChange} isEditing={isEditing} onSave={handleSave} onCancel={cancelEdit} />;
          case 'media':
            return <MediaTab formData={formData} onDocumentUpdate={handleDocumentUpdate} showToast={showToast} />;
          default:
              return null;
      }
  }

  return (
    <>
      <DashboardHeader
        title="Shooter Profile"
        subtitle="Manage your institutional records and personal details"
      />

      <div className="p-6 space-y-6">
        {/* Top Profile Card */}
        <div className="card">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative group cursor-pointer" onClick={() => setActiveTab('media')}>
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center border-4 border-white shadow-md overflow-hidden relative">
                {formData.photoUrl ? (
                  <Image src={formData.photoUrl} alt="Avatar" fill className="object-cover" />
                ) : (
                  <span className="text-3xl font-heading font-bold text-white">
                    {formData.firstName[0]}{formData.lastName[0]}
                  </span>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Camera className="w-6 h-6" />
                </div>
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-card border-2 border-white pointer-events-none">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 w-full relative">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h2 className="font-heading text-2xl font-bold text-primary">
                  {formData.firstName} {formData.lastName}
                </h2>
                <span className="badge-success relative group/badge cursor-help">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified Athlete
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-neutral-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/badge:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    Account verified by PCI admin
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-800"></div>
                  </div>
                </span>
              </div>
              <p className="text-neutral-500 flex items-center gap-2 text-sm mb-3">
                <Shield className="w-4 h-4" />
                NPSML ID: {formData.psciId} • Member since {formData.memberSince}
              </p>
              
              <div className="w-full max-w-lg">
                <div className="flex justify-between items-center text-xs font-semibold mb-1">
                  <span className="text-neutral-700">Profile Completion</span>
                  <span className="text-primary">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2 mb-1">
                  <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${completionPercentage}%` }}></div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 shrink-0 md:self-start mt-2 md:mt-0 flex-wrap">
              {isEditing ? (
                <button onClick={cancelEdit} className="btn-outline border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">
                  Cancel Editing
                </button>
              ) : profileStatus !== 'pending' && (
                <button type="button" onClick={() => setIsEditing(true)} className="btn-outline">
                  Edit Information
                </button>
              )}
              {profileStatus === 'incomplete' && (
                <button
                  onClick={handleSubmitProfile}
                  disabled={isSubmitting || completionPercentage < 100}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  title={completionPercentage < 100 ? `Complete all sections before submitting (${completionPercentage}% done)` : 'Submit profile for admin review'}
                >
                  {isSubmitting ? 'Submitting...' : '📋 Submit for Review'}
                </button>
              )}
              {profileStatus === 'pending' && (
                <span className="inline-flex items-center gap-1 px-4 py-2 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg text-sm font-medium">
                  ⏳ Pending Review
                </span>
              )}
              {profileStatus === 'approved' && (
                <span className="inline-flex items-center gap-1 px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium">
                  ✅ Approved
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 border-b border-neutral-200 pb-px hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (isEditing && activeTab !== tab.id && activeTab !== 'media') {
                  if(!confirm('You have unsaved changes. Change tab?')) return;
                  setIsEditing(false);
                }
                setActiveTab(tab.id)
              }}
              className={clsx(
                'flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all border-b-2 whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-neutral-500 hover:text-primary hover:bg-neutral-50'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className={clsx("card transition-all", isEditing ? "border-primary ring-1 ring-primary/20 shadow-md" : "")}>
          {renderTabContent()}
        </div>
      </div>
      
      {/* Toast Notification Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className={clsx(
            "pointer-events-auto flex items-start gap-3 p-4 rounded-card shadow-lg border-l-4 min-w-[300px] animate-fade-in bg-white",
            toast.type === 'success' ? "border-green-500" : toast.type === 'error' ? "border-red-500" : "border-primary"
          )}>
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" /> : 
             toast.type === 'error' ? <X className="w-5 h-5 text-red-500 mt-0.5" /> : 
             <Info className="w-5 h-5 text-primary mt-0.5" />}
            <div className="flex-1 text-sm font-medium text-neutral-800">{toast.message}</div>
            <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="text-neutral-400 hover:text-neutral-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </>
  )
}

export default ShooterProfilePage
