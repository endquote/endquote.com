<script setup lang="ts">
import { Prisma } from "@prisma/client";

const props = defineProps<{
  checkin: Prisma.checkinGetPayload<{
    select: {
      flight: { select: { fromAirport: true, toAirport: true } },
      venue: { select: { name: true } },
    }
  }> | null;
}>();

const code = ref(props.checkin?.venue.name.match(/\(([A-Z]{3})\)/)?.[1]);

</script>
<template>
  <span>
    <span v-if="code === checkin?.flight?.fromAirport">🛬 {{ checkin?.flight?.toAirport }}</span>
    <span v-if="code === checkin?.flight?.toAirport">🛫 {{ checkin?.flight?.fromAirport }}</span>
  </span>
</template>
