export const makeCompile = (): void => {
  console.log('compiling [compile fn]')
}

interface SplitFileFnArgs {
  code: string
}

export const splitFile = async ({ code }: SplitFileFnArgs): Promise<void> => {
  console.log('Split file [splitFile fn]', code)
}
