<script setup lang="ts">
import type { ButtonType } from 'ant-design-vue/es/button'
import { App } from 'ant-design-vue'
import { useAppStore } from '@/store/modules/app'

const { t } = useI18n()
const app = useAppStore()
const route = useRoute()
const { message } = App.useApp()

const currentTime = ref('00:00:00')

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString()
}

const showModal = ref(false)
// 定义异步组件
const asyncComponent = defineAsyncComponent(() => import('./about.vue'))

const buttonTypes: ButtonType[] = ['primary', 'default', 'dashed', 'link', 'text']

const buttonModels = [{}, { danger: true }, {}, { disabled: true }]
const buttonModelsShuffled: any[][] = []
for (let i = 0; i < buttonTypes.length; i++) {
  buttonModelsShuffled.push(buttonModels.slice())
}

onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
  message.success(app.IsDarkMode ? t('welcome.night') : t('welcome.morning'))
})
</script>

<template>
  <a-card class="m--8px!" :bordered="false" :body-style="{ padding: 0 }">
    <div flex flex-col items-center justify-center gap-y-4 pt-4>
      <div
        :class="`i-line-md:${app.IsDarkMode ? 'moon-filled-loop text-purple' : 'sunny-filled-loop text-yellow'}`"
        text-24
      />
      <div class="time-display">
        {{ currentTime }}
      </div>
      <div text-6>
        {{ app.IsDarkMode ? t('welcome.night') : t('welcome.morning') }}
      </div>
      <div decoration-underline>
        {{ route?.path }}
      </div>
      <a-space>
        <a-date-picker type="date" w-48 />
        <a-time-picker w-48 />
      </a-space>
      <a-space v-for="(bt, bti) in buttonTypes" :key="bti">
        <a-button v-for="(bm, bmi) in buttonModelsShuffled[bti]" :key="bmi" class="w-23!" :type="bt" v-bind="bm">
          Button
        </a-button>
      </a-space>
    </div>
    <div class="h-380vh flex flex-col items-center justify-end pb-4 text-4">
      ... {{ t('intro') }} ...
    </div>
    <a-modal v-model:open="showModal" style="top: 20px" width="70%" :footer="null">
      <component :is="asyncComponent" />
    </a-modal>
  </a-card>
</template>

<style scoped lang="scss">
@import '../assets/styles/_fonts.scss';

.time-display {
  font-family: 'DSEG7ModernMini', sans-serif;
  font-size: 2rem;
  font-weight: bold;
}
</style>
