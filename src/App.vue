<template>
  <div id="app">
    <toolbar></toolbar>
    <div class="container-fluid">
      <div class="col-sm-2">
        <ul v-for="source in images">
          <thumb :source="source" ></thumb>
        </ul>
      </div>
      <div class="col-sm-10">
        <annotation :source="this.canvas"></annotation>
      </div>
    </div>
    
  </div>
</template>

<script>
import toolbar from './components/toolbar.vue';
import annotation from './components/annotation.vue';
import thumb from './components/thumb.vue';
import EventBus from './eventBus.js';


let sources = [
  'http://res.freestockphotos.biz/pictures/2/2481-closeup-of-a-1040-tax-form-and-a-pen-pv.jpg',
  'http://res.freestockphotos.biz/pictures/2/2483-closeup-of-a-1040-tax-form-and-a-pen-pv.jpg',
  'http://res.freestockphotos.biz/pictures/2/2484-closeup-of-a-tax-income-graph-and-pen-pv.jpg'
];
let canvas = sources[0];

export default {
  name: 'app',
  data () {
    return {
      images: sources,
      canvas: canvas
    }
  },
  components: {
    toolbar,
    annotation,
    thumb
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
