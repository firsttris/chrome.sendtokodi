<template>
    <div class="fields container">
        <div class="form-group row">
            <label for="example-text-input" class="col-2 col-form-label">IP</label>
            <div class="col-10">
                <input v-model="ip" class="form-control" type="text" placeholder="IP Adress" id="example-text-input">
            </div>
        </div>
        <div class="form-group row">
            <label for="example-search-input" class="col-2 col-form-label">Port</label>
            <div class="col-10">
                <input v-model="port" class="form-control" type="search" placeholder="Port" id="example-search-input">
            </div>
        </div>
        <div class="form-group row">
            <label for="example-email-input" class="col-2 col-form-label">Login</label>
            <div class="col-10">
                <input v-model="user" class="form-control" type="email" placeholder="Login" id="example-email-input">
            </div>
        </div>
        <div class="form-group row">
            <label for="example-url-input" class="col-2 col-form-label">Pass</label>
            <div class="col-10">
                <input v-model="pw" class="form-control" type="url" placeholder="Pass" id="example-url-input">
            </div>
        </div>
        <button type="submit" class="btn btn-secondary" v-on:click="saveSettings">Save</button>
    </div>

</template>

<script>
  export default {
    data () {
      return {
        ip: '',
        port: '',
        user: '',
        pw: ''
      };
    },
    methods: {
      saveSettings: function () {
        const credentials = { ip: this.ip, port: this.port, user: this.user, pw: this.pw };
        chrome.storage.sync.set({ "credentials": credentials }, () => {
        });
      }
    },
    created: function () {
      chrome.storage.sync.get(["credentials"], (result) => {
        this.ip = result.credentials.ip;
        this.port = result.credentials.port;
        this.user = result.credentials.user;
        this.pw = result.credentials.pw;
      });
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .btn {
        margin-bottom: 10px;
    }
</style>