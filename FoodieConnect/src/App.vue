<template>
  <div id="app">
    <Sidebar />
    <div class="main-content">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
</script>

<style>
#app {
  display: grid;
  grid-template-columns: 220px 1fr; 
  min-height: 100vh;
}

.main-content {
  flex-grow: 1;
  padding: 20px;
}
</style>