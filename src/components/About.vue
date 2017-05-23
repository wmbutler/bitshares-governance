<template>
  <div id="about">
      <h1>Introduction</h1>
      As a shareholder, you have a say in how bitshares operates. Many decisions are made about the network, improvements to the gui, additional features, worker proposals etc. These are important decisions, but oftentimes, if you are new to an organization, it's difficult to know who is actively involved in making decisions that are in your best interest.
      <h1>What does this tool do?</h1>
      This tool allows you to explore who you are voting for in order to hold those entities accountable. If, for instance, you see that you have cast a vote for a witness who is consistently thousands of blocks behind, do us all a favor and retract your vote. Voting for witnesses who are consistently processing blocks is a good thing. It's the democratic way to ensure that your investment remains sound.
      <h1>Vote or Proxy</h1>
      If you don't care about the voting process or it's too much to comprehend, proxy your vote to someone you trust. I wrote this tool in an effort to increase transparency. Feel free to set your voting proxy to me, <router-link :to="{name: 'Lookup', params: { baseaccount: 'billbutler'}}">billbutler</router-link>, if you trust that I'll cast my votes in a productive manner. If you change your mind at any time, you can proxy to someone else or vote directly for witnesses. Your proxy votes increase the voting power for whomever you choose. A nice trick if you have multiple bitshares accounts is to proxy all your account to a single account that you own and then proxy from that one accout to someone who you trust to ensure that you get the full benefit of your voting power.
      <h1>Why Am I Doing This?</h1>
      I believe in Bitshares. It's an amazing blockchain with real utility. It's a distributed exchange meaning that you can trade cryptocurrencies and derivatives of real-world assets without actually holding that asset, but since everything is actually backed by Bitshares as collateral, the markets are real. My goal is to continually push for a better user experience to make it easier for a more traditional crowd get into the world of crypto trading.
      <h1>What Doesn't this Tool Do?</h1>
      This tool does not allow you to set your proxy vote or vote for witnesses or committee members. That is handles in your bitshares wallet under the voting tab. You will notice that voting costs a few pennies. If you value your investment more than a few pennies, please take a moment to vote or proxy.
      <h1>How can you reach me?</h1>
      On <a target="telegram" v-bind:href="telegram">Telegram</a></h1>

    </p>
  </div>
</template>

<script>
  export default {
    data: () => ({
      telegram: 'https://t.me/billbutler',
      lookup: (() => {
        return '/#/lookup/billbutler';
      }),
    }),
  };

</script>

<style>
  #about {
    position: relative;
    margin: 40px;
    text-align: left;
  }
</style>
