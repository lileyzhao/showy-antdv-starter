<script setup lang="ts" name="Layout-MainSidebar">
import type { ItemType } from 'ant-design-vue'
import { theme as ATheme } from 'ant-design-vue'
import Logo from '@/layout/components/Logo.vue'
import { useAppStore } from '@/store'
import { mapRoutesAntMain } from '@/utils/menuUtil'
import { getFullRoutes } from '@/utils'

const emit = defineEmits(['keyChange'])

const { t } = useI18n()
const { token } = ATheme.useToken()
const app = useAppStore()
const route = useRoute()
const fullRoutes = getFullRoutes()
const mainMenuRoutes = fullRoutes.filter(route => route.meta.parentName === 'root').filter(route => !route.meta?.hidden) ?? []

/** Collapsed State of main-menu 主栏菜单收缩状态 */
const collMainMenu = computed({
  get: () => app.MenuSetting.mainMenu.collapsed,
  set: val => app.setMenuSetting({ mainMenu: { collapsed: val } }),
})

/** Collapsed State of sub-menu 副栏菜单收缩状态 */
const collSubMenu = computed({
  get: () => app.MenuSetting.subMenu.collapsed,
  set: (val) => {
    if (app.MenuSetting.subMenu.collapsed !== val)
      app.setMenuSetting({ subMenu: { collapsed: val } })
  },
})

/** Main column reverse color 主栏反转颜色 */
const mainMenuInverted = computed({
  get: () => app.MenuSetting.mainMenu.inverted,
  set: val => app.setMenuSetting({ mainMenu: { inverted: val } }),
})

/** Selected Item in main-menu 主栏菜单选中项 */
const mainMenuKey = ref<string[]>()

/** main-menu data 主栏菜单数据 */
const mainMenuOptions = computed(() => {
  const mainMenuSetting = app.MenuSetting.mainMenu
  return mainMenuRoutes.map(route => mapRoutesAntMain(route, fullRoutes, t, app.MenuSetting.subMenu.collapsed, mainMenuSetting))
})

/** Handle main menu key change 处理主菜单键变化 */
const handleMainMenuKeyChange = (item: ItemType) => emit('keyChange', item?.key)

/** Refresh main menu 刷新主菜单 */
const refreshMainMenu = () => {
  mainMenuKey.value = [(app.MenuSetting.subMenu.collapsed ? route.name : route.matched[1].name) as string]
  handleMainMenuKeyChange({ key: mainMenuKey.value[0] })
}

/** Style class for logo logo的样式类 */
const logoClass = computed(() => !app.IsDarkMode && app.MenuSetting.mainMenu.inverted ? 'xb-bl-gray2! xb-b-1!' : '')

onMounted(refreshMainMenu)

watch(() => app.MenuSetting.subMenu.collapsed, refreshMainMenu)

/** Exposes 公开对象 */
defineExpose({ refreshMainMenu })
</script>

<template>
  <!-- Sidebar (Desktop): Main Column 侧边栏(电脑端):主栏 -->
  <a-layout-sider
    v-model:collapsed="collMainMenu" :collapsed-width="app.MenuSetting.mainMenu.widthColl" collapsible
    :trigger="null" :theme="mainMenuInverted ? 'dark' : 'light'"
    :style="`height:100vh;border-right:1px solid ${token.colorBorderSecondary};z-index:1;`"
    :width="app.MenuSetting.mainMenu.width"
  >
    <a-layout-header
      :class="logoClass"
      :style="{ backgroundColor: !mainMenuInverted && !app.IsDarkMode ? '#fff' : '', padding: 0, height: 'auto', lineHeight: 'auto', borderBottom: `1px solid ${mainMenuInverted ? 'rgba(48,48,48)' : token.colorBorderSecondary}` }"
    >
      <Logo w-full :hide-title="collMainMenu" />
    </a-layout-header>
    <!-- Main Menu 主栏菜单 -->
    <a-menu
      v-model:selectedKeys="mainMenuKey" :theme="mainMenuInverted ? 'dark' : 'light'" :items="mainMenuOptions"
      mode="vertical" :class="`main-menu ${app.MenuSetting.mainMenu.collapsed ? 'main-menu-coll' : ''}`" class="b-0!"
      @select="handleMainMenuKeyChange"
    />
    <div v-if="!app.IsDarkMode" absolute bottom-12px h-20px w-full>
      <div
        :class="`left-50% -translate-x-1/2 i-line-md:${mainMenuInverted ? 'sunny-filled hover:text-yellow text-white' : 'moon-filled hover:text-purple'}`"
        absolute cursor-pointer text-18px @click="mainMenuInverted = !mainMenuInverted"
      />
      <div
        v-if="collSubMenu" :class="`i-carbon:side-panel-close ${mainMenuInverted ? 'text-white' : ''}`"
        absolute right-2 rotate-180 cursor-pointer text-18px @click="collSubMenu = !collSubMenu"
      />
      <div
        v-else :class="`i-carbon:side-panel-close ${mainMenuInverted ? 'text-white' : ''}`"
        absolute right-2 cursor-pointer text-18px @click="collSubMenu = !collSubMenu"
      />
    </div>
  </a-layout-sider>
</template>

<style scoped lang="scss">
:deep(.main-menu) {
  &.main-menu-coll {
    .ant-menu-item {
      width: calc(100% - 15px);
      height: auto;
      padding: 0 0 4px 0;
      margin: 5px auto;
      min-height: 48px;
    }
  }
}
</style>
