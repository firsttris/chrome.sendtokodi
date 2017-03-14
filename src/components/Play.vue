<template>
  <div class="sendToKodi container">
    <h1>{{ link }}</h1>
    <p>
    <input v-model="link">
    </p>
    <p>
    <button type="submit" class="btn btn-secondary">SendToKodi</button>
    </p>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        link: 'www.link!'
      };
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1 {
    color: #42b983;
  }
  .sendToKodi {
    text-align: center;
  }
</style>