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
  return (
    <Button
      component={href ? Link : 'span'}
      href={href}
      variant={href ? 'subtle' : 'light'}
      radius="xl"
      px={href ? 10 : undefined}
    >
      {label}
    </Button>
  )
}
