import type { IconName } from '../data/siteContent'

type IconProps = {
  name: IconName
  size?: number
  className?: string
}

export function Icon({ name, size = 24, className }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    className,
  }

  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    building: <><path d="M4 21V7l8-4v18"/><path d="M12 9h8v12M2 21h20"/><path d="M7.5 8v1M7.5 12v1M7.5 16v1M16 12v1M16 16v1"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    chevronLeft: <path d="m15 18-6-6 6-6"/>,
    chevronRight: <path d="m9 18 6-6-6-6"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    close: <><path d="M18 6 6 18M6 6l12 12"/></>,
    commercial: <><path d="M3 21V9h18v12M7 9V5h10v4M2 21h20"/><path d="M7 13h2M15 13h2M7 17h2M15 17h2"/></>,
    detail: <><path d="M4 20 20 4M14 4h6v6"/><path d="M4 14v6h6"/></>,
    exterior: <><path d="m3 11 9-7 9 7"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></>,
    home: <><path d="m3 11 9-7 9 7"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></>,
    interior: <><path d="M4 20V5h16v15M2 20h20"/><path d="M8 20v-6h8v6M9 9h.01M15 9h.01"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    pause: <><path d="M9 5v14M15 5v14"/></>,
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.56 2.81.69A2 2 0 0 1 22 16.92z"/>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    play: <path d="m8 5 11 7-11 7Z"/>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></>,
    spark: <><path d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4Z"/><path d="m18.5 14 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z"/></>,
  }

  return <svg {...common}>{paths[name]}</svg>
}
