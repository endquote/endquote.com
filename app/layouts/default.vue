<script setup lang="ts">
import SiteFooter from "~/components/SiteFooter.vue";
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <div class="pb-12">
      <div class="container mx-auto px-10">
        <div class="py-4 print:hidden"><SiteHeader /></div>
        <slot />
      </div>
    </div>
    <div class="flex-1 bg-[var(--ui-bg-inverted)] py-12 text-[var(--ui-text-inverted)] print:hidden">
      <div class="container mx-auto px-10"><SiteFooter /></div>
    </div>
  </div>
</template>
