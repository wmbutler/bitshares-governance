<template>
  <div id="main">
    <div id="spacer">
    </div>
    <div id="card">
      <input v-model="baseaccount" placeholder="bitshares account">
      <div id="helptext">
        [Last Irreversible Block {{ last_irreversible_block_num }}]
      </div>
    </div>

    <div v-if="proxies.length > 0" v-for="proxy in proxies">
      <div id="spacer">
          <p>{{ proxy_text }}</p>
      </div>
      <div id="card">
        <div id="proxy">
        <router-link :to="{name: 'Lookup', params: { baseaccount: proxy}}">{{ proxy }}</router-link>
        </div>
      </div>
    </div>

    <div v-if="witnesses_mapped.length > 0">
      <div id="spacer">
      <p>{{ witness_vote_text }}</p>
      </div>
    </div>

    <div id="card" v-if="witness.name" v-for="witness in witnesses_mapped">
      <div id="left_block">
        <span id="notice"><router-link :to="{name: 'Lookup', params: { baseaccount: witness.name}}">{{ witness.name }}</router-link></span>&nbsp;<span>[{{witness.id}}, {{witness.witness_account}}]</span><br>
        <span>Votes: {{ voteDisplay(witness.total_votes) }} Million BTS</span><br>
        <span><a v-if="witness.url.length > 3" v-bind:href="witness.url">{{ witness.url }}</a></span>
        <span v-if="witness.url.length <= 3">No witness infomation provided</a></span>
      </div>
      <div id="right_block">
        <span id="notice">Blocks Behind: <a target="witnessLog" v-bind:href="witnessLog(witness.name)">{{ blocksBehind(witness.blocks_behind) }}</a></span><br>
        <span>Last Confirmed Block&nbsp;{{ witness.last_confirmed_block_num }}</span><br>
        <span>Blocks Missed: {{ witness.total_missed }}</span>
      </div>
    </div>
    {{ message }}
    <div v-if="errors.length > 0">
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import _ from 'lodash';

function isWitness(voteId) {
  const filter = /^1.*$/;
  return filter.test(voteId);
}

export default {

  created() {
    // console.log(this.$route);
    this.baseaccount = this.$route.params.baseaccount;
  },

  data: () => ({
    proxyUrl: 'http://bts.butler.net:9000',
    accounts: [],
    name: '',
    baseaccount: '',
    last_irreversible_block_num: 0,
    voting_account: false,
    votes: [],
    message: '',
    witnesses: [],
    witnesses_mapped: [],
    proxies: [],
    proxy_text: 'proxies to',
    witness_vote_text: 'votes for witnesses',
    errors: [],

    voteDisplay: ((votes) => {
      return Math.round((votes / 100000000000) * 1000) / 1000;
    }),

    witnessLog: ((witness) => {
      return 'https://roelandp.nl/bitshareswitnesslog/?witness=' + witness;
    }),

    blocksBehind: ((blocks) => {
      let result = 0;
      if (blocks > 0) {
        result = blocks;
      }
      return result;
    }),
  }),

  beforeRouteUpdate(to, from, next) {
    this.baseaccount = to.params.baseaccount;
    console.log(to, from);
    next();
  },

  watch: {

    // last_irreversible_block_num: function lastIrreversibleBlockNum() {
    //   this.begin();
    // },

    baseaccount: function baseAccount() {
      this.last_irreversible_block_num = 0;
      this.begin();
    },

    voting_account: function votingAccount() {
      if (this.voting_account !== 'missing') {
        this.getDynamicGlobalProperties();
      }
      if (this.voting_account === 'missing') {
        console.log('0', this.voting_account, this.name);
        this.message = 'This is not an active/valid account.';
      } else if (this.votes.length === 0 && this.voting_account === '1.2.5' && this.name === this.baseaccount) {
        console.log('1', this.name);
        this.message = 'This account is not voting or proxying votes.';
      } else if (this.voting_account && this.voting_account !== '1.2.5') {
        console.log('2', this.voting_account, this.name, this.baseaccount);
        this.getAccounts();
      } else {
        console.log('3', this.voting_account, this.name);
        this.getWitnesses();
      }
    },

    witnesses: function witnesses() {
      this.matchAccounts();
    },
  },

  methods: {

    begin: function begin() {
      console.log('begin');
      this.proxies = [];
      this.accounts = [];
      this.votes = [];
      this.voting_account = false;
      this.witnesses = [];
      this.witnesses_mapped = [];
      this.proxies = [];
      this.errors = [];
      this.message = '';
      this.$router.push({ name: 'Lookup', params: { baseaccount: this.baseaccount } });
      this.name = this.baseaccount;
      this.getAccountByName();
    },

    getWitnesses: function getWitnesses() {
      axios.post(this.proxyUrl, {
        data: {
          jsonrpc: '2.0',
          method: 'lookup_vote_ids',
          params: [this.votes],
          id: 1,
        },
      })
      .then((response) => {
        this.witnesses = response.data.result.map((payload) => {
          if (payload.witness_account) {
            const witness = payload;
            witness.blocks_behind = this.last_irreversible_block_num - payload.last_confirmed_block_num;
            return witness;
          }
          return {};
        });
      })
      .catch((e) => { this.errors.push(e); });
    },

    getAccountByName: function getAccountByName() {
      console.log('getAccountByName');
      axios.post(this.proxyUrl, {
        data: {
          jsonrpc: '2.0',
          method: 'get_account_by_name',
          params: [this.name],
          id: 1,
        },
      })
      .then((response) => {
        if (response.data.result) {
          this.voting_account = response.data.result.options.voting_account;
          this.votes = response.data.result.options.votes.filter(isWitness);
        } else {
          this.voting_account = 'missing';
        }
      })
      .catch((e) => {
        this.errors.push(e);
      });
    },

    getAccounts: function getAccounts() {
      axios.post(this.proxyUrl, {
        data: {
          jsonrpc: '2.0',
          method: 'get_accounts',
          params: [[this.voting_account]],
          id: 1,
        },
      })
      .then((response) => {
        this.name = response.data.result[0].name;
        if (this.name !== this.baseaccount) {
          this.proxies.push(this.name);
        }
        this.voting_account = response.data.result[0].options.voting_account;
        this.votes = response.data.result[0].options.votes.filter(isWitness);
      })
      .catch((e) => { this.errors.push(e); });
    },

    getDynamicGlobalProperties: _.debounce(
      function getDynamicGlobalProperties() {
        console.log('getDynamic');
        axios.post(this.proxyUrl, {
          data: {
            jsonrpc: '2.0',
            method: 'get_dynamic_global_properties',
            id: 1,
          },
        })
        .then((response) => {
          this.last_irreversible_block_num = response.data.result.last_irreversible_block_num;
        })
        .catch((e) => { this.errors.push(e); });
      },
      300,
    ),

    matchAccounts: function matchAccounts() {
      console.log('end');
      const accounts = this.witnesses.map((payload) => {
        return payload.witness_account;
      });
      // console.log(accounts);
      axios.post(this.proxyUrl, {
        data: {
          jsonrpc: '2.0',
          method: 'get_accounts',
          params: [accounts],
          id: 1,
        },
      })
      .then((response) => {
        let count = -1;
        const foo = [];
        this.witnesses_mapped = response.data.result.map((payload) => {
          count += 1;
          foo.push(this.witnesses[count]);
          foo[count].name = payload.name;
          return foo[count];
        });
      })
      .catch((e) => { this.errors.push(e); });
    },
  },
};

</script>

<style>
#main {
  clear: left;
  margin-top: -30px;
}
#spacer {
  height: 50px;
  margin: 0 auto;
}
#card {
  position: relative;
  width: 85%;
  height: 70px;
  border: solid;
  border-width: 1px;
  background-color: #F3F6FB;
  border-color: #DFE2E7;
  margin: 0 auto;
}

input {
  position: absolute;
  text-align: center;
  font-size: 1.6em;
  float: left;
  margin: 0 auto;
  transform: translate(-50%, 70%);
  /*z-index: 1000000;*/
}

#helptext {
  clear: both;
  font-size: .65em;
  margin: 0 auto;
  padding: 5px;
}

#left_block {
  position: absolute;
  left: 0px;
  font-size: .75em;
  width: 50%;
  text-align: left;
  margin: 5px 0px 5px 15px;
}

#right_block {
  position: absolute;
  right: 0px;
  font-size: .75em;
  width: 50%;
  text-align: right;
  margin: 5px 15px 5px 0px;
  
}

#notice {
  font-size: 1.6em;
  margin: 0 auto;
}

p {
  margin: 0 auto;
  transform: translate(0, 65%);
  color: #AAAAAA;
}

a:link {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

#proxy {
  position: relative;
  text-align: center;
  font-size: 3em;
  margin: 0 auto;
}



</style>
