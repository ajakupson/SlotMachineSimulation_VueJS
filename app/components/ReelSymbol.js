import dynamics from './../../assets/js/third-party/dynamics.min.js';
import utils from './../../assets/js/Utils.js';

export default {
    template: `<div class="reel-symbol"
                    v-bind:reelIndex="reelIndex"
                    v-bind:reelSymbol="reelSymbol"
                    v-bind:spinSpeed="spinSpeed"
                    :id="'reel-' + (reelIndex + 1) + '-symbol-' + reelSymbol.index"
                    :style="'top:' + ((reelSymbol.position - 1) * 120) + 'px'">
                <img :src="'assets/img/' + reelSymbol.img"/>
               </div>`,
    created: function() {
      this.$root.eventBus.$on('move-down-once', () => {
        this.moveDownOnce();
      });
    },
    data() {
      return {}
    },
    props: {
      reelIndex: {type: Number, required: true },
      reelSymbol: { type: Object, required: true },
      spinSpeed: { type: Number, required: true }
    },
    methods: {
      moveDownOnce: function() {
        var that = this;
        var topOffset = (this.reelSymbol.position - 1) * 120;
        dynamics.animate(this.$el, {
            top: topOffset
          }, {
            type: dynamics.gravity,
            duration: this.spinSpeed,
            bounciness: 1,
            elasticity: 1,
            /*complete: function() {
              that.$root.eventBus.$emit('animation-complete');
            }*/
          });
      }
    }
}
