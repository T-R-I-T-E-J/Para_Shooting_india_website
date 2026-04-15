export interface DocumentItem {
  id: string
  title: string
  description?: string
  category: 'classification' | 'medical_classification' | 'ipc_license' | 'national_classification' | string
  fileType?: string
  size?: string
  href: string
  updatedAt: string
  isActive: boolean
}

export const DUMMY_DOCUMENTS: DocumentItem[] = [
  {
    id: '1',
    title: 'WSPS International Classification Rules 2025 Edition',
    description: 'Official World Shooting Para Sport classification rules and criteria.',
    category: 'classification',
    fileType: 'PDF',
    size: '1.2 MB',
    href: '#',
    updatedAt: '2025-11-01T00:00:00Z',
    isActive: true,
  },
  {
    id: '2',
    title: 'Medical Evidence Form — Upper Limb Impairment',
    description: 'Required medical documentation for SH1 classification.',
    category: 'medical_classification',
    fileType: 'PDF',
    size: '0.45 MB',
    href: '#',
    updatedAt: '2025-10-15T00:00:00Z',
    isActive: true,
  },
  {
    id: '3',
    title: 'IPC Licence Application 2026',
    description: 'Application form for IPC athlete licence renewal.',
    category: 'ipc_license',
    fileType: 'PDF',
    size: '0.32 MB',
    href: '#',
    updatedAt: '2026-01-05T00:00:00Z',
    isActive: true,
  },
  {
    id: '4',
    title: 'National Classification Master Roster Q1 2026',
    description: 'Updated national roster of classified para shooting athletes.',
    category: 'national_classification',
    fileType: 'XLSX',
    size: '0.18 MB',
    href: '#',
    updatedAt: '2026-01-20T00:00:00Z',
    isActive: true,
  },
  {
    id: '5',
    title: 'Classification Appeals Procedure Guidelines',
    description: 'Step-by-step guide for filing a classification appeal.',
    category: 'classification',
    fileType: 'PDF',
    size: '0.28 MB',
    href: '#',
    updatedAt: '2025-09-12T00:00:00Z',
    isActive: true,
  },
  {
    id: '6',
    title: 'Medical Evidence Form — Lower Limb Impairment',
    description: 'Required medical documentation for SH2 classification.',
    category: 'medical_classification',
    fileType: 'PDF',
    size: '0.41 MB',
    href: '#',
    updatedAt: '2025-08-30T00:00:00Z',
    isActive: true,
  },
  {
    id: '7',
    title: 'IPC Anti-Doping & Whereabouts Obligations',
    description: 'Mandatory document outlining IPC anti-doping requirements.',
    category: 'ipc_license',
    fileType: 'PDF',
    size: '0.55 MB',
    href: '#',
    updatedAt: '2025-12-10T00:00:00Z',
    isActive: true,
  },
  {
    id: '8',
    title: 'Para Shooting India — National Classification Policy 2025',
    description: 'Domestic classification policy and procedures for national events.',
    category: 'national_classification',
    fileType: 'PDF',
    size: '0.76 MB',
    href: '#',
    updatedAt: '2025-07-01T00:00:00Z',
    isActive: true,
  },
  {
    id: '9',
    title: 'Functional Classification Overview — SH1 & SH2',
    description: 'Summary of functional classification criteria for shooters.',
    category: 'classification',
    fileType: 'PDF',
    size: '0.10 MB',
    href: '#',
    updatedAt: '2026-02-14T00:00:00Z',
    isActive: true,
  },
  {
    id: '10',
    title: 'Medical Evidence Form — Vision Impairment',
    description: 'Documentation requirements for visually impaired shooters.',
    category: 'medical_classification',
    fileType: 'PDF',
    size: '0.38 MB',
    href: '#',
    updatedAt: '2025-06-05T00:00:00Z',
    isActive: true,
  },
]

export const DOC_CATEGORY_META: Record<string, { label: string; color: string }> = {
  classification: { label: 'Classification', color: '#FF671F' },
  medical_classification: { label: 'Medical', color: '#DC2626' },
  national_classification: { label: 'Natl. Class.', color: '#7C3AED' },
  ipc_license: { label: 'IPC License', color: '#0891B2' },
}

export const DEFAULT_DOC_META = { label: 'Document', color: '#C8A415' }
