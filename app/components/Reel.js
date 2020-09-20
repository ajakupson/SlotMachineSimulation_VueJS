import ReelSymbol from './ReelSymbol.js';
import utils from './../../assets/js/Utils.js';
import dynamics from './../../assets/js/third-party/dynamics.min.js';

export default {
    template: `<div
                  class="reel"
                  v-bind:reel="reel"
                  v-bind:reelIndex="reelIndex"
                  v-bind:numberOfReelsStopped="numberOfReelsStopped"
                  v-bind:reelMaxSpinDuration="reelMaxSpinDuration">
                <reel-symbol
                  v-for="reelSymbol in reelSymbols"
                  :reelIndex="reelIndex"
                  :reelSymbol="reelSymbol"
                  :spinSpeed="spinSpeed"
                  :key="'reel-' + (reelIndex + 1) + '-symbol-' + reelSymbol.index">
                </reel-symbol>
               </div>`,
    components: {
      'reel-symbol': ReelSymbol
    },
    created: function() {
      this.reelSymbols = this.reel["reel"];

      this.$root.eventBus.$on('spin-reel', (reelMinSpinDuration) => {
        this.spinReel(reelMinSpinDuration);
      });
      this.$root.eventBus.$on('animation-complete', () => {
        this.isAnimationComplete = true;
      });
    },
    props: {
      reel: { type: Object, required: true },
      reelIndex: { type: Number, required: true },
      reelMaxSpinDuration: { type: Number, required: true },
      numberOfReelsStopped: { type: Number, required: true }
    },
    methods: {
      onStart: function() {
        this.isButtonDisabled = true;
        this.isDebug = document.getElementById("isDebug").checked;
        if(this.isDebug) {
          this.debugSettings = [];
          var reelSpeedSelectElement = document.getElementById("spin-speed-select");
          this.spinSpeed = parseInt(reelSpeedSelectElement.options[reelSpeedSelectElement.selectedIndex].value);

          for(var i = 1; i <= utils.xConstants.NUMBER_OF_REELS; i++) {
            var reelSymbolPosition = parseInt(document.getElementById("reel-" + i + "-pos-select").value);
            var reelSymbolIndex = parseInt(document.getElementById("reel-" + i + "-symbol-select").value);
            this.debugSettings.push([reelSymbolPosition, reelSymbolIndex]);
          }
        } else {
          this.spinSpeed = 100;
        }
      },
      moveDownOnce: function() {
        var symbolElementsArray = this.$el.getElementsByClassName("reel-symbol");
        for(var i = 0; i < utils.xConstants.SYMBOLS_PER_REEL; i++) {
          this.moveSymbol(symbolElementsArray[i], i);

          this.reelSymbols[i].position++;
          if(this.reelSymbols[i].position == 6) {
            this.reelSymbols[i].position = 1;

            var lastToFirstElement = document.getElementById("reel-" + (this.reelIndex + 1) + "-symbol-" + this.reelSymbols[i].index);
            this.$el.insertBefore(lastToFirstElement, this.$el.firstChild);

            lastToFirstElement.style.top = "-120px";
            dynamics.animate(lastToFirstElement, {
              top: 0
            }, {
              type: dynamics.gravity,
              duration: this.spinSpeed,
              bounciness: 1,
              elasticity: 1
            });
          }
        }

        var last = this.reelSymbols[this.reelSymbols.length - 1];
        for(var i = this.reelSymbols.length - 1; i > 0; i--) {
          this.reelSymbols[i] = this.reelSymbols[i - 1];
        }
        this.reelSymbols[0] = last;
      },
      spinReel: function(reelMinSpinDuration) {
        this.onStart();

        var reelDelay = utils.generateRandomNumber(4, 5) * 100 * this.reelIndex | 0;
        this.reelSpinDuration = reelMinSpinDuration + reelDelay;

        var startTime = new Date().getTime();
        var endTime;
        var that = this;

        function spinUntilCondition() {
          if(!that.isDebug) {
            endTime = new Date().getTime();
            var differenceInMilliceconds = Math.abs(endTime - startTime);

            if(differenceInMilliceconds >= that.reelSpinDuration) {
              abortTimer();
              if(that.reelIndex == utils.xConstants.NUMBER_OF_REELS - 1) {
                that.isButtonDisabled = false;
                that.$root.eventBus.$emit("check-win-to-reels");
              }
            } else {
              that.moveDownOnce();
            }
          } else {
            if(!that.areDebugConditionsMet()) {
              that.moveDownOnce();
            } else {
              abortTimer();
              that.$root.eventBus.$emit("update-reels-stop-state", 1);
              if(that.numberOfReelsStopped == utils.xConstants.NUMBER_OF_REELS - 1) {
                that.isButtonDisabled = false;
                that.$root.eventBus.$emit("update-reels-stop-state", 1);
                that.$root.eventBus.$emit("check-win-to-reels");
              }
            }
          }
        }

        var timerId = setInterval(spinUntilCondition, this.spinSpeed);
        function abortTimer() {
          clearInterval(timerId);
        }
      },
      updateReelDataArrayCallback: function() {
        var newReelSymbols = new Array(this.reelSymbols.length);
        for(var i = 0; i < this.reelSymbols.length; i++) {
          newReelSymbols[this.reelSymbols[i].position - 1] = this.reelSymbols[i];
        }
        this.reelSymbols = newReelSymbols;
      },
      moveSymbol: function(symbolElement, symbolIndex) {
        var topOffset = (symbolIndex + 1) * 120;
        dynamics.animate(symbolElement, {
          top: topOffset
        }, {
          type: dynamics.gravity,
          duration: this.spinSpeed,
          bounciness: 1,
          elasticity: 1
        });
      },
      areDebugConditionsMet: function() {
        for(var i = 0; i < this.reelSymbols.length; i++) {
          if(this.reelSymbols[i]["position"] == this.debugSettings[this.reelIndex][0] &&
            this.reelSymbols[i]["index"] == this.debugSettings[this.reelIndex][1]) {
              return true;
            }
        }
        return false;
      }
    },
    watch: {
      isButtonDisabled: function(newVal, oldVal) {
        if(newVal) {
          document.getElementById("spin-btn").disabled = true;
        } else {
          document.getElementById("spin-btn").disabled = false;
        }
      }
    },
    data() {
      return {
        reelSymbols: [],
        reelSpinDuration: 0,
        spinSpeed: 100,
        isAnimationComplete: true,
        isDebug: false,
        debugSettings: [],
        isButtonDisabled: false
      }
    }
}
