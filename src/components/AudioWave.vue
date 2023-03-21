<template>
  <div>
    <canvas id="canvas"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useAudioStore } from "../store/audio";
const audioStore = useAudioStore();

function draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  let { positives, negatives } = audioStore.sampling();
  let height = 200,
    width = 1000;
  canvas.width = positives.length * devicePixelRatio;
  //canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;
  canvas.style.width = positives.length + "px";
  canvas.style.height = height + "px";
  let x = 0;
  let y = 100 * devicePixelRatio;
  let offset = 0;
  ctx.fillStyle = "#fa541c";
  ctx.beginPath();
  ctx.moveTo(x, y);
  // canvas高度200，横坐标在canvas中点100px的位置，横坐标上方绘制正数据，下方绘制负数据
  // 先从左往右绘制正数据
  for (let k = 0; k < positives.length; k++) {
    ctx.lineTo(
      x + k * devicePixelRatio,
      y - 100 * devicePixelRatio * positives[k]
    );
  }

  // 再从右往左绘制负数据
  for (let l = negatives.length - 1; l >= 0; l--) {
    ctx.lineTo(
      x + l * devicePixelRatio,
      y + 100 * devicePixelRatio * Math.abs(negatives[l])
    );
  }
  // 填充图形
  ctx.fill();
}

onMounted(() => {
  let canvas = document.getElementById("canvas") as HTMLCanvasElement;
  let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  let fileStatus = audioStore.fileStatus;
  setInterval(() => {
    if (fileStatus != audioStore.fileStatus) {
      draw(canvas, ctx);
      fileStatus = audioStore.fileStatus;
    }
  }, 2500);
});
</script>

<style scoped></style>
