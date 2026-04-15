import type { Metadata } from 'next'
import ShooterRegistrationForm from './ShooterRegistrationForm'

export const metadata: Metadata = {
  title: 'Shooter Registration',
  description: 'Register as a para shooter with the Para Shooting Committee of India (PSAI). Complete the multi-step registration form to join our competitive shooting programs.',
}

export default function RegistrationPage() {
  return <ShooterRegistrationForm />
}
