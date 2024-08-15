import { NavLink, type NavLinkProps } from '@mantine/core'
import { useState, type ReactNode } from 'react'
import { Link, useRouter } from 'tuono'
import { IconChevronRight } from '@tabler/icons-react'

import styles from './sidebar-link.module.css'

interface SidebarLinkProps {
  label: string
  href: string
  onClick?: () => void
  children?: ReactNode
}

export default function SidebarLink(
  props: SidebarLinkProps & NavLinkProps,
): JSX.Element {
  const { pathname } = useRouter()
  const [isOpen, setIsOpen] = useState<boolean>(!!props.defaultOpened)

  return (
    <NavLink
      component={props.href.startsWith('#') ? 'button' : Link}
      active={pathname === props.href}
      className={styles.link}
      rightSection={
        props.children && (
          <IconChevronRight
            size="1.2rem"
            stroke={1.5}
            className="mantine-rotate-rtl"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsOpen((state) => !state)
            }}
          />
        )
      }
      opened={isOpen}
      autoContrast
      {...props}
    />
  )
}
