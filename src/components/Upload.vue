<template>
  <el-upload class="upload-demo" ref="upload" drag multiple accept=".mp3" :on-change="readFile" :auto-upload="false"
    :limit="1" :on-exceed="exceed" style="width: 600px">
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      Drop file here or <em>click to upload</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">Accept mp3 file.</div>
    </template>
  </el-upload>
</template>

<script lang="ts" setup>
import { UploadFilled } from "@element-plus/icons-vue";
import {
  genFileId,
  UploadFile,
  UploadInstance,
  UploadRawFile,
  UploadUserFile,
} from "element-plus";
import { ref } from "vue";
import { useAudioStore } from "../store/audio";
const audioStore = useAudioStore();
const upload = ref<UploadInstance>();
function readFile(input: UploadFile) {
  audioStore.upload(input);
}
function exceed(files: File[], uploadFiles: UploadUserFile[]) {
  //新文件顶替旧文件
  upload.value?.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
}
</script>

<style scoped></style>
