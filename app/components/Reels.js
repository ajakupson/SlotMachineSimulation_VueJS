import utils from './../../assets/js/Utils.js';
import Reel from './Reel.js';

export default {
    template: `<div class="reels-container">
                <reel
                  v-for="(reel, reelIndex) in reels"
                  :reel="reel"
                  :reelIndex="reelIndex"
                  :numberOfReelsStopped="numberOfReelsStopped"
                  :id="'reel-' +  (reelIndex + 1)"
                  :reelMaxSpinDuration="reelMaxSpinDuration"
                  :key="'reel-' +  (reelIndex + 1)">
                </reel>
              </div>`,
    components: {
      'reel': Reel
    },
    created: function() {
      this.$root.eventBus.$on('update-reels-stop-state', (val) => {
        if(val != 0) this.numberOfReelsStopped += val;
        else this.numberOfReelsStopped = 0;
      });
      this.$root.eventBus.$on('check-win-to-reels', () => {
        this.$root.eventBus.$emit('check-win', this.reels)
      });

      for(var i = 0; i < utils.xConstants.NUMBER_OF_REELS; i++) {
        this.reels.push( { 'reel': this.copyObjects(utils.reel) } );
      }
      this.shuffleSymbols();
    },
    methods: {
      copyObjects: function(arr) {
        var itemsCopy = []
        itemsCopy = arr.slice();
        for(var i = 0; i < itemsCopy.length; i++) {
          var obj = Object.assign({}, itemsCopy[i]);
          itemsCopy[i] = obj;
        }
        return itemsCopy;
      },
      shuffleSymbols: function() {
        var last;
        var numberOfRotations;
        for(var r = 0; r < utils.xConstants.NUMBER_OF_REELS; r++) {
          numberOfRotations = (Math.floor(Math.random() * 5) + 1);

          for(var ro = 0; ro < numberOfRotations; ro++) {
            last = this.reels[r]["reel"][utils.xConstants.SYMBOLS_PER_REEL - 1];

            for(var s = utils.xConstants.SYMBOLS_PER_REEL - 1; s > 0; s--) {
              this.reels[r]["reel"][s] = this.reels[r]["reel"][s - 1];
              this.reels[r]["reel"][s]["position"]++;
            }
            last["position"] = 1;
            this.reels[r]["reel"][0] = last;
          }
        }
      },
      startSpinning: function() {
        this.reelMinSpinDuration = utils.generateRandomNumber(1.85, 2.15) * 1000 | 0;
        this.reelMaxSpinDuration = this.reelMinSpinDuration;
        this.lastReelToWait = utils.xConstants.NUMBER_OF_REELS;

        this.$root.eventBus.$emit('spin-reel', this.reelMinSpinDuration);
      }
    },
    data() {
      return {
        reels: [],
        reelMinSpinDuration: 0,
        reelMaxSpinDuration: 0,
        lastReelToWait: 0,
        numberOfReelsStopped: 0
      }
    }
}
