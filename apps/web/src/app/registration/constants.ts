// ===== PSAI Shooter Registration Constants =====

export const STEPS = [
  { num: 1, label: 'Personal' },
  { num: 2, label: 'Family' },
  { num: 3, label: 'Address' },
  { num: 4, label: 'Sport' },
  { num: 5, label: 'Sizing' },
  { num: 6, label: 'Review' },
]

export const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu',
  'Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  // Union Territories
  'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu',
  'Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry',
]

export const MARITAL_STATUS = ['Single', 'Married', 'Divorced', 'Widowed']

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

export const CLASSIFICATION_ROWS = [
  ['SH1', 'SH2', 'SH-VI'],
  ['SH1 A', 'SH2 A'],
  ['SH1 B', 'SH2 B'],
  ['SH1 C', 'SH2 C'],
  ['SH2 Aa', 'SH2 Ba', 'SH2 Ca'],
  ['SH2 Ab', 'SH2 Bb', 'SH2 Cb'],
]

export const EQUIPMENT_TOGGLES = [
  { key: 'triggerAdaptation', label: 'Trigger Adaptation' },
  { key: 'loader', label: 'Loader' },
  { key: 'wheelchair', label: 'Wheelchair' },
  { key: 'loadingDevice', label: 'Loading Device' },
] as const

export const DOCUMENTS = [
  { key: 'passportPhoto', name: 'Passport Size Photo', required: true, maxMB: 1, imageOnly: true },
  { key: 'birthCertificate', name: 'Birth Certificate', required: false, maxMB: 5, imageOnly: false },
  { key: 'aadharCard', name: 'Aadhar Card', required: true, maxMB: 5, imageOnly: false },
  { key: 'panCard', name: 'PAN Card', required: false, maxMB: 5, imageOnly: false },
  { key: 'passport', name: 'Passport', required: false, maxMB: 5, imageOnly: false },
  { key: 'armsLicense', name: 'Arms License', required: false, maxMB: 5, imageOnly: false },
  { key: 'affidavit', name: 'Affidavit', required: false, maxMB: 5, imageOnly: false },
  { key: 'ipcCard', name: 'IPC Card', required: false, maxMB: 5, imageOnly: false },
] as const

export type EquipmentKey = typeof EQUIPMENT_TOGGLES[number]['key']
export type DocumentKey = typeof DOCUMENTS[number]['key']

export interface FormData {
  // Step 1
  firstName: string
  middleName: string
  surname: string
  dob: string
  gender: string
  placeOfBirth: string
  nationality: string
  maritalStatus: string
  // Step 2
  fatherName: string
  motherName: string
  spouseName: string
  contactNo: string
  altContactNo: string
  placeOfWork: string
  // Step 3
  residentialState: string
  residentialCity: string
  residentialDistrict: string
  domicileState: string
  address: string
  pincode: string
  aadharNo: string
  panNo: string
  passportNo: string
  passportIssueDate: string
  passportExpiryDate: string
  passportAuthority: string
  placeOfIssue: string
  // Step 4
  eventType: string
  education: string
  pciCardExpiry: string
  nsrsId: string
  sdmsNo: string
  paraClassification: string
  triggerAdaptation: boolean
  loader: boolean
  wheelchair: boolean
  loadingDevice: boolean
  // Step 5
  weight: string
  shoeSize: string
  trackSuitSize: string
  tshirtSize: string
  // Documents stored as file names
  [key: string]: string | boolean | File | null | undefined
}

export const INITIAL_FORM_DATA: FormData = {
  firstName: '', middleName: '', surname: '', dob: '', gender: '',
  placeOfBirth: '', nationality: 'Indian', maritalStatus: '',
  fatherName: '', motherName: '', spouseName: '', contactNo: '',
  altContactNo: '', placeOfWork: '',
  residentialState: '', residentialCity: '', residentialDistrict: '',
  domicileState: '', address: '', pincode: '', aadharNo: '', panNo: '',
  passportNo: '', passportIssueDate: '', passportExpiryDate: '',
  passportAuthority: '', placeOfIssue: '',
  eventType: '', education: '', pciCardExpiry: '', nsrsId: '', sdmsNo: '',
  paraClassification: '',
  triggerAdaptation: false, loader: false, wheelchair: false, loadingDevice: false,
  weight: '', shoeSize: '', trackSuitSize: '', tshirtSize: '',
}

// Validation helpers
export function formatAadhar(val: string): string {
  const digits = val.replace(/\D/g, '').slice(0, 12)
  const parts = [digits.slice(0, 4), digits.slice(4, 8), digits.slice(8, 12)]
  return parts.filter(Boolean).join('-')
}

export function formatPAN(val: string): string {
  return val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)
}

export function formatPhone(val: string): string {
  return val.replace(/\D/g, '').slice(0, 10)
}

export function formatPincode(val: string): string {
  return val.replace(/\D/g, '').slice(0, 6)
}

export function validatePAN(val: string): boolean {
  return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(val)
}

export function validatePhone(val: string): boolean {
  return /^\d{10}$/.test(val)
}

export function validateAadhar(val: string): boolean {
  return val.replace(/\D/g, '').length === 12
}

export function validatePincode(val: string): boolean {
  return /^\d{6}$/.test(val)
}

export interface StepErrors {
  [key: string]: string
}

export function validateStep(step: number, data: FormData, files: Record<string, File | null>): StepErrors {
  const errors: StepErrors = {}

  if (step === 1) {
    if (!data.firstName.trim()) errors.firstName = 'First name is required'
    if (!data.surname.trim()) errors.surname = 'Surname is required'
    if (!data.dob) errors.dob = 'Date of birth is required'
    if (!data.gender) errors.gender = 'Please select gender'
  }

  if (step === 2) {
    if (!data.contactNo.trim()) errors.contactNo = 'Contact number is required'
    else if (!validatePhone(data.contactNo)) errors.contactNo = 'Enter valid 10-digit number'
    if (data.altContactNo && !validatePhone(data.altContactNo)) errors.altContactNo = 'Enter valid 10-digit number'
  }

  if (step === 3) {
    if (data.aadharNo && !validateAadhar(data.aadharNo)) errors.aadharNo = 'Enter valid 12-digit Aadhar'
    if (data.panNo && !validatePAN(data.panNo)) errors.panNo = 'Invalid PAN format (e.g. AAAAA9999A)'
    if (data.pincode && !validatePincode(data.pincode)) errors.pincode = 'Enter valid 6-digit pincode'
  }

  if (step === 4) {
    if (!data.paraClassification) errors.paraClassification = 'Select a para classification'
  }

  if (step === 5) {
    if (!files.passportPhoto) errors.passportPhoto = 'Passport photo is required'
    if (!files.aadharCard) errors.aadharCard = 'Aadhar card document is required'
  }

  return errors
}
