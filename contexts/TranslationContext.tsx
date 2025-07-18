import React, { createContext, useContext, ReactNode } from 'react';
import { Language } from '@/types';
import { useAppContext } from './AppContext';

interface Translations {
  [key: string]: {
    sq: string;
    en: string;
    de: string;
  };
}

const translations: Translations = {
  // Navigation
  home: { sq: 'Ballina', en: 'Home', de: 'Startseite' },
  addListing: { sq: 'Shto Listim', en: 'Add Listing', de: 'Anzeige hinzufügen' },
  dealers: { sq: 'Shitësit', en: 'Dealers', de: 'Händler' },
  favorites: { sq: 'Të preferuarat', en: 'Favorites', de: 'Favoriten' },
  profile: { sq: 'Profili', en: 'Profile', de: 'Profil' },
  
  // Categories
  cars: { sq: 'Makina', en: 'Cars', de: 'Autos' },
  car: { sq: 'Makinë', en: 'Car', de: 'Auto' },
  motorcycles: { sq: 'Motorë', en: 'Motorcycles', de: 'Motorräder' },
  motorcycle: { sq: 'Motor', en: 'Motorcycle', de: 'Motorrad' },
  trucks: { sq: 'Kamionë', en: 'Trucks', de: 'LKWs' },
  truck: { sq: 'Kamion', en: 'Truck', de: 'LKW' },
  largeVehicles: { sq: 'Automjete të Mëdha', en: 'Large Vehicles', de: 'Große Fahrzeuge' },
  'large-vehicle': { sq: 'Automjet i Madh', en: 'Large Vehicle', de: 'Großes Fahrzeug' },
  
  // Search & Filter
  search: { sq: 'Kërko', en: 'Search', de: 'Suchen' },
  searchPlaceholder: { sq: 'Kërko makina, motorë...', en: 'Search cars, motorcycles...', de: 'Autos, Motorräder suchen...' },
  filters: { sq: 'Filtrat', en: 'Filters', de: 'Filter' },
  price: { sq: 'Cmimi', en: 'Price', de: 'Preis' },
  year: { sq: 'Viti', en: 'Year', de: 'Jahr' },
  mileage: { sq: 'Kilometrazhi', en: 'Mileage', de: 'Kilometerstand' },
  condition: { sq: 'Gjendja', en: 'Condition', de: 'Zustand' },
  fuelType: { sq: 'Lloji i Karburantit', en: 'Fuel Type', de: 'Kraftstoffart' },
  transmission: { sq: 'Transmisioni', en: 'Transmission', de: 'Getriebe' },
  location: { sq: 'Vendndodhja', en: 'Location', de: 'Standort' },
  
  // Vehicle conditions
  new: { sq: 'I ri', en: 'New', de: 'Neu' },
  used: { sq: 'I përdorur', en: 'Used', de: 'Gebraucht' },
  damaged: { sq: 'I dëmtuar', en: 'Damaged', de: 'Beschädigt' },
  
  // Fuel types
  gasoline: { sq: 'Benzinë', en: 'Gasoline', de: 'Benzin' },
  diesel: { sq: 'Dizel', en: 'Diesel', de: 'Diesel' },
  electric: { sq: 'Elektrik', en: 'Electric', de: 'Elektrisch' },
  hybrid: { sq: 'Hibrid', en: 'Hybrid', de: 'Hybrid' },
  lpg: { sq: 'LPG', en: 'LPG', de: 'LPG' },
  cng: { sq: 'CNG', en: 'CNG', de: 'CNG' },
  
  // Transmission types
  manual: { sq: 'Manual', en: 'Manual', de: 'Schaltgetriebe' },
  automatic: { sq: 'Automatik', en: 'Automatic', de: 'Automatik' },
  cvt: { sq: 'CVT', en: 'CVT', de: 'CVT' },
  
  // Common actions
  login: { sq: 'Hyrje', en: 'Login', de: 'Anmelden' },
  register: { sq: 'Regjistrohu', en: 'Register', de: 'Registrieren' },
  logout: { sq: 'Dalje', en: 'Logout', de: 'Abmelden' },
  save: { sq: 'Ruaj', en: 'Save', de: 'Speichern' },
  cancel: { sq: 'Anulo', en: 'Cancel', de: 'Abbrechen' },
  delete: { sq: 'Fshij', en: 'Delete', de: 'Löschen' },
  edit: { sq: 'Ndrysho', en: 'Edit', de: 'Bearbeiten' },
  contact: { sq: 'Kontakto', en: 'Contact', de: 'Kontakt' },
  call: { sq: 'Telefono', en: 'Call', de: 'Anrufen' },
  message: { sq: 'Mesazh', en: 'Message', de: 'Nachricht' },
  viewDetails: { sq: 'Shih Detajet', en: 'View Details', de: 'Details anzeigen' },
  back: { sq: 'Kthehu', en: 'Back', de: 'Zurück' },
  
  // Vehicle listing
  title: { sq: 'Titulli', en: 'Title', de: 'Titel' },
  description: { sq: 'Përshkrimi', en: 'Description', de: 'Beschreibung' },
  make: { sq: 'Marka', en: 'Make', de: 'Marke' },
  model: { sq: 'Modeli', en: 'Model', de: 'Modell' },
  features: { sq: 'Karakteristikat', en: 'Features', de: 'Ausstattung' },
  photos: { sq: 'Fotot', en: 'Photos', de: 'Fotos' },
  
  // Profile
  firstName: { sq: 'Emri', en: 'First Name', de: 'Vorname' },
  lastName: { sq: 'Mbiemri', en: 'Last Name', de: 'Nachname' },
  email: { sq: 'Email', en: 'Email', de: 'E-Mail' },
  phone: { sq: 'Telefoni', en: 'Phone', de: 'Telefon' },
  
  // Favorites
  noFavorites: { sq: 'Nuk ka të preferuara', en: 'No favorites', de: 'Keine Favoriten' },
  addedToFavorites: { sq: 'U shtua në të preferuarat', en: 'Added to favorites', de: 'Zu Favoriten hinzugefügt' },
  removedFromFavorites: { sq: 'U hoq nga të preferuarat', en: 'Removed from favorites', de: 'Aus Favoriten entfernt' },
  
  // General
  loading: { sq: 'Duke ngarkuar...', en: 'Loading...', de: 'Wird geladen...' },
  error: { sq: 'Gabim', en: 'Error', de: 'Fehler' },
  success: { sq: 'Sukses', en: 'Success', de: 'Erfolg' },
  noResults: { sq: 'Nuk ka rezultate', en: 'No results', de: 'Keine Ergebnisse' },
  viewAll: { sq: 'Shih të gjitha', en: 'View All', de: 'Alle anzeigen' },
  currency: { sq: '€', en: '€', de: '€' },
  
  // Auth - Login
  welcomeBack: { sq: 'Mirë se erdhe përsëri', en: 'Welcome Back', de: 'Willkommen zurück' },
  signInToAccount: { sq: 'Hyr në llogarinë tënde Autotregi', en: 'Sign in to your Autotregi account', de: 'Melden Sie sich bei Ihrem Autotregi-Konto an' },
  emailAddress: { sq: 'Adresa e Email-it', en: 'Email Address', de: 'E-Mail-Adresse' },
  enterEmail: { sq: 'Shkruaj email-in tënd', en: 'Enter your email', de: 'Geben Sie Ihre E-Mail ein' },
  password: { sq: 'Fjalëkalimi', en: 'Password', de: 'Passwort' },
  enterPassword: { sq: 'Shkruaj fjalëkalimin tënd', en: 'Enter your password', de: 'Geben Sie Ihr Passwort ein' },
  forgotPassword: { sq: 'Harrove fjalëkalimin?', en: 'Forgot your password?', de: 'Passwort vergessen?' },
  signIn: { sq: 'Hyr', en: 'Sign In', de: 'Anmelden' },
  signingIn: { sq: 'Duke u kyçur...', en: 'Signing in...', de: 'Anmeldung läuft...' },
  continueWithGoogle: { sq: 'Vazhdo me Google', en: 'Continue with Google', de: 'Mit Google fortfahren' },
  continueWithApple: { sq: 'Vazhdo me Apple', en: 'Continue with Apple', de: 'Mit Apple fortfahren' },
  dontHaveAccount: { sq: 'Nuk ke llogari?', en: "Don't have an account?", de: 'Haben Sie kein Konto?' },
  signUp: { sq: 'Regjistrohu', en: 'Sign up', de: 'Registrieren' },
  
  // Auth - Register
  createAccount: { sq: 'Krijo Llogari', en: 'Create Account', de: 'Konto erstellen' },
  joinAutotregi: { sq: 'Bashkohu me Autotregi dhe fillo të blesh ose shitësh automjete', en: 'Join Autotregi and start buying or selling vehicles', de: 'Treten Sie Autotregi bei und beginnen Sie mit dem Kauf oder Verkauf von Fahrzeugen' },
  accountType: { sq: 'Lloji i Llogarisë', en: 'Account Type', de: 'Kontotyp' },
  individual: { sq: 'Individual', en: 'Individual', de: 'Privat' },
  business: { sq: 'Biznes', en: 'Business', de: 'Geschäft' },
  companyName: { sq: 'Emri i Kompanisë', en: 'Company Name', de: 'Firmenname' },
  enterCompanyName: { sq: 'Shkruaj emrin e kompanisë', en: 'Enter company name', de: 'Geben Sie den Firmennamen ein' },
  phoneNumber: { sq: 'Numri i Telefonit', en: 'Phone Number', de: 'Telefonnummer' },
  country: { sq: 'Shteti', en: 'Country', de: 'Land' },
  city: { sq: 'Qyteti', en: 'City', de: 'Stadt' },
  confirmPassword: { sq: 'Konfirmo Fjalëkalimin', en: 'Confirm Password', de: 'Passwort bestätigen' },
  confirmYourPassword: { sq: 'Konfirmo fjalëkalimin tënd', en: 'Confirm your password', de: 'Bestätigen Sie Ihr Passwort' },
  createStrongPassword: { sq: 'Krijo një fjalëkalim të fortë', en: 'Create a strong password', de: 'Erstellen Sie ein starkes Passwort' },
  subscribeNewsletter: { sq: 'Abonohu në newsletter për përditësime dhe oferta', en: 'Subscribe to newsletter for updates and offers', de: 'Newsletter für Updates und Angebote abonnieren' },
  agreeToTerms: { sq: 'Duke krijuar një llogari, ju pranoni', en: 'By creating an account, you agree to our', de: 'Durch die Erstellung eines Kontos stimmen Sie unseren' },
  termsOfService: { sq: 'Kushtet e Shërbimit', en: 'Terms of Service', de: 'Nutzungsbedingungen' },
  and: { sq: 'dhe', en: 'and', de: 'und' },
  privacyPolicy: { sq: 'Politikën e Privatësisë', en: 'Privacy Policy', de: 'Datenschutzrichtlinie' },
  creatingAccount: { sq: 'Duke krijuar llogarinë...', en: 'Creating Account...', de: 'Konto wird erstellt...' },
  alreadyHaveAccount: { sq: 'Ke tashmë një llogari?', en: 'Already have an account?', de: 'Haben Sie bereits ein Konto?' },
  
  // Validation messages
  emailRequired: { sq: 'Email-i është i detyrueshëm', en: 'Email is required', de: 'E-Mail ist erforderlich' },
  validEmailRequired: { sq: 'Ju lutem shkruani një email të vlefshëm', en: 'Please enter a valid email address', de: 'Bitte geben Sie eine gültige E-Mail-Adresse ein' },
  passwordRequired: { sq: 'Fjalëkalimi është i detyrueshëm', en: 'Password is required', de: 'Passwort ist erforderlich' },
  passwordMinLength: { sq: 'Fjalëkalimi duhet të ketë të paktën 6 karaktere', en: 'Password must be at least 6 characters', de: 'Passwort muss mindestens 6 Zeichen haben' },
  passwordMinLengthRegister: { sq: 'Fjalëkalimi duhet të ketë të paktën 8 karaktere', en: 'Password must be at least 8 characters', de: 'Passwort muss mindestens 8 Zeichen haben' },
  passwordComplexity: { sq: 'Fjalëkalimi duhet të përmbajë shkronja të mëdha, të vogla dhe numra', en: 'Password must contain uppercase, lowercase, and number', de: 'Passwort muss Groß-, Kleinbuchstaben und Zahlen enthalten' },
  confirmPasswordRequired: { sq: 'Ju lutem konfirmoni fjalëkalimin tuaj', en: 'Please confirm your password', de: 'Bitte bestätigen Sie Ihr Passwort' },
  passwordsDoNotMatch: { sq: 'Fjalëkalimet nuk përputhen', en: 'Passwords do not match', de: 'Passwörter stimmen nicht überein' },
  firstNameRequired: { sq: 'Emri është i detyrueshëm', en: 'First name is required', de: 'Vorname ist erforderlich' },
  lastNameRequired: { sq: 'Mbiemri është i detyrueshëm', en: 'Last name is required', de: 'Nachname ist erforderlich' },
  companyNameRequired: { sq: 'Emri i kompanisë është i detyrueshëm', en: 'Company name is required', de: 'Firmenname ist erforderlich' },
  phoneRequired: { sq: 'Numri i telefonit është i detyrueshëm', en: 'Phone number is required', de: 'Telefonnummer ist erforderlich' },
  validPhoneRequired: { sq: 'Ju lutem shkruani një numër telefoni të vlefshëm', en: 'Please enter a valid phone number', de: 'Bitte geben Sie eine gültige Telefonnummer ein' },
  cityRequired: { sq: 'Qyteti është i detyrueshëm', en: 'City is required', de: 'Stadt ist erforderlich' },
  invalidCredentials: { sq: 'Email ose fjalëkalim i gabuar. Ju lutem provoni përsëri.', en: 'Invalid email or password. Please try again.', de: 'Ungültige E-Mail oder Passwort. Bitte versuchen Sie es erneut.' },
  registrationFailed: { sq: 'Regjistrimi dështoi. Ju lutem provoni përsëri.', en: 'Registration failed. Please try again.', de: 'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.' },
  
  // Placeholders
  firstNamePlaceholder: { sq: 'Emri', en: 'First name', de: 'Vorname' },
  lastNamePlaceholder: { sq: 'Mbiemri', en: 'Last name', de: 'Nachname' },
  phonePlaceholder: { sq: '+355 69 123 4567', en: '+355 69 123 4567', de: '+355 69 123 4567' },
  countryPlaceholder: { sq: 'Shteti', en: 'Country', de: 'Land' },
  cityPlaceholder: { sq: 'Qyteti', en: 'City', de: 'Stadt' },
  or: { sq: 'ose', en: 'or', de: 'oder' },
  to: { sq: 'në', en: 'to', de: 'zu' },

  // Seller Detail Page
  dealer: { sq: 'Shitës', en: 'Dealer', de: 'Händler' },
  dealership: { sq: 'Shitore', en: 'Dealership', de: 'Autohaus' },
  viewDealership: { sq: 'Shiko Shitoren', en: 'View Dealership', de: 'Autohaus anzeigen' },
  contactDealer: { sq: 'Kontakto Shitësin', en: 'Contact Dealer', de: 'Händler kontaktieren' },
  dealerListings: { sq: 'Listimet e Shitësit', en: 'Dealer Listings', de: 'Händler-Anzeigen' },
  totalCars: { sq: 'Totali i Makinave', en: 'Total Cars', de: 'Gesamtfahrzeuge' },
  yearsInBusiness: { sq: 'Vite në Biznes', en: 'Years in Business', de: 'Jahre im Geschäft' },
  specializes: { sq: 'Specializohet në', en: 'Specializes in', de: 'Spezialisiert auf' },
  workingHours: { sq: 'Orari i Punës', en: 'Working Hours', de: 'Arbeitszeiten' },
  website: { sq: 'Faqja Web', en: 'Website', de: 'Webseite' },
  noDealers: { sq: 'Nuk ka shitës', en: 'No dealers found', de: 'Keine Händler gefunden' },
  searchDealers: { sq: 'Kërko shitës...', en: 'Search dealers...', de: 'Händler suchen...' },
  sellerProfile: { sq: 'Profili i Shitësit', en: 'Seller Profile', de: 'Verkäuferprofil' },
  sellerNotFound: { sq: 'Shitësi nuk u gjet', en: 'Seller not found', de: 'Verkäufer nicht gefunden' },
  memberSince: { sq: 'Anëtar që nga', en: 'Member since', de: 'Mitglied seit' },
  responseTime: { sq: 'Koha e përgjigjes', en: 'Response time', de: 'Antwortzeit' },
  activeListings: { sq: 'Listime aktive', en: 'Active listings', de: 'Aktive Anzeigen' },
  listings: { sq: 'Listime', en: 'Listings', de: 'Anzeigen' },
  reviews: { sq: 'Vlerësime', en: 'Reviews', de: 'Bewertungen' },
  noActiveListings: { sq: 'Nuk ka listime aktive', en: 'No active listings', de: 'Keine aktiven Anzeigen' },
  sellerHasNoListings: { sq: 'Ky shitës nuk ka listime aktive në këtë moment', en: 'This seller has no active listings at the moment', de: 'Dieser Verkäufer hat derzeit keine aktiven Anzeigen' },
  noReviews: { sq: 'Nuk ka vlerësime', en: 'No reviews', de: 'Keine Bewertungen' },
  sellerHasNoReviews: { sq: 'Ky shitës nuk ka vlerësime ende', en: 'This seller has no reviews yet', de: 'Dieser Verkäufer hat noch keine Bewertungen' },
  unableToCall: { sq: 'Nuk mund të telefonoj', en: 'Unable to call', de: 'Anruf nicht möglich' },
  messageFeatureComingSoon: { sq: 'Funksioni i mesazheve do të jetë i disponueshëm së shpejti', en: 'Messaging feature coming soon', de: 'Nachrichtenfunktion kommt bald' },
};

interface TranslationContextType {
  t: (key: string) => string;
  language: Language;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { state } = useAppContext();
  
  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[state.language] || translation.en || key;
  };

  return (
    <TranslationContext.Provider value={{ t, language: state.language }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};