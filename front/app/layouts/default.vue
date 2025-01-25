<template>
  <div class="flex min-h-screen flex-col">
    <div class="pb-12">
      <div class="container mx-auto px-10">
        <div class="py-4 print:hidden"><Header /></div>
        <slot />
      </div>
    </div>
    <div class="flex-1 bg-[var(--ui-bg-inverted)] py-12 text-[var(--ui-text-inverted)] print:hidden">
      <div class="container mx-auto px-10"><Footer /></div>
    </div>
  </div>
</template>
