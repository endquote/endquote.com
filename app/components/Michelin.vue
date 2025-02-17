<script setup lang="ts">
import type { restaurant } from '@prisma/client';

const props = defineProps<{
  restaurant: restaurant | null;
}>();

</script>
<template>
  <span v-if="restaurant && restaurant.award != 'selected'">
    <NuxtLink :href="restaurant.url">
      <span v-if="restaurant.award == 'ONE_STAR'">
        <UIcon name="tabler:michelin-star" class="size-5" />
      </span>
      <span v-if="restaurant.award == 'TWO_STARS'">
        <UIcon name="tabler:michelin-star" class="size-5" />
        <UIcon name="tabler:michelin-star" class="size-5" />
      </span>
      <span v-if="restaurant.award == 'THREE_STARS'">
        <UIcon name="tabler:michelin-star" class="size-5" />
        <UIcon name="tabler:michelin-star" class="size-5" />
        <UIcon name="tabler:michelin-star" class="size-5" />
      </span>
      <span v-if="restaurant.award == 'BIB_GOURMAND'">
        <UIcon name="tabler:michelin-bib-gourmand" class="size-5" />
      </span>
    </NuxtLink>
  </span>
</template>
