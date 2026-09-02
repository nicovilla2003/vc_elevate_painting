import { primaryServices, projectTypes } from '../data/siteContent'
import { Icon } from './Icon'

export function Services() {
  return (
    <section className="services section section--light" id="services" aria-labelledby="services-title">
      <div className="container">
        <header className="section-heading section-heading--split" data-reveal>
          <div>
            <span className="eyebrow eyebrow--dark">What we paint</span>
            <h2 id="services-title">Every surface deserves<br />a higher standard.</h2>
          </div>
          <p>
            From a single room to a full elevation, we approach the work the same way: prepare carefully, communicate clearly, and finish with precision.
          </p>
        </header>

        <div className="service-features">
          {primaryServices.map((service) => (
            <article className="service-feature" key={service.title} data-reveal>
              <div className="service-feature__image">
                <img src={service.image} alt={service.imageAlt} loading="lazy" />
                <span className="service-feature__number">{service.number}</span>
              </div>
              <div className="service-feature__body">
                <div className="service-feature__topline">
                  <span>{service.number}</span>
                  <span>Core service</span>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul>
                  {service.items.map((item) => (
                    <li key={item}><Icon name="check" size={16} />{item}</li>
                  ))}
                </ul>
                <a href={service.href}>
                  Discuss your project <Icon name="arrow" size={18} />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="project-types" data-reveal>
          <div className="project-types__intro">
            <span className="eyebrow eyebrow--dark">Built for your property</span>
            <h3>One craft.<br />Three elevations.</h3>
          </div>
          {projectTypes.map((type) => (
            <article className="project-type" key={type.title}>
              <div className="project-type__icon"><Icon name={type.icon} size={30} /></div>
              <span className="project-type__rule" aria-hidden="true" />
              <h4>{type.title}</h4>
              <p>{type.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
