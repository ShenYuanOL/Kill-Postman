<template>
  <v-app :theme="theme">
    <v-navigation-drawer class="bg-deep-purple" permanent rail>
      <v-list class="py-0" color="transparent">
        <v-menu location="end">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" link prepend-icon="mdi-view-dashboard" title="Dashboard"></v-list-item>
          </template>

          <v-list class="py-0" density="compact">
            <v-list-item v-for="(item, index) in items" :key="index" :value="index" class="px-3 py-1">
              <v-list-item-title class="text-subtitle-2">{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-divider></v-divider>
        <v-list-item link prepend-icon="mdi-connection" title="Account" color="pink-lighten-2" to="/"></v-list-item>
        <v-list-item link prepend-icon="mdi-cog" title="Admin" color="pink-lighten-2" to="/settings"></v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'" size="small"
            class="bg-transparent" @click="onClick"></v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main class="h-screen">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>
<script setup>
import { ref } from 'vue';
const theme = ref('light');

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
}

const items = [
  { title: '项目名称' },
  { title: '项目名称' },
  { title: '项目名称' },
  { title: '项目名称' },
];
</script>
<style>
/* 全局样式 */
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  /* 防止整个页面滚动，让v-main处理滚动 */
}

#app {
  height: 100%;
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 0px;
  /* height: 8px; */
}

/* ::-webkit-scrollbar-track {
  background: #ffffff;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
} */
</style>
