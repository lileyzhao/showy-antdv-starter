import { type RouteRecordNormalized, type RouteRecordRaw, RouterLink } from 'vue-router'
import type { ItemType } from 'ant-design-vue/es/menu/src/hooks/useItems'
import type { MenuSetting } from '@/shared'

/**
 * Map routes to menu items
 * 将路由映射为菜单项
 *
 * @param route The route object 路由对象
 * @param fullRoutes All routes 所有路由
 * @param t Internationalization function 国际化函数
 * @param loadChild Whether to load child menus 是否加载子菜单
 * @returns Mapped menu option 映射的菜单项
 */
export function mapRoutesAnt(
  route: RouteRecordRaw,
  fullRoutes: RouteRecordNormalized[],
  t: (x: string) => string,
  loadChild: boolean = true,
): ItemType {
  const menu: any = {
    key: route.name as string,
    icon: route.meta?.icon ? () => h('div', { class: route.meta?.icon, style: 'font-size:16px;' }) : undefined,
    title: t((route.meta?.title || route.name || route.path) as string),
  }

  const childRoutes = fullRoutes.filter(r => r.meta.parentName === menu.key)
  console.log('childRoutes', childRoutes)
  if (childRoutes.length > 0 && loadChild)
    menu.children = childRoutes.map(childRoute => mapRoutesAnt(childRoute, fullRoutes, t))

  // If there are child menus, make it non-clickable (no RouterLink wrapper)
  // 如果有子菜单，则不可点击(不用RouterLink包裹)
  if (childRoutes.length > 0) {
    menu.label = t((route.meta?.title || route.name || route.path) as string)
  }
  else {
    menu.label = h(
      RouterLink,
      { to: { path: route.path } },
      { default: () => `${t((route.meta?.title || route.name || route.path) as string)}` },
    )
  }

  return menu
}

/**
 * Map routes to main menu items
 * 将路由映射为菜单项（主菜单）
 *
 * @param route The route object 路由对象
 * @param fullRoutes All routes 所有路由
 * @param t Internationalization function 国际化函数
 * @param loadChild Whether to load child menus 是否加载子菜单
 * @param mainMenuSetting Main menu settings 主菜单配置
 * @returns Mapped main menu option 映射的主菜单项
 */
export function mapRoutesAntMain(
  route: RouteRecordRaw,
  fullRoutes: RouteRecordNormalized[],
  t: (x: string) => string,
  loadChild: boolean = true,
  mainMenuSetting: MenuSetting['mainMenu'],
): ItemType {
  const menu: any = mapRoutesAnt(route, fullRoutes, t, loadChild)
  if (mainMenuSetting.collapsed) {
    menu.icon = () =>
      h('div', { class: 'flex flex-col items-center w-full v-mid!' }, [
        // Menu icon 菜单图标
        h('div', { class: `${route.meta?.icon} ${mainMenuSetting.showLabel ? 'mt-6px text-20px' : 'text-22px'}` }),
        // Icon title 图标下方标题
        mainMenuSetting.showLabel && route.path.split('/').filter(p => p).length <= 1
          ? h(
            'div',
            { class: 'font-size-3.4 w-48px text-center of-hidden whitespace-nowrap my-3px' },
            {
              default: () => t((route.meta?.title || route.name || route.path) as string),
            },
          )
          : undefined,
      ])
  }

  return menu
}
