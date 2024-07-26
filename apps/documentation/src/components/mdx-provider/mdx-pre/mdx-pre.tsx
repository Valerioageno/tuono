import { CodeHighlight } from '@mantine/code-highlight'
import styles from './mdx-pre.module.css'

interface PreProps {
  children: any
}
export default function MdxPre({ children }: PreProps): JSX.Element {
  return (
    <CodeHighlight
      className={styles.pre}
      style={{ borderRadius: 8 }}
      code={children.props.children || ''}
      language={children.props.className?.replace('language-', '')}
    />
  )
}
