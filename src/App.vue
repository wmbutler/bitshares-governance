
<template>
  <div id="app">
  <div id="header">
    <div id="logo">
      <img src="./assets/bitshares-logo.png">
    </div>
    <div id="title">
      Bitshares Governance Platform
    </div>
  </div>
    <router-link to="/lookup">[lookup]</router-link>
    <router-link to="/about">[about]</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style>
html {
  overflow-x: hidden;
  padding: 0px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
#header {
  width: 100%;
  height: 60px;
  position: relative;
  top: -8px;
  left: 0px;
  background-color: #F3F6FB;
  border-color: 1px solid #DFE2E7;
  padding: 20px;
}

#logo {
  position: relative;
  float: left;
  top: 50%;
  transform: translate(0, -50%);
}

img {
  width: 35px;
}

#title {
  position: relative;
  font-size: 2em;
  float: left;
  top: 50%;
  transform: translate(0, -31%);
  margin-left: 10px;
}
</style>
