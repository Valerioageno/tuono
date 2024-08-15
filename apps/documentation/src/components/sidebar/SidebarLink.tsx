import { NavLink, type NavLinkProps } from '@mantine/core'
import type { CSSProperties, ReactNode } from 'react'
import { Link, useRouter } from 'tuono'

interface SidebarLinkProps {
  label: string
  href: string
  onClick?: () => void
  children?: ReactNode
}

const styles: CSSProperties = {
  borderRadius: 8,
  marginTop: '0.25rem',
  lineHeight: '1.25rem',
  fontWeight: 'bold',
}

export default function SidebarLink(
  props: SidebarLinkProps & NavLinkProps,
): JSX.Element {
  const { pathname } = useRouter()

  return (
    <NavLink
      component={props.href.startsWith('#') ? 'button' : Link}
      style={
        pathname === props.href
          ? {
              color: 'var(--mantine-color-violet-4)',
              ...styles,
            }
          : styles
      }
      {...props}
    />
  )
}
