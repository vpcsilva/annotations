<template>
  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <div class="collapse navbar-collapse">
        <div class="nav navbar-nav">
          <button v-on:click="rect" class="btn btn-default navbar-btn">Rectangle</button>
          <button v-on:click="marker" class="btn btn-default navbar-btn">Marker</button>
        </div>
        <div class="nav navbar-nav navbar-right">
          <button @click="layer" class="btn btn-default navbar-btn">Toggle Layer</button>
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
      layer () {
        EventBus.$emit('toggleLayer');
      },
      rect () {
        EventBus.$emit('addRectangle');
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
