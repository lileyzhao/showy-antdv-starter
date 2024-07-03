<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import ActionIcon from '@/layout/components/ActionIcon.vue'

const { t } = useI18n()
const router = useRouter()
const app = useAppStore()

const model = ref({ account: 'admin', password: 'admin' })

const onLogin = () => router.push('/')
</script>

<template>
  <div mx-auto mt-30 w-380px>
    <a-card :title="t('login.title')">
      <a-form :model="model">
        <a-form-item path="account" label="账号">
          <a-input v-model="model.account" placeholder="请输入账号" @keydown.enter.prevent />
        </a-form-item>
        <a-form-item path="password" label="密码">
          <a-input v-model="model.password" type="password" placeholder="请输入密码" @keydown.enter.prevent />
        </a-form-item>
        <div flex items-center justify-between>
          <div flex-right-center gap-x-5>
            <ActionIcon
              :icon-class="`i-line-md:${app.IsDarkMode ? 'sunny-filled' : 'moon-filled'}`"
              hover-class-dark="text-yellow" hover-class-light="text-purple" @click="app.toggleThemeMode"
            />
            <ActionIcon v-if="app.LocaleSetting.showButton" i-carbon-language @click="app.toggleLanguage" />
          </div>
          <a-button type="primary" style="width: 120px" danger @click="onLogin">
            登 录
          </a-button>
        </div>
      </a-form>
    </a-card>
  </div>
</template>
