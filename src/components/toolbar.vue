<template>
  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <div class="collapse navbar-collapse">
        <div class="nav navbar-nav">
          <button class="btn btn-default navbar-btn disabled">Text</button>
          <button v-on:click="circle" class="btn btn-default navbar-btn disabled">Circle</button>
          <button v-on:click="rect" class="btn btn-default navbar-btn disabled">Square</button>
          <button class="btn btn-default navbar-btn disabled">Line</button>
          <button v-on:click="marker" class="btn btn-default navbar-btn disabled">Marker</button>
        </div>
        <div class="nav navbar-nav navbar-right">
          <button @click="save" class="btn btn-default navbar-btn">Save</button>
          <button class="btn btn-default navbar-btn" @click="retrieve">Import</button>
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
      save () {
        EventBus.$emit('save');
      },
      retrieve () {
        EventBus.$emit('import');
      }
    }
  }
</script>
