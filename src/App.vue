<template>
  <div id="app">
    <Toolbar></Toolbar>
    <div class="container-fluid">
      <div class="col-sm-2">
        <ul>
          <li class="thumb" v-for="(img, index) in thumbs">
            <!--<img :id="index" @click="changeDrawboard(index)" class="img-responsive" :src="img.src" alt="">-->
            <img :id="index" class="img-responsive" :src="img.src" alt="">
          </li>
        </ul>
      </div>
      <div class="col-sm-10">
        <!--<div v-for="(img, index) in images">-->
          <!--<drawboard :index="index" v-show="index == currentDrawboard" :image="img" ></drawboard>-->
          <drawboard :index="0" :image="images[0]" ></drawboard>
        <!--</div>-->
      </div>
    </div>
  </div>
</template>

<script>
import Toolbar from './components/toolbar.vue';
import Drawboard from './components/drawboard.vue';
import routes from './routes.js';
import myImage from './components/image.js';

import EventBus from './eventBus.js';

// --- DATA ---
let fullImages = [
  'https://raw.githubusercontent.com/vpcsilva/annotations/gh-pages/dist/image-1.jpg',
  'https://raw.githubusercontent.com/vpcsilva/annotations/gh-pages/dist/image-2.jpg',
];
let thumbs = [
  'https://raw.githubusercontent.com/vpcsilva/annotations/gh-pages/dist/thumb-1.jpg',
  'https://raw.githubusercontent.com/vpcsilva/annotations/gh-pages/dist/thumb-2.jpg'
];

// --- EXPORT ---
export default {
  name: 'app',
  created () {
    this.images = this.loadImages(fullImages);
    this.thumbs = this.loadImages(thumbs);
  },
  data () {
    return {
      images: null,
      thumbs: null,
      currentDrawboard: 0,
    }
  },
  components: {
    Toolbar,
    Drawboard
  },
  methods: {
    changeDrawboard (index) {
      this.currentDrawboard = index;
      EventBus.$emit('changeDrawboard', index);
    },
    loadImages(sources) {
      let images = [];
      sources.forEach( src => {
        let image = myImage.newImage(src);
        images.push(image);
      });
      return images;
    }
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

  li.thumb {
    display: block;
    margin: 20px;
  }

  a {
    color: #42b983;
  }
</style>
