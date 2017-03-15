<template>
  <div class="sendToKodi container">
    <h1>SendToKodi</h1>
    <p>
    <input v-model="link">
    </p>
    <p>
    <button type="submit" class="btn btn-secondary" v-on:click="sendURL">SendToKodi</button>
    </p>
  </div>
</template>

<script>
  import axios from 'axios';
  export default {
    data () {
      return {
        link: ''
      };
    },
    methods: {
      sendURL: function () {
        chrome.storage.sync.get(['credentials'], (result) => {
          if(!result || !result.credentials || result.credentials.ip === '') {
            alert("Please enter ip address and credentials of kodi")
          }
          const url = 'http://'+result.credentials.user+':'+result.credentials.pw+'@'+result.credentials.ip+':'+result.credentials.port+'/jsonrpc';
          console.log("Endpoint: "+url);
          axios.post(url, {
            'jsonrpc': '2.0',
            'method': 'Player.Open',
            'params': {
              'item': {
                'file': 'plugin://plugin.video.sendtokodi/?'+this.link
              }
            },
            'id': 1
          })
            .then(function (response) {
              console.log(response);
            })
            .catch(function (error) {
              console.log(error);
            });
        });
      }
    },
    created: function () {
      chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
        this.link = tabs[0].url;
      });
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1 {
    color: #e74c3c;
  }
  .sendToKodi {
    text-align: center;
  }
</style>