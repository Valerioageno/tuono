import type { JSX } from 'react'
import { Box, Button, Text, Title, Flex } from '@mantine/core'
import { Link } from 'tuono'
import { IconArrowRight, IconArrowLeft } from '@tabler/icons-react'

interface NavigationButton {
  href: string
  title: string
}

interface NavigationButtonsProps {
  prev?: NavigationButton
  next?: NavigationButton
}

export default function NavigationButtons({
  prev,
  next,
}: NavigationButtonsProps): JSX.Element {
  return (
    <Flex mt={50} gap={10}>
      {prev && <NavigationBtn type="prev" {...prev} />}
      {next && <NavigationBtn type="next" {...next} />}
    </Flex>
  )
}

interface NavigationButtonProps extends NavigationButton {
  type: 'next' | 'prev'
}

const NavigationBtn = ({
  type,
  title,
  href,
}: NavigationButtonProps): JSX.Element => {
  const heading = type === 'next' ? 'Next' : 'Previous'
  const textAlign = type === 'next' ? 'left' : 'right'
  const variant = type === 'next' ? 'filled' : 'outline'

  return (
    <Button
      component={Link}
      fullWidth
      variant={variant}
      href={href}
      justify="space-between"
      h="auto"
      rightSection={type === 'next' && <IconArrowRight />}
      leftSection={type === 'prev' && <IconArrowLeft />}
      p="20"
    >
      <Box>
        <Title component="span" display="block" order={4} style={{ textAlign }}>
          {heading}
        </Title>
        <Text component="span" display="block" style={{ textAlign }}>
          {title}
        </Text>
      </Box>
    </Button>
  )
}
