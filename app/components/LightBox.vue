<script setup lang="ts">
import { onKeyStroke } from "@vueuse/core";
import { ref } from "vue";

const props = defineProps<{ images: string[] }>();

const open = ref(false);
const index = ref(0);

const showImage = (i: number) => {
  index.value = i;
  open.value = true;
};

const nextImage = () => {
  index.value = (index.value + 1) % props.images.length;
};

const prevImage = () => {
  index.value = (index.value - 1 + props.images.length) % props.images.length;
};

onKeyStroke("ArrowLeft", () => open.value && prevImage());
onKeyStroke("ArrowRight", () => open.value && nextImage());
onKeyStroke("Escape", () => (open.value = false));
</script>

<template>
  <div v-if="images.length" class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
    <UModal v-model:open="open" fullscreen :close="false">
      <UButton
        v-for="(image, i) in images"
        :key="image"
        variant="ghost"
        class="p-0 hover:opacity-80"
        @click="showImage(i)"
      >
        <SiteImage
          width="352"
          height="264"
          sizes="352px sm:272px md:219px lg:224px xl:288px 2xl:352px"
          :src="image"
          class="rounded-lg"
        />
      </UButton>

      <template #body>
        <div class="relative mx-auto flex h-full items-center">
          <SiteImage
            :src="images[index]"
            class="mx-auto my-auto h-full max-h-max w-full max-w-max rounded-lg object-contain"
          />

          <UButton icon="i-heroicons-x-mark" variant="solid" class="absolute top-4 right-4" @click="open = false" />

          <UButton
            icon="i-heroicons-chevron-left"
            variant="solid"
            class="absolute top-1/2 left-4 -translate-y-1/2"
            @click="prevImage"
          />

          <UButton
            icon="i-heroicons-chevron-right"
            variant="solid"
            class="absolute top-1/2 right-4 -translate-y-1/2"
            @click="nextImage"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
