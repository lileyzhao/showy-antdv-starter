<script setup lang="ts" name="Layout-SubSidebar">
import type { RouteRecordRaw } from 'vue-router'
import type { ItemType } from 'ant-design-vue/es/menu/src/hooks/useItems'
import { theme as ATheme } from 'ant-design-vue'
import { useAppStore } from '@/store'
import Logo from '@/layout/components/Logo.vue'
import { MenuButtonEnum, MenuPositionEnum } from '@/shared'
import { mapRoutesAnt } from '@/utils/menuUtil'
import { getFullRoutes } from '@/utils'

const props = defineProps({ parentMenuKey: { type: String, required: false } })

// Variables 变量
const { t } = useI18n()
const { token } = ATheme.useToken()
const app = useAppStore()
const route = useRoute()
const fullRoutes = getFullRoutes()
const subMenuRoutes = ref<RouteRecordRaw[]>([])

/** Menu setting 菜单设置 */
const menuSetting = computed(() => app.MenuSetting)

/** Collapsed State of sub-menu 副栏菜单收缩状态 */
const collSubMenu = computed({
  get: () => menuSetting.value.subMenu.collapsed,
  set: (val) => {
    if (menuSetting.value.subMenu.collapsed !== val)
      app.setMenuSetting({ subMenu: { collapsed: val } })
  },
})

/** Selected Item in sub-menu 副栏菜单选中项 */
const subMenuKey = computed<string[]>({
  get: () => [route.name as string],
  set: () => { },
})

/** sub-menu data 副栏菜单数据 */
const subMenuOptions = ref<ItemType[]>([])
const getSubMenuOptions = (mainMenuKey: string) => {
  return fullRoutes.filter(route => route.meta.parentName === mainMenuKey).map(route => mapRoutesAnt(route, fullRoutes, t, true))
}

/** Refresh the sub-menu 刷新副栏菜单 */
const refreshSubMenu = (mainMenuRootKey?: string) => {
  subMenuRoutes.value = fullRoutes.filter(r => r.meta.parentName === (mainMenuRootKey || route.matched[1].name))

  // 更新副栏菜单 Update the sub-menu
  if (!collSubMenu.value && subMenuRoutes.value.length > 0) {
    subMenuOptions.value = getSubMenuOptions(mainMenuRootKey || route.matched[1].name as string)
    subMenuKey.value = [route.name as string]
  }
  else { subMenuOptions.value = [] }
}

// Do not delete: Removing onMounted will cause the menu to be blank during hot refresh
// 勿删：删掉onMounted会导致热刷新时菜单空白
onMounted(async () => {
  refreshSubMenu()
})

// 监控主菜单变化
watch(() => props.parentMenuKey, (_val) => {
  refreshSubMenu(props.parentMenuKey)
})

/** Exposes 公开对象 */
defineExpose({ refreshSubMenu })
</script>

<template>
  <!-- Sidebar (desktop): Sub-sidebar 侧边栏(电脑端):副栏 -->
  <a-layout-sider
    v-if="subMenuRoutes.length > 0" collapse-mode="width" :width="menuSetting.subMenu.width"
    :collapsed-width="0" :collapsed="collSubMenu"
    :show-trigger="menuSetting.buttons.includes(MenuButtonEnum.SubMenuStatus) && app.MenuSetting.menuPosition === MenuPositionEnum.SIDEBAR ? 'arrow-circle' : false"
    :bordered="!collSubMenu" content-class="of-x-hidden!" z-2 theme="light"
    :style="`height:100vh;border-right:1px solid ${token.colorBorderSecondary};`"
  >
    <a-layout-header
      bordered
      :style="{ background: app.IsDarkMode ? '' : '#fff', padding: 0, height: 'auto', lineHeight: 'auto', borderBottom: `1px solid ${token.colorBorderSecondary}` }"
    >
      <Logo
        v-if="app.MenuSetting.menuPosition === MenuPositionEnum.TOP_BAR && app.MenuSetting.topMenu.showSubMenu"
        flex-y-center p-l-5
      />
      <Logo v-else hide-logo :hide-title="!menuSetting.mainMenu.collapsed" flex-y-center p-l-5 />
    </a-layout-header>
    <!-- Sub-menu 副栏菜单 -->
    <a-menu v-model:selectedKeys="subMenuKey" :items="subMenuOptions" mode="inline" class="b-0!" />
  </a-layout-sider>
</template>
