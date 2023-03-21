import { defineStore } from "pinia";
import { UploadFile } from "element-plus";

export const useAudioStore = defineStore("audio", {
  state: () => ({
    fileStatus: 0,
    preparedStatus: false,
    playStatus: false,
    context: null as unknown as AudioContext,
    gainNode: null as unknown as GainNode,
    dataSource: null as unknown as AudioBufferSourceNode,
    decodedBuffer: null as unknown as AudioBuffer,
  }),
  getters: {},
  actions: {
    upload(input: UploadFile) {
      let file = input.raw as Blob;
      // 读取音频文件.mp3
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      if (this.fileStatus) {
        this.playStatus = false;
        this.preparedStatus = false;
        this.dataSource.stop();
      }
      reader.onload = async (evt) => {
        // 编码过的音频数据
        const encodedBuffer = reader.result as ArrayBuffer;
        // 下面开始处理读取到的音频数据
        // 创建环境对象
        const context = new AudioContext();
        this.context = context;
        // 解码
        await context.decodeAudioData(encodedBuffer, (decodedBuffer) => {
          this.decodedBuffer = decodedBuffer;
        });
        this.fileStatus++;
        this.preparedStatus = true;
      };
    },
    connectDataSource() {
      // 下面开始处理读取到的音频数据
      // 创建数据缓存节点
      const dataSource = this.context.createBufferSource();
      // 加载缓存
      dataSource.buffer = this.decodedBuffer;
      // 连接播放器节点destination，中间连接音量调节节点createGain()，
      const gainNode = this.context.createGain();
      dataSource.connect(gainNode);
      gainNode.connect(this.context.destination);
      dataSource.onended = () => {
        this.playStatus = false;
      }; //播放完毕后切换按钮形态
      this.dataSource = dataSource;
      this.gainNode = gainNode;
    },
    play() {
      //console.log(this.context.state);
      this.preparedStatus = false;
      // 开始播放
      if (this.context.state === "suspended") {
        this.context.resume();
      } else {
        this.connectDataSource();
        this.dataSource.start();
      }
      this.playStatus = true;
      this.gainNode.gain.setValueCurveAtTime(
        [0, 1],
        this.context.currentTime + 0,
        1
      ); //平滑开启
      setTimeout(() => {
        this.preparedStatus = true;
      }, 1000);
    },
    pause() {
      this.preparedStatus = false;
      this.playStatus = false;
      this.gainNode.gain.setValueCurveAtTime(
        [1, 0],
        this.context.currentTime + 0,
        1
      ); //平滑关闭
      setTimeout(() => {
        this.context.suspend();
        this.preparedStatus = true;
      }, 1000);
    },
    sampling() {
      let data = [];
      let originData = this.decodedBuffer.getChannelData(0); //取一条通道的数据
      // 存储所有的正数据
      let positives = [];
      // 存储所有的负数据
      let negatives = [];
      // 先取10000条数据
      let interval = Math.floor(originData.length / 10000);
      for (let i = 0; i < originData.length; i += interval) {
        data.push(originData[i]);
      }
      // 再从data中每10条取一个最大值一个最小值
      for (let j = 0, len = data.length / 10; j < len; j++) {
        let temp = data.slice(j * 10, (j + 1) * 10);
        positives.push(Math.max.apply(null, temp));
        negatives.push(Math.min.apply(null, temp));
      }
      return { positives, negatives };
    },
  },
});
