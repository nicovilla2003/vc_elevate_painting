export type IconName =
  | 'arrow'
  | 'building'
  | 'check'
  | 'chevronLeft'
  | 'chevronRight'
  | 'clock'
  | 'close'
  | 'commercial'
  | 'detail'
  | 'exterior'
  | 'home'
  | 'instagram'
  | 'interior'
  | 'mail'
  | 'menu'
  | 'pause'
  | 'phone'
  | 'pin'
  | 'play'
  | 'shield'
  | 'spark'

export const siteConfig = {
  businessName: 'VC Elevate Painting',
  owner: 'Juan M. Villaquiran Negret',
  phoneDisplay: '(760) 440-4389',
  phoneHref: 'tel:+17604404389',
  email: 'juanm.villaquiran@gmail.com',
  emailHref: 'mailto:juanm.villaquiran@gmail.com',
  instagram: '@vc_elevatepainting',
  instagramHref: 'https://www.instagram.com/vc_elevatepainting/',
  serviceArea: 'San Diego & surrounding areas',
  tagline: 'Elevating Spaces. Building Trust.',
} as const

export const navigation = [
  { label: 'Services', href: '#services' },
  { label: 'Why Us', href: '#about' },
  { label: 'Our Work', href: '#work' },
  { label: 'Estimate', href: '#estimate' },
]

export const trustPoints: { title: string; detail: string; icon: IconName }[] = [
  { title: 'Reliable Service', detail: 'Clear from first call to final review', icon: 'shield' },
  { title: 'High-Rise Experience', detail: 'Capability built for every elevation', icon: 'building' },
  { title: 'Premium Finishes', detail: 'Meticulous edges and lasting results', icon: 'spark' },
]

export const primaryServices = [
  {
    number: '01',
    title: 'Exterior Painting',
    description:
      'Crisp, durable exterior finishes built to protect San Diego properties and sharpen every architectural line.',
    image: '/assets/project-residential.webp',
    imageAlt: 'Freshly painted white residential exterior with dark architectural trim',
    items: ['Homes & buildings', 'Multi-story properties', 'Surface preparation', 'Long-lasting protection'],
    href: '#estimate',
  },
  {
    number: '02',
    title: 'Interior Painting',
    description:
      'Refined interior work that brings calm, character, and precision to the spaces where life and business happen.',
    image: '/assets/project-interior.webp',
    imageAlt: 'Modern living room with crisp white walls and a deep navy built-in accent wall',
    items: ['Homes & apartments', 'Offices & retail', 'Walls, ceilings & trim', 'Detailed finishes'],
    href: '#estimate',
  },
]

export const projectTypes: { title: string; description: string; icon: IconName }[] = [
  {
    title: 'Residential',
    description: 'Thoughtful transformations for homes, apartments, and shared living spaces.',
    icon: 'home',
  },
  {
    title: 'Commercial',
    description: 'Professional finishes for offices, retail, common areas, and active properties.',
    icon: 'commercial',
  },
  {
    title: 'High-Rise',
    description: 'Experienced execution for complex, multi-story environments and bold elevations.',
    icon: 'building',
  },
]

export const values = [
  { number: '01', title: 'Finesse', description: 'Attention lives in the line work, the preparation, and every final detail.' },
  { number: '02', title: 'Integrity', description: 'Clear communication and a commitment to doing what we say we will do.' },
  { number: '03', title: 'Artistry', description: 'Every surface is treated as part of a larger, more considered space.' },
  { number: '04', title: 'Transformation', description: 'A finish should change how a place feels—not simply change its color.' },
]

export const processSteps = [
  { number: '01', title: 'Walkthrough', description: 'We listen, inspect, and define the right scope.' },
  { number: '02', title: 'Preparation', description: 'Surfaces are protected, repaired, and made ready.' },
  { number: '03', title: 'Craftsmanship', description: 'Every coat and edge is handled with discipline.' },
  { number: '04', title: 'Final Review', description: 'We walk the work and leave the space ready.' },
]

export const galleryItems = [
  {
    title: 'Coastal Elevation',
    category: 'High-Rise Exterior',
    location: 'San Diego, CA',
    image: '/assets/hero-high-rise.webp',
    alt: 'Modern high-rise with deep navy and white exterior finishes against a coastal blue sky',
    description: 'Sharp contrast and a clean architectural finish designed to stand up at scale.',
  },
  {
    title: 'Crisp Curb Appeal',
    category: 'Residential Exterior',
    location: 'San Diego County, CA',
    image: '/assets/project-residential.webp',
    alt: 'Freshly painted Spanish-style home with white stucco and charcoal trim',
    description: 'Warm white stucco, precise charcoal trim, and a polished entry that feels completely renewed.',
  },
  {
    title: 'The Navy Room',
    category: 'Residential Interior',
    location: 'San Diego, CA',
    image: '/assets/project-interior.webp',
    alt: 'Bright living room with flawless white walls and deep navy built-in cabinetry',
    description: 'An exacting interior palette that pairs soft light with a deep, confident focal wall.',
  },
  {
    title: 'Precision at Scale',
    category: 'Commercial Exterior',
    location: 'San Diego, CA',
    image: '/assets/project-commercial.webp',
    alt: 'Professional painter on a secured lift applying a deep blue finish to a commercial facade',
    description: 'Careful surface work, professional access, and consistent color across a complex facade.',
  },
]

export const serviceOptions = [
  'Exterior painting',
  'Interior painting',
  'Residential project',
  'Commercial project',
  'High-rise project',
  'Surface preparation / finishes',
  'Not sure yet',
]
