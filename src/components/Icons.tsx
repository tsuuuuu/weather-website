import type { ReactNode, SVGProps } from 'react'

// Small stroke icons for the interface (24x24 grid)
type IconProps = SVGProps<SVGSVGElement> & { size?: number }

const Icon = ({ size = 20, children, ...props }: IconProps & { children: ReactNode }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
    >
        {children}
    </svg>
)

export const SearchIcon = (props: IconProps) => (
    <Icon {...props}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
    </Icon>
)

export const LocateIcon = (props: IconProps) => (
    <Icon {...props}>
        <circle cx="12" cy="12" r="7" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </Icon>
)

export const StarIcon = ({ filled = false, ...props }: IconProps & { filled?: boolean }) => (
    <Icon {...props} fill={filled ? 'currentColor' : 'none'}>
        <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2-5.5-2.9-5.5 2.9 1-6.2L3 9.6l6.2-.9Z" />
    </Icon>
)

export const CloseIcon = (props: IconProps) => (
    <Icon {...props}>
        <path d="M6 6l12 12M18 6 6 18" />
    </Icon>
)

export const ClockIcon = (props: IconProps) => (
    <Icon {...props}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
    </Icon>
)

export const ThermometerIcon = (props: IconProps) => (
    <Icon {...props}>
        <path d="M14 14.8V5a2 2 0 1 0-4 0v9.8a4 4 0 1 0 4 0Z" />
    </Icon>
)

export const DropletIcon = (props: IconProps) => (
    <Icon {...props}>
        <path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11Z" />
    </Icon>
)

export const WindIcon = (props: IconProps) => (
    <Icon {...props}>
        <path d="M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h7" />
    </Icon>
)

export const SunIcon = (props: IconProps) => (
    <Icon {...props}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </Icon>
)

export const GaugeIcon = (props: IconProps) => (
    <Icon {...props}>
        <path d="M4 18a9 9 0 1 1 16 0" />
        <path d="m12 14 4-5" />
    </Icon>
)

export const EyeIcon = (props: IconProps) => (
    <Icon {...props}>
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
    </Icon>
)

export const UmbrellaIcon = (props: IconProps) => (
    <Icon {...props}>
        <path d="M3 12a9 9 0 0 1 18 0Z" />
        <path d="M12 12v7a2 2 0 0 1-4 0" />
    </Icon>
)

export const SunriseIcon = (props: IconProps) => (
    <Icon {...props}>
        <path d="M17 18a5 5 0 0 0-10 0M12 3v6M8.5 6.5 12 3l3.5 3.5M3 22h18M4.2 13.2l1.4 1.4M18.4 14.6l1.4-1.4M2 18h2M20 18h2" />
    </Icon>
)

export const SunsetIcon = (props: IconProps) => (
    <Icon {...props}>
        <path d="M17 18a5 5 0 0 0-10 0M12 9V3M8.5 5.5 12 9l3.5-3.5M3 22h18M4.2 13.2l1.4 1.4M18.4 14.6l1.4-1.4M2 18h2M20 18h2" />
    </Icon>
)

export const GitHubIcon = (props: IconProps) => (
    <Icon {...props} fill="currentColor" stroke="none">
        <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .6 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" />
    </Icon>
)

export const LinkedInIcon = (props: IconProps) => (
    <Icon {...props} fill="currentColor" stroke="none">
        <path d="M20.4 2H3.6A1.6 1.6 0 0 0 2 3.6v16.8A1.6 1.6 0 0 0 3.6 22h16.8a1.6 1.6 0 0 0 1.6-1.6V3.6A1.6 1.6 0 0 0 20.4 2ZM8 19H5V9.5h3ZM6.5 8.2a1.7 1.7 0 1 1 0-3.5 1.7 1.7 0 0 1 0 3.5ZM19 19h-3v-4.6c0-1.1 0-2.5-1.5-2.5S12.8 13 12.8 14.3V19h-3V9.5h2.8v1.3a3.1 3.1 0 0 1 2.8-1.5c3 0 3.6 2 3.6 4.6Z" />
    </Icon>
)

export const MailIcon = (props: IconProps) => (
    <Icon {...props}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
    </Icon>
)

export const GlobeIcon = (props: IconProps) => (
    <Icon {...props}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </Icon>
)
