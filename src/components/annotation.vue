<template>
  <div id="map" @click="mouseClick" ></div>
</template>

<script>
  import L from 'leaflet';
  import EventBus from '../eventBus.js';

  let imageWidth = 654;
  let imageHeight = 435;

  export default {
    props: ['source'],
    data () {
      return {
        map: false,
        bounds: false,
        imgSource: this.source,
        layer: false,
        toolCursor: false,
        mapElement: false,
      };
    },
    mounted () {
      this.map = this.setupMap();
      EventBus.$on('changeCanvas', (src) => {this.changeCanvas(src)});
      EventBus.$on('addCircle', () => this.addCircle());
      EventBus.$on('addSquare', () => this.addSquare());
      EventBus.$on('addMarker', () => this.addMarker());
      this.mapElement = document.getElementById('map');
    },
    methods: {
      changeCanvas (src) {
        this.imgSource = src;
        L.imageOverlay(src, this.bounds).addTo(this.map);
      },
      setupMap () {
        let mapConfig = L.map('map', {
          minZoom: 1,
          maxZoom: 3,
          center: [0,0],
          zoom: 2,
          crs: L.CRS.Simple
        });
        
        let southWest = mapConfig.unproject([0,imageHeight]);
        let northEast = mapConfig.unproject([imageWidth, 0]);
        this.bounds = new L.LatLngBounds(southWest, northEast);
        L.imageOverlay(this.imgSource, this.bounds).addTo(mapConfig);
        mapConfig.setMaxBounds(this.bounds);

        return mapConfig;
      },
      addCircle() {
        this.mapElement.classList.add('crosshair');
        L.circle([-50, 50], {radius: 10, draggable: true}).addTo(this.map);
      },
      addSquare() {
        this.toolCursor = true;
        let bounds = [[0, 0], [-109, 163]];
        L.rectangle(bounds, {weight: 1, draggable: true}).addTo(this.map);
      },
      mouseClick (e) {
        let position = this.map.mouseEventToLatLng(e);
        let marker = L.marker(position, {draggable: true}).addTo(this.map);
        this.mapElement.classList.remove('crosshair');
        this.toolCursor = false;
      },
      addMarker () {
        
      },
    }
  }
</script>

<style>
  #map {
    height: 70vh;
    width: 100%;
  }
  #map.crosshair {
    cursor: crosshair;
  }
</style>