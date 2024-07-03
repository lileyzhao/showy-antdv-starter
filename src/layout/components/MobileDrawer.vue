<script setup lang="ts" name="Layout-MobileDrawer">
import type { ItemType } from 'ant-design-vue/es/menu/src/hooks/useItems'
import { theme as ATheme } from 'ant-design-vue'
import Logo from '@/layout/components/Logo.vue'
import { useAppStore } from '@/store'
import { mapRoutesAnt } from '@/utils/menuUtil'
import { getFullRoutes } from '@/utils'

// Variables 变量
const { t } = useI18n()
const app = useAppStore()
const route = useRoute()
const fullRoutes = getFullRoutes()

const drawerActive = ref(false)

/** Menu setting 菜单设置 */
const menuSetting = computed(() => app.MenuSetting)

/** Main column reverse color 主栏反转颜色 */
const mainMenuInverted = computed({
  get: () => menuSetting.value.mainMenu.inverted,
  set: val => app.setMenuSetting({ mainMenu: { inverted: val } }),
})

/** Selected item in main menu 主栏菜单选中项 */
const mobileMenuKey = ref<string[]>()
const mobileMenuKeyOpen = ref<string[]>()

/** Main menu options 主栏菜单项 */
const mobileMenuOptions = computed(() => {
  const routers = fullRoutes.filter(route => route.meta.parentName === 'root').filter(route => !route.meta?.hidden) ?? []
  return routers.map(route => mapRoutesAnt(route, fullRoutes, t, true))
})

/** Handle mobile menu key change 处理移动菜单键更改 */
const handleMobileMenuKeyChange = (_: ItemType) => {
  drawerActive.value = false
}

const show = () => {
  drawerActive.value = true
}

onMounted(() => {
  mobileMenuKey.value = [route.name as string]
  mobileMenuKeyOpen.value = [route.meta.parentName as string]
})

/** Exposes 公开对象 */
defineExpose({ show })
</script>

<template>
  <a-config-provider
    :theme="{ algorithm: !mainMenuInverted && !app.IsDarkMode ? ATheme.defaultAlgorithm : ATheme.darkAlgorithm }"
  >
    <a-drawer
      v-model:open="drawerActive" :width="menuSetting.mainMenu.widthMobile" placement="left"
      :body-style="{ padding: 0 }" body-content-class="p-0!" header-class="p-0!" footer-class="p-0!" :closable="false"
    >
      <template #footer>
        <div w-full>
          <a-button>Footer</a-button>
        </div>
      </template>
      <div style="border-bottom:1px solid rgba(255, 255, 255, 0.09);padding-left: 12px">
        <Logo flex-nowrap px-28px />
      </div>
      <a-menu
        v-model:selectedKeys="mobileMenuKey" v-model:open-keys="mobileMenuKeyOpen" mode="inline"
        :items="mobileMenuOptions" style="background-color: transparent;" @select="handleMobileMenuKeyChange"
      />
      <div v-if="!app.IsDarkMode" absolute bottom-60px w-full flex justify-center>
        <div
          :class="`i-line-md:${mainMenuInverted ? 'sunny-filled hover:text-yellow text-white' : 'moon-filled hover:text-purple'}`"
          cursor-pointer text-18px @click="mainMenuInverted = !mainMenuInverted"
        />
      </div>
    </a-drawer>
  </a-config-provider>
</template>
