import { navigation, siteConfig } from '../data/siteContent'
import { Brand } from './Brand'
import { Icon } from './Icon'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__accent" aria-hidden="true" />
      <div className="container footer__main">
        <div className="footer__brand">
          <Brand />
          <p>{siteConfig.tagline}</p>
          <span>Premium painting for every elevation.</span>
        </div>

        <div className="footer__column">
          <h2>Explore</h2>
          <nav aria-label="Footer navigation">
            {navigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
            <a href="#top">Back to top</a>
          </nav>
        </div>

        <div className="footer__column footer__contact">
          <h2>Contact</h2>
          <a href={siteConfig.phoneHref}><Icon name="phone" size={16} />{siteConfig.phoneDisplay}</a>
          <a href={siteConfig.emailHref}><Icon name="mail" size={16} />{siteConfig.email}</a>
          <a href={siteConfig.instagramHref} target="_blank" rel="noreferrer"><Icon name="instagram" size={16} />{siteConfig.instagram}</a>
          <span><Icon name="pin" size={16} />{siteConfig.serviceArea}</span>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>© {year} {siteConfig.businessName}. All rights reserved.</p>
        <p>Owner: {siteConfig.owner}</p>
        <a href="#top">Rise to the top <span aria-hidden="true">↑</span></a>
      </div>
    </footer>
  )
}
