import React, { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

type ExtractFn = (elements: ReactNode) => void

interface MetaTagsContextValues {
	extract?: ExtractFn
}

const MetaContext = createContext<MetaTagsContextValues>({})

interface MetaTagsContextProps {
	children: ReactNode
	extract?: ExtractFn
}

export default function MetaContextProvider({
	extract,
	children,
}: MetaTagsContextProps): ReactNode {
	return (
		<MetaContext.Provider
			value={{
				extract,
			}}
		>
			{children}
		</MetaContext.Provider>
	)
}

export const useMetaTagsContext = (): MetaTagsContextValues =>
	useContext(MetaContext)
