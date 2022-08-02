import "@babel/polyfill";
import ColorThief from './../node_modules/colorthief/dist/color-thief.mjs';

const { createApp } = Vue;
const app = createApp({
  data() {
    return {
      colorThief: null,
      demo1: {
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
      let tempForCalc = [];
      Array.prototype.forEach.call(array, palette => {
        const sum = palette.reduce((a, b) => a + b, 0);
        const item = {
          color: palette,
          sum: sum
        }
        tempForCalc.push(item);
      });
      const result = tempForCalc.concat().sort((a, b) => {
        return a.sum > b.sum ? -1 : 1;
      });
      return result;
    },

    // Demo1
    async getDemo1() {
      const demo1 = document.getElementById('demo-1');

      await this.waitImageLoad(demo1);

      this.demo1.main = this.colorThief.getColor(demo1);
      let tempPalette = this.colorThief.getPalette(demo1);
      this.demo1.palette = this.sortPalette(tempPalette);

    },

    // 取得使用者選擇的圖檔，轉成 base64 寫入 img
    getUploadImg(img) {
      let fileData = img.target.files[0];
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
    this.getDemo1()
  },
});
app.mount('#app')