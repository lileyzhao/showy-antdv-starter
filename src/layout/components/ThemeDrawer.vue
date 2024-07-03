<script setup lang="ts" name="Layout-ThemeDrawer">
import { useAppStore } from '@/store/modules/app'
import { ThemeModeEnum } from '@/shared'

const { t } = useI18n()
const app = useAppStore()

const icons: Record<ThemeModeEnum, string> = {
  [ThemeModeEnum.LIGHT]: 'i-line-md:sunny-filled',
  [ThemeModeEnum.DARK]: 'i-line-md:moon-filled',
  [ThemeModeEnum.SYSTEM]: 'i-carbon:contrast',
}

const texts: Record<ThemeModeEnum, string> = {
  [ThemeModeEnum.LIGHT]: 'theme.themeMode.light',
  [ThemeModeEnum.DARK]: 'theme.themeMode.dark',
  [ThemeModeEnum.SYSTEM]: 'theme.themeMode.system',
}

const themeModeRaw = computed({
  get: () => app.ThemeModeRaw,
  set: val => app.setThemeMode(val),
})

/** Main column reverse color 主栏反转颜色 */
const mainMenuInverted = computed({
  get: () => app.MenuSetting.mainMenu.inverted,
  set: val => app.setMenuSetting({ mainMenu: { inverted: val } }),
})

const drawerActive = ref(false)
const show = () => drawerActive.value = true

/** Exposes 公开对象 */
defineExpose({ show })
</script>

<template>
  <a-drawer
    v-model:open="drawerActive" force-render :width="325" :title="t('theme.themeDrawerTitle')"
    :closable="false"
  >
    <a-divider title-placement="left" dashed class="mt-0!">
      {{ t('theme.themeMode.title') }}
    </a-divider>
    <div class="flex-col-stretch gap-16px">
      <div class="i-flex-center">
        <a-radio-group v-model:value="themeModeRaw" button-style="solid" w-full flex>
          <a-radio-button v-for="(_, key) in icons" :key="key" :value="key" flex-1>
            <div flex-y-center items-center>
              <span :class="`${icons[key]} text-icon-small h-23px`" inline-block />
              <span ml-2>{{ t(texts[key]) }}</span>
            </div>
          </a-radio-button>
        </a-radio-group>
      </div>
      <div v-if="app.ThemeModeRaw !== ThemeModeEnum.DARK" m-y-12px flex-y-center gap-8px>
        <span>深色侧边栏</span>
        <a-switch v-model:checked="mainMenuInverted" />
      </div>
    </div>
    <template #extra>
      <a-button type="text" class="px-2" @click="drawerActive = false">
        <div class="i-carbon:close-large" text-5 opacity-65 />
      </a-button>
    </template>
  </a-drawer>
</template>
