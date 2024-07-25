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
        <Button component={Link} href="/documentation" size="lg">
          Documentation
        </Button>
        <CopyButton value="cargo install tuono">
          {({ copied, copy }) => (
            <Button
              onClick={copy}
              size="lg"
              style={{ border: 'solid 1px var(--mantine-color-violet-1)' }}
              color="gray"
              leftSection="cargo install tuono"
              rightSection={
                copied ? (
                  <IconCheck style={{ width: rem(20) }} />
                ) : (
                  <IconCopy style={{ width: rem(20) }} />
                )
              }
            />
          )}
        </CopyButton>
      </Group>
    </Container>
  )
}
