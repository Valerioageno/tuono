import type { ReactNode } from 'react'

const camelCaseProps = ['itemProp']
const uniqueIdentifiersI = ['property', 'name', 'itemprop']
const uniqueIdentifiers = uniqueIdentifiersI.concat(camelCaseProps) //case sensitive props is defined in case anyone defined the lowercase prop
const uniqueIdentifiersAll = uniqueIdentifiers.concat(['id'])

/**
  Note:
  1. In server side we will add meta tags and title at last after fitering
  2. In client we will match and replace meta tagString
  3. For now we will not support link and other tags properly, they can be added but we will not check for uniqueness and will not decide placement
**/

function filterOutMetaWithId(metas: HTMLElement[]): HTMLElement[] {
  metas = Array.prototype.slice.call(metas)
  return metas.filter((meta) => !meta.id)
}

export function filterAndArrangeTags(headElms: ReactNode[]): ReactNode[] {
  let title = null
  let canonicalLink = null
  const metas = []
  const rest = []

  headElms.forEach((elm) => {
    const { type, props } = elm
    if (type === 'title') {
      title = elm
    } else if (type === 'link' && props.rel === 'canonical') {
      canonicalLink = elm
    } else if (type === 'meta') {
      metas.push(elm)
    } else {
      rest.push(elm)
    }
  })

  return [title, ...removeDuplicateMetas(metas), canonicalLink, ...rest]
}

function removeDuplicateMetas(metas) {
  const addedMeta = {}

  //initialize all the identifiers with empty array
  uniqueIdentifiersAll.forEach((identifier) => {
    addedMeta[identifier] = []
  })

  const filteredMetas = []
  for (let i = metas.length - 1; i >= 0; i--) {
    const meta = metas[i]

    const { id } = meta.props
    let addMeta = false

    //if has id and element with id is not present than always add meta
    if (id) {
      addMeta = !addedMeta.id[id]

      //for any other unique identifier check if meta already available with same identifier which doesn't have id
    } else {
      addMeta =
        uniqueIdentifiers.filter((identifier) => {
          const identifierValue = meta.props[identifier]
          const existing = addedMeta[identifier][identifierValue]
          return existing && !existing.props.id
        }).length === 0
    }

    if (addMeta) {
      filteredMetas.unshift(meta)

      //add meta as added
      uniqueIdentifiersAll.forEach((identifier) => {
        const identifierValue = meta.props[identifier]
        if (identifierValue) addedMeta[identifier][identifierValue] = meta
      })
    }
  }

  return filteredMetas
}

export function getDuplicateTitle(): HTMLTitleElement[] {
  return document.head.querySelectorAll('title')
}

export function getDuplicateCanonical(): HTMLLinkElement[] {
  return document.head.querySelectorAll('link[rel="canonical"]')
}

export function getDuplicateElementById({ id }: HTMLElement): HTMLElement[] {
  return id && document.head.querySelector(`#${id}`)
}

export function getDuplicateMeta(meta: HTMLElement) {
  const head = document.head

  //for any other unique identifier check if metas already available with same identifier which doesn't have id
  return uniqueIdentifiersI.reduce((duplicates, identifier) => {
    const identifierValue = meta.getAttribute(identifier)
    return identifierValue
      ? duplicates.concat(
          filterOutMetaWithId(
            head.querySelectorAll(`[${identifier} = "${identifierValue}"]`),
          ),
        )
      : duplicates
  }, [])
}

//function to append childrens on a parent
export function appendChild(parent: HTMLElement, childrens: Node[]): void {
  const docFrag = document.createDocumentFragment()

  //we used for loop instead of forEach because childrens can be array like object
  for (let i = 0, ln = childrens.length; i < ln; i++) {
    docFrag.appendChild(childrens[i])
  }

  parent.appendChild(docFrag)
}

export function removeChild(parent: HTMLElement, childrens: Node[]): void {
  for (let i = 0, ln = childrens.length; i < ln; i++) {
    parent.removeChild(childrens[i])
  }
}
