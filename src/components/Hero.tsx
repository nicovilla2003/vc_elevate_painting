import { trustPoints } from '../data/siteContent'
import { Icon } from './Icon'

export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__ghost" aria-hidden="true">ELEVATE</div>

      <div className="hero__visual" aria-hidden="true">
        <img src="/assets/hero-high-rise.webp" alt="" fetchPriority="high" />
        <div className="hero__image-number">01 / ABOVE THE STANDARD</div>
      </div>

      <div className="hero__content-wrap container">
        <div className="hero__content" data-reveal>
          <div className="hero__eyebrow eyebrow">
            <span className="eyebrow__line" />
            San Diego painting specialists
          </div>
          <p className="hero__brandline">VC Elevate Painting</p>
          <h1 id="hero-title">
            Exteriors &amp; interiors.
            <span>Elevated.</span>
          </h1>
          <p className="hero__lead">
            Premium painting for homes, businesses, and high-rise properties—delivered with sharp preparation, disciplined craft, and a finish that holds attention.
          </p>

          <div className="hero__actions">
            <a className="button button--accent" href="#estimate">
              Get a free estimate <Icon name="arrow" size={19} />
            </a>
            <a className="button button--ghost" href="#work">
              View our work <span aria-hidden="true">↘</span>
            </a>
          </div>

          <ul className="hero__categories" aria-label="Project categories">
            <li>Residential</li>
            <li>Commercial</li>
            <li>High-Rise</li>
          </ul>
        </div>
      </div>

      <div className="hero__trust">
        <div className="container hero__trust-inner">
          {trustPoints.map((point) => (
            <div className="trust-point" key={point.title}>
              <span className="trust-point__icon"><Icon name={point.icon} size={24} /></span>
              <span>
                <strong>{point.title}</strong>
                <small>{point.detail}</small>
              </span>
            </div>
          ))}
          <a className="hero__trust-link" href="#services" aria-label="Explore our services">
            <span>Explore</span>
            <Icon name="chevronRight" size={21} />
          </a>
        </div>
      </div>
    </section>
  )
}
