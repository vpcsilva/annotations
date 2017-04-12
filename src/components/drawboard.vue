<template>
  <div :id="id" class="map"></div>
</template>
<script>
  import EventBus from '../eventBus.js';
  import L from 'leaflet';
  import LD from 'leaflet-draw';

  export default {
    props: ['image', 'index'],
    data () {
      return {
        imgHeight: this.image.height,
        imgWidth: this.image.width,
        map: false,
        bounds: false,
        id: 'map'+this._uid,
        itensOnMap: false,
        drawItems: null,
        show: false,
        images: [],
        componentIndex: this.index,
        imageOverlay: false,
      }
    },
    watch: {
      image: function(newImg, oldImg) {
        this.imgWidth = newImg.width;
        this.imgHeight = newImg.height;
        this.setImage();
      }
    },
    created () {
      // --- Events ---
      EventBus.$on('changeDrawboard', this.changeDrawboard);
      EventBus.$on('save', this.export);
    },
    mounted () {
      this.setupMap();
    },
    methods: {
      setupMap () {
        let options = {
          crs: L.CRS.Simple,
          maxZoom: 5,
          minZoom: -5,
        };

        this.map = L.map(this.id, options);

        let drawItems = L.featureGroup().addTo(this.map);
        this.bounds = [[0,0],[this.imgHeight, this.imgWidth]];
        this.imageOverlay = L.imageOverlay(this.image.src, this.bounds).addTo(this.map);

        let control = new L.Control.Draw({
          edit: {
            featureGroup: drawItems,
            poly: {
              allowIntersection: false,
            },
          },
          draw: {
            polygon: false,
            circle: false,
          },
        });

        this.map.addControl(control);

        this.map.on(L.Draw.Event.CREATED, function(e) {
          let layer = e.layer;
          drawItems.addLayer(layer);
        });

        this.drawItems = drawItems;
        this.map.fitBounds(this.bounds);
      },
      createLatLngBounds (bounds) {
        let corner1 = L.latLng(0, 0);
        let corner2 = L.latLng(this.imgHeight, this.imgWidth);
        return new L.latLngBounds(corner1, corner2);
      },
      setImage () {
        this.bounds = [[0,0],[this.imgHeight, this.imgWidth]];
        this.imageOverlay.setUrl(this.image.src);
        this.imageOverlay.setBounds(this.createLatLngBounds(this.bounds));
      },
      changeDrawboard (index) {
        if (index == this.index) {
          this.isActive = true;
        } else {
          this.isActive = false;
        }
        this.componentIndex = index;
      },
      export () {
        console.log(this.drawItems.toGeoJSON());
      }
    }
  }
</script>

<style>
  .map {
    height: 500px;
    width: 100%;
  }
</style>
