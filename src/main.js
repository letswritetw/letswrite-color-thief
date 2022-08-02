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

    // Demo1
    async getDemo1() {
      const demo1 = document.getElementById('demo-1');

      await this.waitImageLoad(demo1);

      this.demo1.main = this.colorThief.getColor(demo1);
      this.demo1.palette = this.colorThief.getPalette(demo1);
      console.log(this.demo1);
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
        this.custom.main = this.colorThief.getColor(img);
        this.custom.palette = this.colorThief.getPalette(img);
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