<template>
  <div class="min-h-screen bg-gray-50/80">
    <!-- Desktop Sidebar -->
    <AppSidebar
      v-if="isDesktop"
      :collapsed="false"
      :is-mobile="false"
      class="z-50"
    />

    <!-- Main area -->
    <div
      class="flex flex-col min-h-screen transition-all duration-300"
      :style="isDesktop ? 'margin-left: 256px' : ''"
    >
      <!-- Header -->
      <AppHeader />

      <!-- Content -->
      <main
        class="flex-1"
        :class="[
          isMobile ? 'px-4 pt-4 pb-24' : '',
          isTablet ? 'px-6 pt-6 pb-8' : '',
          isDesktop ? 'px-8 pt-6 pb-8' : ''
        ]"
      >
        <transition name="page" mode="out-in">
          <router-view />
        </transition>
      </main>
    </div>

    <!-- Bottom Nav (Mobile) -->
    <BottomNav v-if="isMobile" />
  </div>
</template>

<script setup>
import { useResponsive } from '../composables/useResponsive'
import AppHeader from '../components/common/AppHeader.vue'
import AppSidebar from '../components/common/AppSidebar.vue'
import BottomNav from '../components/common/BottomNav.vue'

const { isMobile, isTablet, isDesktop } = useResponsive()
</script>

