<script setup lang="ts">

import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '~~/server/api/trpc/[trpc]';

type RouterOutput = inferRouterOutputs<AppRouter>
type TripOutput = NonNullable<RouterOutput['trip']>
type CheckinOutput = TripOutput['checkins'][number]

const props = defineProps<{ checkin: CheckinOutput | null }>()

const code = ref(props.checkin?.venue.name.match(/\(([A-Z]{3})\)/)?.[1]);

</script>
<template>
  <span v-if="checkin && checkin.flight">
    &nbsp;
    <span :class="{ 'line-through': checkin.flight.canceled }">
      <span v-if="code === checkin.flight.fromAirport">🛬 {{ checkin.flight.toAirport }}</span>
      <span v-if="code === checkin.flight.toAirport">🛫 {{ checkin.flight.fromAirport }}</span>
    </span>
  </span>
</template>
