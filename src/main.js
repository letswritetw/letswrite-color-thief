import "@babel/polyfill";
import ColorThief from './../node_modules/colorthief/dist/color-thief.mjs';

const { createApp } = Vue;
const app = createApp({
  data() {
    return {
      colorThief: null,
      basic: {
        main: null,
        palette: null
      },
      custom: {
        main: null,
        palette: null
      },
      customImg: null
    }
  },
  methods: {

    // 確定圖片載入完成
    waitImageLoad(img) {
      return new Promise((resolve, reject) => {
        let timer;
        timer = () => {
          setTimeout(() => {
            if(img.complete) resolve(true);
            else timer();
          }, 100);
        }
        timer();
      })
    },

    // 轉成六位數色碼
    toHex(colors) {
      let hex = colors.map(x => {
        return x.toString(16);
      }).join('');
      return '#' + hex
    },

    // 排序色碼
    // RGB 顏色加總：0 - 765。數字愈小愈深。
    sortPalette(array) {
      // 建一個空陣列，把調色盤裡的 RGB 存進去，並存一個三數加總的值
      let tempForCalc = [];
      Array.prototype.forEach.call(array, palette => {
        const sum = palette.reduce((a, b) => a + b, 0);
        const item = {
          color: palette,
          sum: sum
        }
        tempForCalc.push(item);
      });

      // 用三數加總的值做 大 -> 小 排序
      const result = tempForCalc.concat().sort((a, b) => {
        return a.sum > b.sum ? -1 : 1;
      });
      return result;
    },

    // 基本使用
    async basicUse() {
      const basic = document.getElementById('basic-use');

      await this.waitImageLoad(basic);

      this.basic.main = await this.colorThief.getColor(basic);
      let tempPalette = await this.colorThief.getPalette(basic);
      this.basic.palette = this.sortPalette(tempPalette);

    },

    // 取得使用者選擇的圖檔，轉成 blob 寫入 img
    async getUploadImgBlob(file) {
      let fileData = file.target.files[0];
      
      this.customImg = window.URL.createObjectURL(fileData);
      
      // 確定 #custom-img 的圖片載入完成
      const img = document.getElementById('custom-img');
      await this.waitImageLoad(img);

      // 執行 colorThief
      this.custom.main = this.colorThief.getColor(img, 5);
      let tempPalette = this.colorThief.getPalette(img, 10, 5);
      this.custom.palette = this.sortPalette(tempPalette);

    },

    // 取得使用者選擇的圖檔，轉成 base64 寫入 img
    async getUploadImgBase64(file) {

      let fileData = file.target.files[0];

      const fileReader = new FileReader();
      fileReader.addEventListener('load', async file => {

        // #custom-img 的 src 換成 base64
        this.customImg = file.target.result;

        // 確定 #custom-img 的圖片載入完成
        const img = document.getElementById('custom-img');
        await this.waitImageLoad(img);

        // 執行 colorThief
        this.custom.main = this.colorThief.getColor(img, 5);
        let tempPalette = this.colorThief.getPalette(img, 10, 5);
        this.custom.palette = this.sortPalette(tempPalette);

      });
      fileReader.readAsDataURL(fileData);

    }

  },
  async mounted() {
    this.colorThief = new ColorThief();
    this.basicUse()
  },
});
app.mount('#app')