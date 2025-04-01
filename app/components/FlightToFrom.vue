<script setup lang="ts">
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~~/server/trpc/routers";

type RouterOutput = inferRouterOutputs<AppRouter>;
type TripOutput = NonNullable<RouterOutput["trips"]["trip"]>;
type CheckinOutput = TripOutput["checkins"][number];

defineProps<{
  airport: string | null;
  flight: CheckinOutput["flight"] | null;
}>();
</script>
<template>
  <span v-if="airport && flight">
    &nbsp;
    <span :class="{ 'line-through': flight.canceled }">
      <span v-if="airport === flight.fromAirport">🛬 {{ flight.toAirport }}</span>
      <span v-if="airport === flight.toAirport">🛫 {{ flight.fromAirport }}</span>
    </span>
  </span>
</template>
