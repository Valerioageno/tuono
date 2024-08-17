/**
 * Component inspired by: https://github.com/mantinedev/mantine/tree/master/apps/mantine.dev/src/components/TableOfContents
 */
export interface Heading {
  depth: number
  content: string
  id: string
  getNode: () => HTMLHeadingElement
}

function getHeadingsData(headings: HTMLHeadingElement[]): Heading[] {
  const result: Heading[] = []

  for (const heading of headings) {
    if (heading.id) {
      result.push({
        depth: parseInt(heading.getAttribute('data-order'), 10),
        content: heading.getAttribute('data-heading') || '',
        id: heading.id,
        getNode: () =>
          document.getElementById(heading.id) as HTMLHeadingElement,
      })
    }
  }

  return result
}

export function getHeadings(): Heading[] {
  const root = document.getElementById('mdx-root')
  console.log(root)

  if (!root) {
    return []
  }

  return getHeadingsData(Array.from(root.querySelectorAll('[data-heading]')))
}
