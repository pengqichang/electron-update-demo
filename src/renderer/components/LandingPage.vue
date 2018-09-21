<template>
  <div id="wrapper">
     <!-- <router-view></router-view> -->
        <button @click="update()">获取更新</button>
        <ol id="content">
          <li>{{tips}}</li>
          <li>{{versionStatus}}</li>
          <li>{{versionCode}}</li>
        </ol>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import { checkVersion } from "./../util"

const appVersion = require("../../../package.json").version;
  export default {
    name: 'landing-page',
    data() {
      return {
        name: "",
          password: "",
          versionCode: "0",
          tips: "",
          showVersionTips: false,
          versionTips: "",
          appVersion: "",
          canCancel: false,
          isTopLevel: false,
          downloadPercent: 0,
      }
    },

    computed: {
        versionStatus: function() {
            switch (this.versionCode) {
                case 0:
                    return "服务器版本错误，请联系开发者";
                case 1:
                    return "最新版本，无需更新！";
                case 2:
                    return "版本即将强制升级！";
                case 3:
                    return "存在新版本，点击立即更新！";
                default:
                    return "版本检查中";
            }
        },
    },

   created() {
        //设置窗口title为当前版本
        document.title = `${document.title}-v${appVersion}`;

        ipcRenderer.on("message", (event, text) => {
            console.log(arguments);
            console.log(event, text, appVersion);
            const latestVersion = text.version;
            console.warn(text);
            console.log(parseFloat(appVersion));
            this.versionCode = checkVersion(appVersion, latestVersion);
             this.tips = text;
        });
        ipcRenderer.on("downloadProgress", (event, progressObj) => {
            console.log('downloadProgress', progressObj);
            this.downloadPercent = progressObj.percent || 0;
        });
        ipcRenderer.on("isUpdateNow", () => {
            ipcRenderer.send("isUpdateNow");
        });
        ipcRenderer.send("checkForUpdate");
    },

    beforeDestroy() {
        //组件销毁前移除所有事件监听channel
        ipcRenderer.removeAllListeners([
            "message",
            "downloadProgress",
            "isUpdateNow",
        ]);
    },

    methods: {
      update() {
        ipcRenderer.send("downloadUpdate");
        console.log(11)
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .doc p {
    color: black;
    margin-bottom: 10px;
  }

  .doc button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }
</style>
