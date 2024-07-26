import { CodeHighlight } from '@mantine/code-highlight'

interface PreProps {
  children: any
}
export default function MdxPre({ children }: PreProps): JSX.Element {
  return (
    <CodeHighlight
      code={children.props.children || ''}
      language={children.props.className?.replace('language-', '')}
    />
  )
}
