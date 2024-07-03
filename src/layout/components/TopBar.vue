<script setup lang="ts" name="Layout-TopBar">
import type { MenuInfo, SelectInfo } from 'ant-design-vue/es/menu/src/interface'
import { theme as ATheme } from 'ant-design-vue'
import Logo from '@/layout/components/Logo.vue'
import { useAppStore } from '@/store'
import { MENU_STATE_TEXT, MenuButtonEnum, MenuPositionEnum } from '@/shared'
import ActionIcon from '@/layout/components/ActionIcon.vue'
import { mapRoutesAnt } from '@/utils/menuUtil'
import { availableLocales } from '@/modules/i18n'
import { getFullRoutes } from '@/utils'

const emit = defineEmits(['action', 'keyChange'])

// Variables 变量
const { t } = useI18n()
const { token } = ATheme.useToken()
const app = useAppStore()
const router = useRouter()
const route = useRoute()
const fullRoutes = getFullRoutes()

/** Menu setting 菜单设置 */
const menuSetting = computed(() => app.MenuSetting)

/** Whether it is top bar layout 是否顶栏菜单布局 */
const isTopBarLayout = computed(() => menuSetting.value.menuPosition === MenuPositionEnum.TOP_BAR)

/** Whether to show main menu status switch button 是否显示主菜单状态切换按钮 */
const showMainMenuStatusButton = computed(() => menuSetting.value.buttons.includes(MenuButtonEnum.MainMenuStatus))

/** Selected item in top menu 顶栏菜单选中项 */
const topMenuKey = ref<string[]>()

/** Top menu items 顶栏菜单项 */
const topMenuOptions = computed(() => {
  const routers = fullRoutes.filter(route => route.meta.parentName === 'root').filter(route => !route.meta?.hidden) ?? []
  return routers.map(route => mapRoutesAnt(route, fullRoutes, t, !menuSetting.value.topMenu.showSubMenu))
})

/** Menu state switch icon 菜单状态切换图标 */
const menuStateIcon = computed(() => {
  const menuIconMap = { 1: 'i-line-md:download-off-outline', 2: 'i-line-md:menu-fold-right', 3: 'i-line-md:menu-unfold-left' }
  return app.isMobile ? 'i-line-md:menu-fold-right' : menuIconMap[menuSetting.value.menuState!] || ''
})

/** Toggle main-menu status 切换主栏菜单状态 */
const toggleMainMenu = () => app.isMobile ? emit('action', 'toggleMobileDrawer') : app.toggleMainMenuState()

const refreshTopMenu = () => {
  topMenuKey.value = [(menuSetting.value.topMenu.showSubMenu ? route.matched[1].name : route.name) as string]
  emit('keyChange', toRaw(topMenuKey.value))
}

/** show theme drawer 显示主题设置抽屉 */
const toggleThemeDrawer = () => {
  emit('action', 'toggleThemeDrawer')
}

/** toggle language 切换语言 */
const toggleLanguage = (lang: string) => {
  router.push({
    path: `/${lang.toLowerCase()}${route.path.replace(new RegExp(`^/${route.params.lang}/`, 'gi'), '/')}`,
    query: route.query,
    hash: route.hash,
  })
}

const onTopMenuKeyChange = (item: SelectInfo) => {
  console.log(item)
  emit('keyChange', item.key)
}

const profileOptions = computed(() => [
  {
    key: 'header',
    type: 'header',
    meta: {
      name: t('author'),
      intro: t('intro'),
      avatar: 'https://07akioni.oss-cn-beijing.aliyuncs.com/demo1.JPG',
    },
  },
  { type: 'divider', key: 'header-divider' },
  { key: 'profile', icon: 'i-carbon:user-avatar-filled-alt', label: t('profileMenu.profile') },
  { key: 'settings', icon: 'i-carbon:settings', label: t('profileMenu.settings') },
  { type: 'divider', key: 'logout-divider' },
  { key: 'logout', icon: 'i-carbon:logout', label: t('profileMenu.logout') },
])

const profileSelect = (info: MenuInfo) => {
  switch (info.key) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      router.push('/login')
      break
  }
}

onMounted(() => {
  topMenuKey.value = [(menuSetting.value.topMenu.showSubMenu ? route.matched[1].name : route.name) as string]
})

const langs = computed(() => availableLocales.map(locale => ({ label: locale, key: locale })))

/** Exposes 公开对象 */
defineExpose({ refreshTopMenu })
</script>

<template>
  <!-- Left section of the top bar 头部左侧区 -->
  <a-layout-header
    z-1 p-inline-0
    :style="{ background: app.IsDarkMode ? '' : '#fff', padding: 0, height: 'auto', lineHeight: 'auto', borderBottom: `1px solid ${token.colorBorderSecondary}` }"
  >
    <div h-header flex-right-center gap-x-4>
      <!-- Left section of the top bar 头部左侧区 -->
      <div
        v-if="app.isMobile || (!isTopBarLayout && showMainMenuStatusButton)" h-full flex flex-1 items-center gap-x-4
        p-l-4
      >
        <div :class="menuStateIcon" cursor-pointer text-5 @click="toggleMainMenu" />
        <span v-if="!app.isMobile" font-size-3 text-gray>←{{ t(MENU_STATE_TEXT[menuSetting.menuState!]) }}</span>
      </div>
      <!-- Top logo 顶栏Logo -->
      <Logo v-if="isTopBarLayout && !menuSetting.topMenu.showSubMenu" flex-nowrap b-r-1 px-28px />
      <!-- Top menu 顶栏菜单 -->
      <div flex-1>
        <a-menu
          v-if="!app.isMobile && isTopBarLayout" v-model:selectedKeys="topMenuKey" mode="horizontal"
          :items="topMenuOptions" class="h-14 b-b-none! line-height-14!" @select="onTopMenuKeyChange"
        />
      </div>
      <!-- Right section of the top bar 头部右侧区 -->
      <div h-full flex-right-center p-r-3>
        <ActionIcon
          v-if="menuSetting.topMenu.showSubMenu && isTopBarLayout && !app.isMobile" button
          icon-class="i-carbon:side-panel-close" @click="app.toggleMenuPosition"
        />
        <ActionIcon
          v-else-if="!app.isMobile" button
          :icon-class="`i-carbon:align-${isTopBarLayout ? 'horizontal-left' : 'vertical-top'}`"
          @click="app.toggleMenuPosition"
        />
        <ActionIcon
          v-if="menuSetting.buttons.includes(MenuButtonEnum.ThemeMode)" button
          :icon-class="`i-line-md:${app.IsDarkMode ? 'sunny-filled' : 'moon-filled '}`" hover-class-dark="text-yellow!"
          @click="app.toggleThemeMode"
        />
        <a-dropdown v-if="app.LocaleSetting.showButton && langs.length > 2" :trigger="['click']">
          <div flex-y-center>
            <ActionIcon button icon-class="i-carbon:language" />
          </div>
          <template #overlay>
            <a-menu @click="(info) => toggleLanguage(info.key as string)">
              <a-menu-item v-for="lang in langs" :key="lang.key">
                {{ lang.label }}
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <ActionIcon
          v-if="app.LocaleSetting.showButton && langs.length === 2" button icon-class="i-carbon:language"
          @click="toggleLanguage"
        />
        <ActionIcon
          v-if="!app.isMobile && menuSetting.buttons.includes(MenuButtonEnum.ThemeDrawer)" button
          icon-class="i-carbon:cookie" @click="toggleThemeDrawer"
        />
        <!-- profile 个人资料 -->
        <a-dropdown :trigger="['click']">
          <ActionIcon button icon-class="i-carbon:user-avatar text-6" :text="t('author')" />
          <template #overlay>
            <a-menu @click="profileSelect">
              <template v-for="item in profileOptions" :key="item.key">
                <a-menu-divider v-if="item.type === 'divider'" :key="item.key" />
                <a-menu-item v-if="item.type !== 'divider'" :key="item.key">
                  <template v-if="item.type === 'header'">
                    <div mt-2 flex gap-2>
                      <a-avatar :src="item.meta?.avatar" :size="40" mt-1 />
                      <div w-160px>
                        <div>
                          {{ item.meta?.name }}
                        </div>
                        <div text-12px text-gray5>
                          {{ item.meta?.intro }}
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    {{ item.label }}
                  </template>
                </a-menu-item>
              </template>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
  </a-layout-header>
</template>
