<template>
  <div id="app">
    <Toolbar></Toolbar>
    <div class="container-fluid">
      <div class="col-sm-2 sidebar">
        <ul>
          <li class="thumb" v-for="(img, index) in images">
            <img :id="index" @click="changeDrawboard(index)" class="img-responsive" :src="img.thumb" alt="">
            <!-- <img :id="index" class="img-responsive" :src="img.thumb" alt=""> -->
          </li>
        </ul>
      </div>
      <div class="col-sm-10">
        <!-- <div v-for="(img, index) in images"> -->
          <!-- <drawboard :index="index" v-show="index == currentDrawboard" :image="img" ></drawboard> -->
          <drawboard :index="0" :image="currentImage" ></drawboard>
        <!-- </div> -->
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
  {
    src: 'https://raw.githubusercontent.com/vpcsilva/annotations/gh-pages/dist/image-1.jpg',
    thumb: 'https://raw.githubusercontent.com/vpcsilva/annotations/gh-pages/dist/thumb-1.jpg',
    width: 1241,
    height: 1754,
  },
  {
    src: 'https://raw.githubusercontent.com/vpcsilva/annotations/gh-pages/dist/image-2.jpg',
    thumb: 'https://raw.githubusercontent.com/vpcsilva/annotations/gh-pages/dist/thumb-2.jpg',
    width: 1241,
    height: 1754,
  },
];

// --- EXPORT ---
export default {
  name: 'app',
  data () {
    return {
      images: fullImages,
      currentImage: fullImages[0],
    }
  },
  components: {
    Toolbar,
    Drawboard
  },
  methods: {
    changeDrawboard (index) {
      this.currentImage = this.images[index];
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

  .sidebar {
    background-color: #DDD;
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
