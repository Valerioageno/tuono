import type { JSX } from 'react'
import { sidebarElements } from './config'
import {
	AppShell,
	Badge,
	Flex,
	Divider,
	Title,
	Button,
	ScrollArea,
	Text,
} from '@mantine/core'

import SidebarLink from './sidebar-link'
import { IconX } from '@tabler/icons-react'
import { useMediaQuery } from '@mantine/hooks'

interface SidebarProps {
	close: () => void
}

function SidebarHeader(): JSX.Element {
	const isSm = useMediaQuery('(min-width: 48em)')
	return (
		<AppShell.Section>
			<Flex mb={20} w="100%" justify="space-between">
				<Flex
					gap={10}
					align="center"
					w={isSm ? '100%' : 'auto'}
					justify="center"
				>
					<Title order={3}>Tuono</Title>
					<Badge mt={4} size="xs" variant="outline">
						Docs
					</Badge>
				</Flex>
				<Button onClick={close} hiddenFrom="sm" variant="transparent" p="0">
					<IconX />
				</Button>
			</Flex>
		</AppShell.Section>
	)
}

function SidebarElements({ close }: SidebarProps): JSX.Element {
	return (
		<AppShell.Section component={ScrollArea}>
			{sidebarElements.map((el, i) => {
				if (el.type === 'divider') {
					return <Divider my="md" mx={10} />
				}
				if (el.type === 'title') {
					return (
						<Text
							size="xs"
							fw={700}
							fz={12}
							pl={12}
							py={5}
							children={el.label}
						/>
					)
				}
				if (el.type === 'element') {
					if (el.children?.length) {
						return (
							<SidebarLink
								href={el.href}
								label={el.label}
								key={i}
								leftSection={el.leftIcon}
							>
								{el.children.map((child, index) => (
									<SidebarLink
										href={child.href}
										label={child.label}
										key={index}
										onClick={close}
									/>
								))}
							</SidebarLink>
						)
					}
					return (
						<SidebarLink
							href={el.href}
							label={el.label}
							onClick={close}
							key={i}
						/>
					)
				}
			})}
		</AppShell.Section>
	)
}

export default function Sidebar({ close }: SidebarProps): JSX.Element {
	return (
		<AppShell.Navbar p="md">
			<SidebarHeader />
			<SidebarElements close={close} />
		</AppShell.Navbar>
	)
}
