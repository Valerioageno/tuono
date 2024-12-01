/*
 * Component inspired by: https://github.com/mantinedev/mantine/tree/master/apps/mantine.dev/src/components/TableOfContents
 */
import type { JSX } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useRouter, Link } from 'tuono'
import { IconList } from '@tabler/icons-react'
import { Box, rem, ScrollArea, Text } from '@mantine/core'

import { getHeadings, type Heading } from './get-headings'
import classes from './table-of-content.module.css'

interface TableOfContentsProps {
  withTabs: boolean
}

function getActiveElement(rects: DOMRect[]): number {
  if (rects.length === 0) {
    return -1
  }

  const closest = rects.reduce(
    (acc, item, index) => {
      if (Math.abs(acc.position) < Math.abs(item.y)) {
        return acc
      }

      return {
        index,
        position: item.y,
      }
    },
    { index: 0, position: rects[0].y },
  )

  return closest.index
}

export function TableOfContents({
  withTabs,
}: TableOfContentsProps): JSX.Element | null {
  const [active, setActive] = useState(0)
  const [headings, setHeadings] = useState<Heading[]>([])
  const headingsRef = useRef<Heading[]>([])
  const router = useRouter()

  const filteredHeadings = headings.filter((heading) => heading.depth > 1)

  const handleScroll = (): void => {
    setActive(
      getActiveElement(
        headingsRef.current.map((d) => d.getNode().getBoundingClientRect()),
      ),
    )
  }

  useEffect(() => {
    const _headings = getHeadings()
    headingsRef.current = _headings
    setHeadings(_headings)
    setActive(
      getActiveElement(
        _headings.map((d) => d.getNode().getBoundingClientRect()),
      ),
    )
    window.addEventListener('scroll', handleScroll)
    return (): void => window.removeEventListener('scroll', handleScroll)
  }, [router.pathname])

  if (filteredHeadings.length === 0) {
    return null
  }

  const items = filteredHeadings.map((heading, index) => (
    <Text
      key={heading.id}
      component={Link}
      fz="sm"
      p={10}
      className={classes.link}
      mod={{ active: active === index }}
      href={`#${heading.id}`}
      __vars={{ '--toc-link-offset': `${heading.depth - 1}` }}
    >
      {heading.content}
    </Text>
  ))

  return (
    <Box
      component="nav"
      mod={{ 'with-tabs': withTabs }}
      className={classes.wrapper}
    >
      <div className={classes.inner}>
        <div>
          <div className={classes.header}>
            <IconList
              style={{ width: rem(20), height: rem(20) }}
              stroke={1.5}
            />
            <Text className={classes.title}>Table of contents</Text>
          </div>
          <ScrollArea.Autosize
            mah={`calc(100vh - ${rem(140)})`}
            type="never"
            offsetScrollbars
          >
            <div className={classes.items}>{items}</div>
          </ScrollArea.Autosize>
        </div>
      </div>
    </Box>
  )
}
