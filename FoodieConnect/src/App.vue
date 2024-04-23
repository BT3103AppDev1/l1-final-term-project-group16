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
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex-grow: 1; 
  margin-left: 220px; 
  overflow: auto; 
}

</style>
