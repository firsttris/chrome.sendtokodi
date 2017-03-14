<template>
  <div class="routing">
    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item" @click="play = true, settings = false">
        <router-link  class="nav-link" v-bind:class="{ active: play }" data-toggle="tab" role="tab" to="/">Play</router-link>
      </li>
      <li class="nav-item" @click="settings = true, play = false">
        <router-link class="nav-link" v-bind:class="{ active: settings }" data-toggle="tab" role="tab" to="/settings">Settings</router-link>
      </li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        play: true,
        settings: false
      };
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  a {
    color: black
  }
  .routing {
    width: 400px;
  }
  .nav {
    margin-bottom: 10px;
  }
</style>
<style lang="css" src="./../../node_modules/bootstrap/dist/css/bootstrap.css">
</style>
<style lang="css" src="./../../node_modules/font-awesome/css/font-awesome.css">
</style>