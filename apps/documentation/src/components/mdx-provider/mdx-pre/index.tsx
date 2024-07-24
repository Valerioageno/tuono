import cx from 'clsx'
import { CodeHighlight } from '@mantine/code-highlight'
import classes from './mdx-pre.module.css'

export default function MdxCodeHighlight({ className, ...others }) {
  return <CodeHighlight className={cx(classes.code, className)} {...others} />
}
