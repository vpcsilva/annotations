<template>
    <li><img v-on:click="selectImage" class="img-responsive" :src="source" alt=""></li>
</template>

<script>
  import EventBus from '../eventBus.js';

  export default {
    props: ['source'],
    methods: {
      selectImage () {
        EventBus.$emit('changeCanvas', this.source);
      }
    }
  }
</script>

<style>
  li {
    display: block;
    margin: 20px;
  }

</style>