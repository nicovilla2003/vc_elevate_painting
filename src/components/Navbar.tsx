import { useEffect, useState } from 'react'
import { navigation, siteConfig } from '../data/siteContent'
import { Brand } from './Brand'
import { Icon } from './Icon'

type NavbarProps = {
  activeSection: string
}

export function Navbar({ activeSection }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', isOpen)
    return () => document.body.classList.remove('menu-open')
  }, [isOpen])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [])

  const closeMenu = () => setIsOpen(false)

  return (
    <header className={`navbar ${isScrolled || isOpen ? 'navbar--solid' : ''}`}>
      <div className="navbar__inner container">
        <Brand compact />

        <nav className="navbar__desktop" aria-label="Primary navigation">
          {navigation.map((item) => {
            const section = item.href.slice(1)
            return (
              <a
                key={item.href}
                href={item.href}
                className={activeSection === section ? 'is-active' : ''}
                aria-current={activeSection === section ? 'location' : undefined}
              >
                {item.label}
              </a>
            )
          })}
        </nav>

        <div className="navbar__actions">
          <a className="navbar__phone" href={siteConfig.phoneHref} aria-label={`Call ${siteConfig.businessName} at ${siteConfig.phoneDisplay}`}>
            <Icon name="phone" size={17} />
            <span>{siteConfig.phoneDisplay}</span>
          </a>
          <a className="button button--small button--accent navbar__cta" href="#estimate">
            Get an estimate
          </a>
          <button
            className="navbar__toggle"
            type="button"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setIsOpen((value) => !value)}
          >
            <Icon name={isOpen ? 'close' : 'menu'} size={26} />
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={`mobile-menu ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}>
        <nav className="mobile-menu__nav container" aria-label="Mobile navigation">
          <span className="eyebrow">Navigate</span>
          {navigation.map((item, index) => (
            <a key={item.href} href={item.href} onClick={closeMenu} tabIndex={isOpen ? 0 : -1}>
              <span>0{index + 1}</span>
              {item.label}
              <Icon name="arrow" size={22} />
            </a>
          ))}
          <div className="mobile-menu__contact">
            <a href={siteConfig.phoneHref} tabIndex={isOpen ? 0 : -1}>
              <Icon name="phone" size={19} /> {siteConfig.phoneDisplay}
            </a>
            <a className="button button--accent" href="#estimate" onClick={closeMenu} tabIndex={isOpen ? 0 : -1}>
              Start your project
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}
