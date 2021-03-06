<template>
  <div>
    <div :id="id" class="map"></div>
    <Modal :title="modalTitle" :show="modalVisible" @ok="modalOk" @cancel="modalCancel">
      <textarea name="" id="markerMessageInput" cols="30" rows="3" class="form-control" v-model="markerMessage" autofocus></textarea>
    </Modal>
  </div>
</template>

<script>
  import EventBus from '../eventBus.js';
  import Modal from './modal.vue';

  import L from 'leaflet';
  import {} from 'leaflet-contextmenu';
  import {} from 'leaflet.path.drag';
  import {} from 'leaflet-editable';

  export default {
    props: ['image', 'index'],
    data () {
      return {
        imgHeight: this.image.height,
        imgWidth: this.image.width,
        map: false,
        bounds: false,
        id: 'map'+this._uid,
        toggleLayer: true,
        drawItems: null,
        modalVisible: false,
        annotations: [],
        drawboardIndex: this.index,
        imageOverlay: false,
        markerMessage: '',
        modalTitle: 'Comment',
      }
    },
    watch: {
      image: function(newImg, oldImg) { // Changes before event changeDrawboard
        this.imgWidth = newImg.width;
        this.imgHeight = newImg.height;
        this.setImage();
      },
      drawItems: function(newVal, oldVal) {
        if (oldVal) {
          this.map.removeLayer(oldVal);
        }
        this.map.addLayer(newVal);
        newVal.eachLayer((l) => {
          l.enableEdit();
        });
        this.map.fitBounds(this.bounds);
      }
    },
    created () {
      // --- Events ---
      EventBus.$on('changeDrawboard', this.changeDrawboard);
      EventBus.$on('save', this.export);
      EventBus.$on('import', this.retrieve);
      EventBus.$on('addRectangle', this.addRectangle);
      EventBus.$on('addMarker', this.addMarker);
    },
    mounted () {
      this.setupMap();
      window.map = this.map;
    },
    methods: {
      setupMap () {
        let options = {
          crs: L.CRS.Simple,
          maxZoom: 5,
          minZoom: -5,
          editable: true,
        };

        this.map = L.map(this.id, options);

        let drawItems = this.createFeatureGroup();
        this.bounds = [[0,0],[this.imgHeight, this.imgWidth]];
        this.imageOverlay = L.imageOverlay(this.image.src, this.bounds).addTo(this.map);

        this.drawItems = drawItems;
        this.annotations[this.index] = this.drawItems;
        this.map.fitBounds(this.bounds);
      },
      createFeatureGroup () {
        let fg = L.layerGroup();
        return fg;
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
        if (!this.annotations[index]) {
          this.annotations[index] = this.createFeatureGroup();
        }
        this.drawboardIndex = index;
        this.drawItems = this.annotations[index];
      },
      export () {
        this.showModal();
        this.modalTitle = 'Map Data';
        let drawboardsJson = [];
        this.annotations.forEach((drawItems) => {
          drawItems.eachLayer((l) => {
            let feature = l.feature = l.feature || {}; // Initialize feature
            feature.type = feature.type || "Feature"; // Initialize feature.type
            let props = feature.properties = feature.properties || {}; // Initialize feature.properties
            props.comment = l.getPopup().getContent();
          });
          drawboardsJson.push(drawItems.toGeoJSON());
        });
        this.markerMessage = JSON.stringify(drawboardsJson);
      },
      retrieve () {
        this.showModal();
        this.modalTitle = 'Import Data';
        this.afterOk = () => {
          let drawboards = JSON.parse(this.markerMessage);
          for(let i = 0; i < drawboards.length; i++) {
            let geoJson = L.geoJSON(drawboards[i]);
            geoJson.eachLayer((layer) => {
              let layerPopup;
              try {
                layerPopup = layer.feature.properties.comment;
              }
              catch (e) {}
              // add layer to current drawboard
              if (this.drawboardIndex === i) {
                layer = this.addLayerTo(layer, this.drawItems);
              }
              // add layer to respective drawboard
              else {
                if (!this.annotations[i]) {
                  this.annotations[i] = this.createFeatureGroup();
                }
                layer = this.addLayerTo(layer, this.annotations[i]);
              }
              console.log(layerPopup);
              layer.bindPopup(layerPopup);
              this.createContextMenu(layer);
              try {
                layer.enableEdit();
              } catch (e) {
                console.error('Couldn\'t enable edit', layer);
              }
            });
          }
        }
      },
      addLayerTo (layer, destination) {
        try{
          if(layer.feature.geometry.type.toLowerCase() === 'polygon') {
            let rect = L.rectangle(layer.getBounds());
            destination.addLayer(rect);
            layer = rect;
          }
          else {
            destination.addLayer(layer);
          }
          return layer;
        } catch(e) {
          destination.addLayer(layer);
          return layer;
        }
      },
      modalOk () {
        this.hideModal();
        if (this.afterOk) {
          this.afterOk();
        }
        this.cleanActions();
        this.markerMessage = '';
      },
      modalCancel () {
        this.hideModal();
        if (this.afterCancel) {
          this.afterCancel();
        }
        this.cleanActions();
        this.markerMessage = '';
      },
      cleanActions() {
        this.afterOk = null;
        this.afterCancel = null;
      },
      showModal () {
        this.modalVisible = true;
        document.getElementById('markerMessageInput').focus();
      },
      hideModal () {
        this.modalVisible = false;
      },
      addRectangle () {
        let rect = this.map.editTools.startRectangle();
    
        rect.on('editable:drawing:commit', (e) => {
          this.modalTitle = 'Comment';
          this.showModal();
          this.afterOk = () => {
            if (this.markerMessage) {
              rect.bindPopup(this.markerMessage);
            }
            this.drawItems.addLayer(rect);
          };
          this.afterCancel = () => {
            this.map.removeLayer(rect);
          };
          this.createContextMenu(rect);
        });
      },
      addMarker () {
        let marker = this.map.editTools.startMarker();
        marker.on('editable:drawing:commit', (e) => {
          this.modalTitle = 'Comment';
          this.showModal();
          this.afterOk = () => {
            if (this.markerMessage) {
              marker.bindPopup(this.markerMessage);
            }
            this.drawItems.addLayer(marker);
          };
          this.afterCancel = () => {
            this.map.removeLayer(marker);
          };
          this.createContextMenu(marker);
        });
      },
      createContextMenu (layer) {
        let options = {
          contextmenu: true,
          contextmenuItems: [
            {
              text: 'Edit Comment',
              callback: () => {
                try {
                  this.markerMessage = layer.getPopup().getContent();
                }
                catch (e) {
                  this.markerMessage = '';
                }
                this.showModal();
                this.afterOk = () => {
                  layer.setPopupContent(this.markerMessage);
                }
              }
            },
            {
              text: 'Delete',
              callback: () => {
                this.drawItems.removeLayer(layer);
                this.map.removeLayer(layer);
              }
            },
            '-',
            {
              text: 'Close'
            }
          ]
        };
        layer.bindContextMenu(options);
      },
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
