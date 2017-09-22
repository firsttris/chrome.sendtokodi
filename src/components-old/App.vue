<template>
  <div class="routing">
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
    -webkit-touch-callout: none;
    -webkit-user-select: none;
  }
  .nav {
    margin-bottom: 10px;
  }
</style>
<style lang="css" src="./../../node_modules/bootstrap/dist/css/bootstrap.css">
</style>
<style lang="css" src="./../../node_modules/font-awesome/css/font-awesome.css">
</style>