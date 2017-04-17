<template>
  <div>
    <div :id="id" class="map"></div>
    <Modal :title="modalTitle" :show="showModal" @ok="modalOk" @cancel="modalCancel">
      <textarea name="" id="" cols="30" rows="3" class="form-control" v-model="markerMessage"></textarea>
    </Modal>
  </div>
</template>

<script>
  import EventBus from '../eventBus.js';
  import L from 'leaflet';
  import LD from 'leaflet-draw';
  import Modal from './modal.vue';
  import CM from 'leaflet-contextmenu';

  // import GU from 'leaflet-geometryutil';
  // import Snap from 'leaflet-snap';

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
        showModal: false,
        images: [],
        componentIndex: this.index,
        imageOverlay: false,
        markerMessage: '',
        modalTitle: 'Comment'
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
      EventBus.$on('import', this.retrieve);
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
            polyline: false,
            polygon: false,
            circle: false,
          },
        });

        window.drawItems = drawItems;
        this.map.addControl(control);

        this.map.on(L.Draw.Event.CREATED, (e) => {
          let layer = e.layer;
          let type = e.layerType;

          this.showModal = true;
          this.afterOk = () => {
            layer.bindPopup(this.markerMessage);
            drawItems.addLayer(layer);
          }
          this.afterCancel = () => {
            console.log('Item canceled');
          }
          layer.bindContextMenu({
            contextmenu: true,
            contextmenuItems: [
              {
                text: 'Edit Comment',
                callback: () => {
                  this.markerMessage = layer.getPopup().getContent();
                  this.showModal = true;
                  this.afterOk = () => {
                    layer.setPopupContent(this.markerMessage);
                  }
                }
              },
              '-',
              {
                text: 'Close'
              }
            ]
          })
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
        this.showModal = true;
        this.modalTitle = 'Map Data';
        this.markerMessage = JSON.stringify(this.drawItems.toGeoJSON());
        window.geoJson = this.drawItems.toGeoJSON();
        console.log(this.drawItems.toGeoJSON());
      },
      retrieve () {
        this.showModal = true;
        this.modalTitle = 'Import Data';
        this.afterOk = () => {
          let geoJson = L.geoJSON(JSON.parse(this.markerMessage));
          geoJson.addTo(this.drawItems);
        }
      },
      modalOk () {
        this.showModal = false;
        if (this.afterOk) {
          this.afterOk();
        }
        this.markerMessage = '';
        this.afterOk = null;
      },
      modalCancel () {
        this.showModal = false;
        if (this.afterOk) {
          this.afterCancel();
        }
        this.markerMessage = '';
        this.afterCancel = null;
      }
    },
    components: {
      Modal
    }
  }
</script>

<style>
  .map {
    height: 500px;
    width: 100%;
  }
</style>
