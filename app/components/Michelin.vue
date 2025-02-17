<script setup lang="ts">
import { Prisma } from "@prisma/client";

const props = defineProps<{
  restaurant: Prisma.restaurantGetPayload<{ select: { url: true, award: true } }> | null;
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
