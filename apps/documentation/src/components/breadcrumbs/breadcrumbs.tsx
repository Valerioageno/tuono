import { Breadcrumbs, Button } from '@mantine/core'
import { Link } from 'tuono'

import { IconChevronRight, IconBolt } from '@tabler/icons-react'
import type { ReactNode } from 'react'

export default function TuonoBreadcrumbs({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  return (
    <Breadcrumbs
      separator={<IconChevronRight size="1.1rem" stroke={1.5} />}
      mb="md"
      mt="md"
    >
      <Button
        href="/documentation"
        component={Link}
        variant="subtle"
        radius="xl"
        p={5}
      >
        <IconBolt />
      </Button>
      {children}
    </Breadcrumbs>
  )
}

interface BreadcrumbElementProps {
  href?: string
  label: string
}

export function BreadcrumbElement({
  href,
  label,
}: BreadcrumbElementProps): JSX.Element {
  if (href) {
    return (
      <Button component={Link} href={href} variant="subtle" radius="xl" px={10}>
        {label}
      </Button>
    )
  }

  return (
    <Button component="span" variant="light" radius="xl">
      {label}
    </Button>
  )
}
