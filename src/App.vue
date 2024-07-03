<script setup lang="ts">
import { theme as ATheme } from 'ant-design-vue'
import type { SizeType } from 'ant-design-vue/es/config-provider'
import { useAppStore } from '@/store/modules/app'
import { getAntdvLocale } from '@/modules/i18n'

const app = useAppStore()
const locale = computed(() => getAntdvLocale(app.LocaleSetting.locale))

const componentSize = ref<SizeType>('middle') // small middle large

const data = ref({
  borderRadius: 4,
  colorPrimary: '#646CFF',
})

const { token } = ATheme.useToken()
</script>

<template>
  <a-config-provider
    :locale="locale" :component-size="componentSize"
    :theme="{ token: { colorPrimary: data.colorPrimary, borderRadius: data.borderRadius }, algorithm: app.IsDarkMode ? ATheme.darkAlgorithm : ATheme.defaultAlgorithm }"
  >
    <a-style-provider hash-priority="high">
      <a-app>
        <router-view />
      </a-app>
    </a-style-provider>
  </a-config-provider>
</template>

<style>
html[data-theme='dark'] .ant-layout-header,
html[data-theme='dark'] .ant-layout-sider,
html[data-theme='dark'] .ant-menu,
html[data-theme='dark'] .ant-drawer-content {
  background-color: #000 !important;
}
</style>

<style scoped lang="scss">
input[type='color'] {
  border: 1px solid v-bind('token.colorBorder');
  background-color: v-bind('token.colorBgBase');
}
</style>
