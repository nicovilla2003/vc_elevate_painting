type BrandProps = {
  compact?: boolean
  inverted?: boolean
}

export function Brand({ compact = false, inverted = true }: BrandProps) {
  return (
    <a className={`brand ${compact ? 'brand--compact' : ''} ${inverted ? 'brand--inverted' : ''}`} href="#top" aria-label="VC Elevate Painting, home">
      <span className="brand__mark" aria-hidden="true">
        <img src="/assets/vc-elevate-logo.webp" alt="" />
      </span>
      <span className="brand__wordmark">
        <span className="brand__name">Elev<span>a</span>te</span>
        <span className="brand__trade">Painting</span>
      </span>
    </a>
  )
}
