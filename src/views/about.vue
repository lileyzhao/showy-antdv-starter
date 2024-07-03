<script setup lang="ts">
import { computed } from 'vue'
import { theme as ATheme } from 'ant-design-vue'
import { useAppStore } from '@/store/modules/app'
import pkg from '@/../package.json'

const app = useAppStore()

const { t } = useI18n()
const { token } = ATheme.useToken()

const column = computed(() => (app.isMobile ? 1 : 2))

interface PkgJson {
  name: string
  version: string
  website?: string
  dependencies: PkgVersionInfo[]
  devDependencies: PkgVersionInfo[]
}

interface PkgVersionInfo {
  name: string
  version: string
}

const { name, version, dependencies, devDependencies } = pkg

function transformVersionData(tuple: [string, string]): PkgVersionInfo {
  const [$name, $version] = tuple
  return {
    name: $name,
    version: $version,
  }
}

const pkgJson: PkgJson = {
  name,
  version,
  dependencies: Object.entries(dependencies).map(item => transformVersionData(item)),
  devDependencies: Object.entries(devDependencies).map(item => transformVersionData(item)),
}

const latestBuildTime = BUILD_TIME
</script>

<template>
  <a-card content-class="!p-8px" :bordered="false">
    <a-space direction="vertical" :size="14" w-full>
      <a-card :title="t('page.about.title')" :bordered="false" size="small" segmented class="card-wrapper">
        <p>{{ t('page.about.introduction') }}</p>
      </a-card>
      <a-card :title="t('page.about.projectInfo.title')" :bordered="false" size="small" segmented class="card-wrapper">
        <a-descriptions label-placement="left" bordered size="small" :column="column">
          <a-descriptions-item :label="t('page.about.projectInfo.version')">
            <a-tag :color="token.colorPrimary" b-rd-sm px-2 py-0.6 text-4 opacity-85>
              {{ pkgJson.version }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item :label="t('page.about.projectInfo.latestBuildTime')">
            <a-tag :color="token.colorPrimary" b-rd-sm px-2 py-0.6 text-4 opacity-85>
              {{ latestBuildTime }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item :label="t('page.about.projectInfo.githubLink')">
            <a
              :style="`color:${token.colorPrimary}`" :href="pkg.homepage" target="_blank"
              rel="noopener noreferrer"
            >
              {{ t('page.about.projectInfo.githubLink') }}
            </a>
          </a-descriptions-item>
          <a-descriptions-item :label="t('page.about.projectInfo.previewLink')">
            <a :style="`color:${token.colorPrimary}`" :href="pkg.website" target="_blank" rel="noopener noreferrer">
              {{ t('page.about.projectInfo.previewLink') }}
            </a>
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
      <a-card :title="t('page.about.prdDep')" :bordered="false" size="small" segmented class="card-wrapper">
        <a-descriptions label-placement="left" bordered size="small" :column="column">
          <a-descriptions-item v-for="item in pkgJson.dependencies" :key="item.name" :label="item.name">
            {{ item.version }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
      <a-card :title="t('page.about.devDep')" :bordered="false" size="small" segmented class="card-wrapper">
        <a-descriptions label-placement="left" bordered size="small" :column="column">
          <a-descriptions-item v-for="item in pkgJson.devDependencies" :key="item.name" :label="item.name">
            {{ item.version }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
    </a-space>
  </a-card>
</template>

<style scoped></style>
