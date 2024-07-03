<script setup lang="ts" name="Layout-Logo">
import { theme as ATheme } from 'ant-design-vue'

const props = defineProps({ hideLogo: Boolean, hideTitle: Boolean })

const { t } = useI18n()
const { token } = ATheme.useToken()

const mainClass = computed(() => !props.hideTitle ? 'pl-4' : 'flex-x-center')
const titleClass = computed(() => !props.hideLogo ? 'p-l-2.5' : '')
</script>

<template>
  <div h-header of-hidden :class="mainClass" :style="`color:${token.colorPrimary}`">
    <div h-full flex>
      <div v-if="!props.hideLogo" type="text" h-full inline-flex-center>
        <span i-carbon:wind-gusts font-size-8 />
      </div>
      <div v-if="!props.hideTitle" type="text" :class="titleClass" h-full inline-flex-center>
        <span pt-1 text-nowrap font-size-4 font-bold>{{ t('team') }}</span>
      </div>
    </div>
  </div>
</template>
