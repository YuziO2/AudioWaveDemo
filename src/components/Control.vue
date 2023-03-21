<template>
  <div>
    <el-button v-if="!audioStore.playStatus" :icon="VideoPlay" size="large" circle @click="playClick"
      :disabled="!audioStore.preparedStatus" />
    <el-button v-else :icon="VideoPause" size="large" circle @click="stopClick" :disabled="!audioStore.preparedStatus" />
  </div>
</template>

<script lang="ts" setup>
import { VideoPlay, VideoPause } from "@element-plus/icons-vue";
import { useAudioStore } from "../store/audio";

const audioStore = useAudioStore();

function playClick() {
  //点击播放
  audioStore.play();
}
function stopClick() {
  //停止播放
  audioStore.pause();
}
</script>
