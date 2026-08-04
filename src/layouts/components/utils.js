import { useRoute } from 'vue-router'

export const isAnyChildActive = item => {
  const route = useRoute()
  if (!item.children)
    return false
  
  return item.children.some(child => {
    if (child.to)
      return child.to.name === route.name
    if ('children' in child && child.children)
      return isAnyChildActive(child)
    
    return false
  })
}
export const isNavLinkActive = item => {
  const route = useRoute()
  if (item.to)
    return item.to.name === route.name
  
  return false
}
export const isGroupActive = navList => {
  const activeGroup = ['']
  if (navList) {
    navList.forEach(item => {
      if ('children' in item && item.children && isAnyChildActive(item))
        activeGroup.push(item.name)
    })
  }
  
  return activeGroup
}
