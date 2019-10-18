<template>
  <div id="title-bar">
    <v-img
      :src="logo"
      height="34"
      contain
    />
    <div id="title">AD Trading Inventory Management System</div>
    <div id="title-bar-btns">
      <button @click="windowsControl(0)" id="min-btn">&#xE921;</button>
      <button @click="windowsControl(1)" id="max-btn">&#xE922;</button>
      <button @click="windowsControl(2)" id="close-btn">&#xE8BB;</button>
    </div>
  </div>
</template>

<script>
  let remote = require('electron').remote;
  let {BrowserWindow} = require('electron').remote; 
  const electron = require('electron');
  let {ipcRenderer} = electron;
  export default {
    data: () => ({
      logo: './img/ADTrading.png'
    }),
    methods:{
      windowsControl(index){
        if(index == 0){
          let window = BrowserWindow.getFocusedWindow();
          window.minimize(); 
        }else if(index == 1){
          ipcRenderer.send('resize', 1250, 700);
        }else if(index == 2){
          let window = BrowserWindow.getFocusedWindow();
          window.close();
        }
      }
    }
  }
</script>

<style scoped>
  #title-bar {
    -webkit-app-region: drag;
    flex: 0 0 32px; 
    width: 100%;
    font-size: 12px;
    color: #eee;
    background-color: #424242;
    z-index: 4;
  }
  
  .v-image {
    position: absolute;
    height: 30px !important;
    width: 50px;
    left: -5px;
    top: 2px;
  }

  #title {
    text-align: center;
    margin-top: 8px;
  }

  #title-bar-btns {
    font-family: "Segoe MDL2 Assets";
    -webkit-app-region: no-drag;
    top: 0px;
    right: 0px;
    position: absolute;
  }

  #title-bar-btns button{
    width: 46px;
    height: 32px;
    z-index: 999;
    font-size: 10px;
  }

  #close-btn:hover{
    background-color: #F44336;
    cursor: initial;
  }

  #title-bar-btns button:hover:not(#close-btn){
    background-color: rgb(192, 192, 192);
    cursor: initial;
  }
</style>