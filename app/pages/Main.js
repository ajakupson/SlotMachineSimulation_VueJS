import SlotMachine from './../components/SlotMachine';
import DebugArea from './../components/DebugArea';
import utils from './../../assets/js/Utils.js';

export default {
    template: `<div class="container">
                <debug-area :utils="utils"></debug-area>
                <slot-machine></slot-machine>
               </div>`,
    components: {
      'slot-machine': SlotMachine,
      'debug-area': DebugArea
    },
    created: function() {},
    methods: {},
    data() {
      return {
        utils: utils
      }
    }
}
