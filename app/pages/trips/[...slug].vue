<script setup lang="ts">
import { useDateFormat } from "@vueuse/core";

// get page and 404 if not found
const route = useRoute();
const { data: page } = await useAsyncData(() => queryCollection("trips").path(route.path).first());
useSiteHead(page.value);


if (!page.value) {
  throw createError({ statusCode: 404 });
}

// merge with trip data
const date = route.params?.slug?.[0]!;

const { $client } = useNuxtApp();
const data = await $client.trip.query({ date });

const fmt = "YYYY-MM-DD";
</script>

<template>
  <div class="prose-custom" v-if="page">
    <ContentRenderer :value="page" />
    <ul>
      <li v-for="checkin in data?.checkins" :key="checkin.eqId">
        {{ useDateFormat(checkin.date, fmt) }} - {{ checkin.venue.name }}
      </li>
    </ul>
  </div>
</template>
