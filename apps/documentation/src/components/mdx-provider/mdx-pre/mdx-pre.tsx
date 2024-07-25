import { CodeHighlight } from '@mantine/code-highlight'

export default function MdxPre(props): JSX.Element {
  return (
    <CodeHighlight
      code={props.children.props.children}
      language={props.children.props.className?.replace('language-', '')}
    />
  )
}
