import { processSteps, values } from '../data/siteContent'
import { Icon } from './Icon'

export function About() {
  return (
    <section className="about section section--dark" id="about" aria-labelledby="about-title">
      <div className="about__texture" aria-hidden="true" />
      <div className="container">
        <div className="about__lead">
          <div className="about__brand-card" data-reveal>
            <div className="about__brand-image">
              <img src="/assets/vc-elevate-logo.webp" alt="VC Elevate Painting logo" loading="lazy" />
            </div>
            <div className="about__brand-caption">
              <span>San Diego, California</span>
              <span>Since every detail matters</span>
            </div>
          </div>

          <div className="about__copy" data-reveal>
            <span className="eyebrow">Why VC Elevate</span>
            <h2 id="about-title">Built on preparation.<br /><span>Finished to last.</span></h2>
            <p className="about__intro">
              A premium finish begins long before the first coat. We bring a clear process, a trained eye, and respect for the property to every residential, commercial, and high-rise project.
            </p>
            <p className="about__statement">
              We are here to become the team you trust with the spaces that matter—not simply the team that paints them.
            </p>
            <a className="text-link" href="#estimate">
              Meet us at your space <Icon name="arrow" size={19} />
            </a>
          </div>
        </div>

        <div className="values" aria-label="Our values">
          {values.map((value) => (
            <article className="value" key={value.title} data-reveal>
              <span className="value__number">{value.number}</span>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </article>
          ))}
        </div>

        <div className="process" data-reveal>
          <header className="process__header">
            <span className="eyebrow">Our process</span>
            <h3>A better finish starts with a better experience.</h3>
          </header>
          <ol className="process__steps">
            {processSteps.map((step) => (
              <li key={step.number}>
                <span>{step.number}</span>
                <div>
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
