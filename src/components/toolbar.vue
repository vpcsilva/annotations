<template>
  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <div class="collapse navbar-collapse">
        <div class="nav navbar-nav">
          <button class="btn btn-default navbar-btn">Text</button>
          <button v-on:click="circle" class="btn btn-default navbar-btn">Circle</button>
          <button v-on:click="rect" class="btn btn-default navbar-btn">Square</button>
          <button class="btn btn-default navbar-btn">Line</button>
          <button v-on:click="marker" class="btn btn-default navbar-btn">Marker</button>
        </div>
        <div class="nav navbar-nav navbar-right">
          <button class="btn btn-default navbar-btn">Save</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
  import EventBus from '../eventBus.js';
  export default {
    methods: {
      circle () {
        EventBus.$emit('addCircle');
      },
      rect () {
        EventBus.$emit('addSquare');
      },
      marker () {
        EventBus.$emit('addMarker');
      },
    }
  }
</script>