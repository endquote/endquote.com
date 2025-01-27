<script setup lang="ts">
import { useDateFormat } from "@vueuse/core";

const page = (await useAsyncData(() => queryCollection("content").where("path", "=", "/trips").first())).data.value!;
const trips = (await useAsyncData(() => queryCollection("trips").order("start", "DESC").all())).data.value!;
useSiteHead(page);

const fmt = "YYYY-MM-DD";
</script>

<template>
  <div class="prose-custom">
    <ContentRenderer v-if="page" :value="page" />
  </div>
  <div class="prose-custom">
    <ul>
      <li v-for="trip in trips" :key="trip.id">
        {{ useDateFormat(trip.checkins[0]?.date, fmt) }} -
        {{ useDateFormat(trip.checkins[trip.checkins.length - 1]?.date, fmt) }}
        <ul>
          <li v-for="checkin in trip.checkins" :key="checkin.eqId">
            {{ useDateFormat(checkin.date, fmt) }} - {{ checkin.venue.name }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
