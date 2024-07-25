import { Button, Container, CopyButton, Group, rem } from '@mantine/core'
import { IconCopy, IconCheck } from '@tabler/icons-react'
import { Link } from 'tuono'
import styles from './hero.module.css'

export default function Hero(): JSX.Element {
  return (
    <Container size={1100} className={styles.container}>
      <h1>Tuono</h1>
      <h2>The react / rust fullstack framework</h2>
      <Group>
        <Button component={Link} href="/documentation">
          Documentation
        </Button>
        <CopyButton value="cargo install tuono">
          {({ copied, copy }) => (
            <>
              <Button onClick={copy}>
                cargo install tuono
                {copied ? (
                  <IconCheck style={{ width: rem(16) }} />
                ) : (
                  <IconCopy style={{ width: rem(16) }} />
                )}
              </Button>
            </>
          )}
        </CopyButton>
      </Group>
    </Container>
  )
}
