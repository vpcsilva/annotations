'use strict';
import Vue from 'vue';

Vue.component('drawboard', {
  template: `
    <div :id="${'map'+_uid}" class="map"></div>
  `,
  props: ['image', 'index'],
  data () {
    return {
      src: this.image.src,
      imgHeight: this.image.height,
      imgWidth: this.image.width,
      map: false,
      bounds: false,
      id: 'map'+this._uid,
      isActive: false,
      itensOnMap: false,
      drawItems: null,
      show: false,
    }
  },
  components: {
    Modal,
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
    this.createMap();
    this.setupMap();
  },
  methods: {
    createMap () {
      let options = {
        crs: L.CRS.Simple,
        maxZoom: 5,
        minZoom: -5,
      };
      this.map = L.map(this.id, options);

      this.drawItems = L.featureGroup().addTo(this.map);

      this.bounds = [[0,0],[this.imgHeight, this.imgWidth]];
      let image = L.imageOverlay(this.src, this.bounds).addTo(this.map);

      let control = new L.Control.Draw({
        edit: {
          featureGroup: this.drawItems,
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
    },
    setupMap () {
      this.map.on(L.Draw.Event.CREATED, function(e) {
        let layer = e.layer;
        this.drawItems.addLayer(layer);
      });

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
      this.show = true;
      this.itemsOnMap = this.drawItems.toGeoJSON();
    },
    modalOk () {
      this.show = false;
    },
    modalCancel () {
      this.show = false;
    }
  }
});
