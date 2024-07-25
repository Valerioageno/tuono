import { Flex, Button, ActionIcon } from '@mantine/core'
import { IconBrandGithub, IconBook } from '@tabler/icons-react'
import ThemeBtn from '../theme-btn'
import { Link } from 'tuono'

export default function Actions(): JSX.Element {
  return (
    <Flex gap={8}>
      <Button
        href="/documentation"
        component={Link}
        size="compact-lg"
        leftSection={'Docs'}
        rightSection={<IconBook />}
        autoContrast
      />
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
      <ThemeBtn />
    </Flex>
  )
}
