<script setup lang="ts">
import Hls from "hls.js";
import { onMounted, ref, watch } from "vue";
const img = useImage();

const props = defineProps({
  playlist: {
    type: String,
    required: true,
  },
  skip: {
    type: Number,
    default: 0,
  },
  autoPlay: {
    type: Boolean,
    default: false,
  },
  poster: {
    type: String,
    default: "",
  },
  audio: {
    type: Boolean,
    default: true,
  },
});

const video = ref<HTMLVideoElement | null>(null);
const playing = ref(false);

const playVideo = () => {
  if (video.value) {
    playing.value = true;
    video.value.play();
  }
};

const initVideo = () => {
  if (props.skip > 0) {
    video.value!.currentTime = props.skip;
  }
  if (props.autoPlay) {
    playVideo();
  }
};

onMounted(() => {
  if (!video.value) {
    return;
  }
  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(props.playlist);
    hls.attachMedia(video.value);
    hls.on(Hls.Events.MANIFEST_PARSED, () => initVideo());
  } else if (video.value.canPlayType("application/vnd.apple.mpegurl")) {
    video.value.src = props.playlist;
    video.value.addEventListener("loadedmetadata", () => initVideo());
  }
});

watch(
  () => props.playlist,
  (newPath) => {
    if (video.value) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(newPath);
        hls.attachMedia(video.value);
      } else if (video.value.canPlayType("application/vnd.apple.mpegurl")) {
        video.value.src = newPath;
      }
    }
  },
);

const posterLoaded = ref(false);
</script>

<template>
  <div class="aspect-video w-full">
    <video
      v-show="playing"
      ref="video"
      :poster="img(poster, { format: 'webp' })"
      :controls="playing"
      :muted="!audio"
      class="h-auto w-full rounded-lg"
    />
    <div v-if="!playing" class="relative h-auto w-full" @click="playVideo">
      <SiteImage :src="poster" class="h-auto w-full rounded-lg" @load="posterLoaded = true" />
      <div
        class="invisible absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_4px_black]"
        :class="{ visible: posterLoaded }"
      >
        <UIcon name="i-fa-regular-play-circle" class="size-24 text-white" />
      </div>
    </div>
  </div>
</template>
