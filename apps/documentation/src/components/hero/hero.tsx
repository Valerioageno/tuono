import {
  Button,
  Center,
  Container,
  CopyButton,
  Group,
  rem,
  Text,
  Title,
} from '@mantine/core'
import { IconCopy, IconCheck } from '@tabler/icons-react'
import { Link } from 'tuono'

export default function Hero(): JSX.Element {
  return (
    <Container size={1100} mt={200}>
      <Center>
        <Title order={1}>The react/rust fullstack framework</Title>
      </Center>
      <Center mt={50}>
        <Text fz="18px">
          The technologies we love seamessly working together to unleash the
          <strong> highest web performance</strong> ever met on react
        </Text>
      </Center>
      <Center mt={50}>
        <Group>
          <Button component={Link} href="/documentation/installation" size="lg">
            Get Started
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
      </Center>
    </Container>
  )
}
