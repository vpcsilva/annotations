<template lang="html">
  <div v-show="showModal">
    <div class="modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- HEADER -->
          <div class="modal-header">
            <slot name="header">
              <a class="close" type="button" @click="cancel">x</a>
              <h4 class="modal-title">
                <slot name="title">
                  {{title}}
                </slot>
              </h4>
            </slot>
          </div>
          <!-- BODY -->
          <div class="modal-body">
            <slot></slot>
          </div>
          <!-- FOOTER -->
          <div class="modal-footer">
            <slot name="footer">
              <button type="button" :class="cancelClass" @click="cancel">{{cancelText}}</button>
              <button type="button" :class="okClass" @click="ok">{{okText}}</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop in"></div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Modal',
    },
    force: {
      type: Boolean,
      default: false,
    },
    okText: {
      type: String,
      default: 'Ok',
    },
    cancelText: {
      type: String,
      default: 'Cancel',
    },
    cancelClass: {
      type: String,
      default: 'btn btn-danger'
    },
    okClass: {
      type: String,
      default: 'btn btn-primary'
    }
  },
  data () {
    return {
      showModal: this.show
    }
  },
  created () {
    if(this.showModal) {
      document.body.classList.add('modal-open');
    }
  },
  beforeDestroy () {
    document.body.classList.remove('modal-open');
  },
  watch: {
    show (show, oldVal) {
      if(show) document.body.classList.add('modal-open');
      this.showModal = show;
    }
  },
  methods: {
    ok () {
      this.$emit('ok');
    },
    cancel () {
      this.$emit('cancel');
      this.showModal = false;
    },
    clickMask () {
      if(!this.force) this.cancel();
    }
  }
}
</script>

<style lang="css">
  .modal {
    display: block;
  }
  .modal-transition {
    transition: all .6s ease;
  }
  .modal-leave {
    border-radius: 1px !important;
  }
  .modal-transition .modal-dialog,
  .modal-transition .modal-backdrop {
    transition: all .5s ease;
  }
  .modal-enter .modal-dialog,
  .modal-leave .modal-dialog {
    opacity: 0;
    transform: translateY(-30%);
  }
  .modal-enter .modal-backdrop,
  .modal-leave .modal-backdrop {
    opacity: 0;
  }
</style>
