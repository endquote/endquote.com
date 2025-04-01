<script setup lang="ts">
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~~/server/trpc/routers";

type RouterOutput = inferRouterOutputs<AppRouter>;
type TripOutput = NonNullable<RouterOutput["trips"]["trip"]>;
type RestaurantOutput = TripOutput["checkins"][number]["venue"]["restaurant"];

defineProps<{ restaurant: RestaurantOutput | null }>();
</script>
<template>
  <span v-if="restaurant && restaurant.award != 'selected'">
    <span
      >&nbsp;
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
  </span>
</template>
