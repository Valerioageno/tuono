import type { JSX } from 'react'
import { Flex, Button, ActionIcon, Group } from '@mantine/core'
import {
  IconBrandGithub,
  IconBook,
  IconBrandDiscord,
} from '@tabler/icons-react'
import { Link } from 'tuono'

import ThemeBtn from '../theme-btn'

export default function Actions(): JSX.Element {
  return (
    <Flex gap={8}>
      <Group gap={8} visibleFrom="sm">
        <Button
          href="/documentation"
          component={Link}
          size="compact-lg"
          rightSection={<IconBook />}
          autoContrast
        >
          Get started
        </Button>
        <ActionIcon
          variant="default"
          size="lg"
          aria-label="Check the project on github"
          href="https://github.com/Valerioageno/tuono"
          target="_blank"
          component="a"
        >
          <IconBrandGithub />
        </ActionIcon>
        <ActionIcon
          variant="default"
          size="lg"
          aria-label="Join the Tuono's community on Discord!"
          href="https://discord.com/invite/sFNaHGkj"
          target="_blank"
          component="a"
        >
          <IconBrandDiscord />
        </ActionIcon>
      </Group>
      <ThemeBtn />
    </Flex>
  )
}
