import { useEffect, useRef, useState } from 'react'
import { galleryItems } from '../data/siteContent'
import { Icon } from './Icon'

const AUTOPLAY_DELAY = 5000

export function GalleryCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [hasFocus, setHasFocus] = useState(false)
  const [documentHidden, setDocumentHidden] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  const isPaused = userPaused || isHovered || hasFocus || documentHidden || reduceMotion

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => setReduceMotion(media.matches)
    updateMotion()
    media.addEventListener('change', updateMotion)
    return () => media.removeEventListener('change', updateMotion)
  }, [])

  useEffect(() => {
    const onVisibilityChange = () => setDocumentHidden(document.hidden)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [])

  useEffect(() => {
    if (isPaused) return
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % galleryItems.length)
    }, AUTOPLAY_DELAY)
    return () => window.clearInterval(timer)
  }, [activeIndex, isPaused])

  const goTo = (index: number) => setActiveIndex((index + galleryItems.length) % galleryItems.length)

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setHasFocus(false)
  }

  const activeItem = galleryItems[activeIndex]

  return (
    <section className="work section section--light" id="work" aria-labelledby="work-title">
      <div className="container">
        <header className="section-heading section-heading--split work__heading" data-reveal>
          <div>
            <span className="eyebrow eyebrow--dark">Selected work</span>
            <h2 id="work-title">Transformation,<br />framed.</h2>
          </div>
          <div className="work__heading-copy">
            <p>A closer look at the spaces, surfaces, and elevations that inspire the standard we bring to every project.</p>
            <span>Featured project showcase</span>
          </div>
        </header>

        <div className="carousel-reveal" data-reveal>
          <div
            className={`carousel ${isPaused ? 'is-paused' : ''}`}
            ref={carouselRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setHasFocus(true)}
            onBlur={handleBlur}
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured painting projects"
          >
          <div className="carousel__viewport">
            {galleryItems.map((item, index) => (
              <figure
                className={`carousel__slide ${activeIndex === index ? 'is-active' : ''}`}
                key={item.title}
                aria-hidden={activeIndex !== index}
              >
                <img src={item.image} alt={item.alt} loading={index === 0 ? 'eager' : 'lazy'} />
              </figure>
            ))}

            <div className="carousel__corner" aria-hidden="true">
              <span>VC</span>
            </div>
            <span className="carousel__vertical-label" aria-hidden="true">Crafted surfaces / lasting impressions</span>
          </div>

          <div className="carousel__caption" aria-live={isPaused ? 'polite' : 'off'}>
            <div className="carousel__index">
              <span>{String(activeIndex + 1).padStart(2, '0')}</span>
              <span>/</span>
              <span>{String(galleryItems.length).padStart(2, '0')}</span>
            </div>
            <div className="carousel__project">
              <p>{activeItem.category}</p>
              <h3>{activeItem.title}</h3>
            </div>
            <p className="carousel__description">{activeItem.description}</p>
            <div className="carousel__location">
              <Icon name="pin" size={17} />
              <span>{activeItem.location}</span>
            </div>
            <div className="carousel__controls">
              <button type="button" onClick={() => goTo(activeIndex - 1)} aria-label="Previous project">
                <Icon name="chevronLeft" size={23} />
              </button>
              <button
                type="button"
                onClick={() => setUserPaused((paused) => !paused)}
                aria-label={userPaused ? 'Resume carousel autoplay' : 'Pause carousel autoplay'}
                aria-pressed={userPaused}
              >
                <Icon name={userPaused ? 'play' : 'pause'} size={19} />
              </button>
              <button type="button" onClick={() => goTo(activeIndex + 1)} aria-label="Next project">
                <Icon name="chevronRight" size={23} />
              </button>
            </div>
          </div>

            <div className="carousel__footer">
              <div className="carousel__dots" role="tablist" aria-label="Choose a featured project">
                {galleryItems.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    role="tab"
                    aria-selected={activeIndex === index}
                    aria-label={`Show project ${index + 1}: ${item.title}`}
                    onClick={() => goTo(index)}
                  >
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <i aria-hidden="true" />
                  </button>
                ))}
              </div>
              <div className="carousel__autoplay" aria-hidden="true">
                <span>{isPaused ? 'Paused' : 'Auto play'}</span>
                <div className="carousel__timer" key={`${activeIndex}-${isPaused}`}>
                  <i />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
