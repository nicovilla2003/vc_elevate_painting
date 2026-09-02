import { useEffect, useState } from 'react'
import { About } from './components/About'
import { EstimateForm } from './components/EstimateForm'
import { Footer } from './components/Footer'
import { GalleryCarousel } from './components/GalleryCarousel'
import { Hero } from './components/Hero'
import { Icon } from './components/Icon'
import { Navbar } from './components/Navbar'
import { Services } from './components/Services'
import { siteConfig } from './data/siteContent'

const observedSections = ['services', 'about', 'work', 'estimate']

function App() {
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    if (!window.location.hash) return
    const target = document.querySelector<HTMLElement>(window.location.hash)
    const previousBehavior = document.documentElement.style.scrollBehavior
    document.documentElement.style.scrollBehavior = 'auto'
    window.requestAnimationFrame(() => {
      target?.scrollIntoView({ block: 'start' })
      document.documentElement.style.scrollBehavior = previousBehavior
    })
  }, [])

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px' },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const sections = observedSections
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section))

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveSection(visible.target.id)
      },
      { rootMargin: '-30% 0px -55%', threshold: [0, 0.15, 0.4] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Navbar activeSection={activeSection} />
      <main id="main-content">
        <Hero />
        <Services />
        <About />
        <GalleryCarousel />
        <EstimateForm />
      </main>
      <Footer />
      <a className="mobile-call" href={siteConfig.phoneHref} aria-label={`Call ${siteConfig.businessName}`}>
        <Icon name="phone" size={19} />
        <span>Call for an estimate</span>
      </a>
    </>
  )
}

export default App
