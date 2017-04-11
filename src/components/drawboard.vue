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
        src: this.image.src,
        imgHeight: false,
        imgWidth: false,
        map: false,
        bounds: false,
        id: 'map'+this._uid,
        isActive: false,
        itensOnMap: false,
        drawItems: null,
        show: false,
      }
    },
    created () {
      if(this.index == 0) {
        this.isActive = true;
      }

      EventBus.$on('changeDrawboard', this.changeDrawboard);
      EventBus.$on('addCircle', this.addCircle);
      EventBus.$on('save', this.export);
    },
    mounted () {
      this.imgHeight = this.image.height;
      this.imgWidth = this.image.width;
      console.log(this.image.width);
      console.log(this.image.height);
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
        let image = L.imageOverlay(this.src, this.bounds).addTo(this.map);

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
      changeDrawboard (index) {
        if (index == this.index) {
          this.isActive = true;
        } else {
          this.isActive = false;
        }
      },
      addCircle () {
        if (this.isActive) {
          console.log('ADD CIRCLE');
        }
      },
      export () {
        console.log(this.drawItems.toGeoJSON());
      },
      modalOk () {
        this.show = false;
      },
      modalCancel () {
        this.show = false;
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
