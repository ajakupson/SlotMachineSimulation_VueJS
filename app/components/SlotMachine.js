import Reels from './Reels';
import utils from './../../assets/js/Utils.js';

export default {
    template: `<div class="reels-wrapper">
                <reels ref="reels"></reels>
                <div class="slot-machine-controls">
                  <div class="controls-container-row">
                    <div class="balance-indicator-container">
                      <label for="balance-indicator"><h3>Balance:</h3></label>
                      <input type="text" v-model="totalBalance" name="balance-indicator" class="balance-indicator" id="balance-indicator">
                    </div>
                    <button id="spin-btn" @click="startSpinning()" class="spin-button">SPIN</button>
                  </div>
                  <div class="controls-container-row">
                    <div class="pay-table" :class="winSumHasChanged && blinkClass">
                      <div id="total-win">
                        <b>Win: {{ winSum }}</b>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="messages-container" class="messages-container">
                  <p v-for="message in notifications.slice().reverse()">{{ message }}</p>
                </div>
               </div>`,
    components: {
      reels: Reels
    },
    created: function() {
      this.$root.eventBus.$on('check-win', (reels) => {
        this.checkWin(reels);
      });
    },
    methods: {
      startSpinning: function() {
        if(this.totalBalance != 0) {
          this.totalBalance--;
          this.clearWinLines();
          this.$refs.reels.startSpinning();
        } else {
          this.notifications.push(utils.getNow() + ": Not enough balance! Balance must be between 1...5000");
          return;
        }
      },
      checkWin: function(reels) {
        this.reels = Array(utils.xConstants.NUMBER_OF_REELS);
        for(var i = 0; i < utils.xConstants.NUMBER_OF_REELS; i++) {
          this.reels[i] = reels[i]["reel"];
        }

        this.check3CherryOnTopLine();
        this.check3CherryOnCenterLine();
        this.check3CherryOnBottomLine();

        this.check3SevenOnAnyLine();
        this.checkAnyCombinationOfCherryAndSevenOnAnyLine();


        var threeBarOnSameLine = this.check3xBarOnAnyLine();
        var barOnSameLine = this.checkBarOnAnyLine();
        var twoBarOnSameLine = this.check2xBarOnAnyLine();
        if(!threeBarOnSameLine && !barOnSameLine && !twoBarOnSameLine) {
          this.checkCombinationOfAnyBarOnAnyLine();
        }
      },
      check3CherryOnTopLine: function() {
        if(this.reels[0][0]["text"] == "CHERRY" && this.reels[1][0]["text"] == "CHERRY" && this.reels[2][0]["text"] == "CHERRY") {
            this.winSum += 2000;
            this.notifications.push(utils.getNow() + ": 3 CHERRY symbols on top line, +2000");
            this.markWinLine([1,2,3], [1]);
            return true;
        }
        return false;
      },
      check3CherryOnCenterLine: function() {
        if(this.reels[0][1]["text"] == "CHERRY" && this.reels[1][1]["text"] == "CHERRY" && this.reels[2][1]["text"] == "CHERRY") {
            this.winSum += 1000;
            this.markWinLine([1,2,3], [2]);
            this.notifications.push(utils.getNow() + ": 3 CHERRY symbols on center line, +1000");
            return true;
        }
        return false;
      },
      check3CherryOnBottomLine: function() {
        if(this.reels[0][2]["text"] == "CHERRY" && this.reels[1][2]["text"] == "CHERRY" && this.reels[2][2]["text"] == "CHERRY") {
            this.winSum += 4000;
            this.markWinLine([1,2,3], [3]);
            this.notifications.push(utils.getNow() + ": 3 CHERRY symbols on bottom line, +4000");
            return true;
        }
        return false;
      },
      check3SevenOnAnyLine: function() {
        var isWin = false;
        var reelIndexes = [1,2,3];
        var symbolIndexes;
        if(this.reels[0][0]["text"] == "7" && this.reels[1][0]["text"] == "7" && this.reels[2][0]["text"] == "7") {
          isWin = true;
          symbolIndexes = [1];
        } else if(this.reels[0][1]["text"] == "7" && this.reels[1][1]["text"] == "7" && this.reels[2][1]["text"] == "7") {
          isWin = true;
          symbolIndexes = [2];
        }
        else if (this.reels[0][2]["text"] == "7" && this.reels[1][2]["text"] == "7" && this.reels[2][2]["text"] == "7") {
          isWin = true;
          symbolIndexes = [3];
        }

        if(isWin) {
          this.winSum += 150;
          this.markWinLine(reelIndexes, symbolIndexes);
          this.notifications.push(utils.getNow() + ": 3 7 symbols on any line, +150");
          return true;
        }

        return false;
      },
      checkAnyCombinationOfCherryAndSevenOnAnyLine: function() {
        var isCombinationOfCherryAndSevenOnAnyLine = false;
        var reelIndexes = [1,2,3];
        var symbolIndexes = new Array();
        for(var i = 0; i < utils.xConstants.NUMBER_OF_REELS; i++) { // visible symbols
          var sevenCount = 0;
          var cherryCount = 0;
          if(this.reels[0][i]["text"] == "7") { sevenCount++; }
          else if(this.reels[0][i]["text"] == "CHERRY") { cherryCount++; }

          if(this.reels[1][i]["text"] == "7") { sevenCount++; }
          else if(this.reels[1][i]["text"] == "CHERRY") { cherryCount++; }

          if(this.reels[2][i]["text"] == "7") { sevenCount++; }
          else if(this.reels[2][i]["text"] == "CHERRY") { cherryCount++; }

          if(sevenCount == 2 && cherryCount == 1 || sevenCount == 1 && cherryCount == 2) {
            isCombinationOfCherryAndSevenOnAnyLine = true;
            symbolIndexes.push(i + 1);
            break;
          }
        }
        if(isCombinationOfCherryAndSevenOnAnyLine){
          this.winSum += 75;
          this.markWinLine(reelIndexes, symbolIndexes);
          this.notifications.push(utils.getNow() + ": Any combination of CHERRY and 7 on any line, +75");
          return true;
        }
        return false;
      },
      check3xBarOnAnyLine: function() {
        var isWin = false;
        var reelIndexes = [1,2,3];
        var symbolIndexes;

        if(this.reels[0][0]["text"] == "3xBAR" && this.reels[1][0]["text"] == "3xBAR" && this.reels[2][0]["text"] == "3xBAR") {
          isWin = true;
          symbolIndexes = [1];
        } else if (this.reels[0][1]["text"] == "3xBAR" && this.reels[1][1]["text"] == "3xBAR" && this.reels[2][1]["text"] == "3xBAR") {
          isWin = true;
          symbolIndexes = [2];
        } else if (this.reels[0][2]["text"] == "3xBAR" && this.reels[1][2]["text"] == "3xBAR" && this.reels[2][2]["text"] == "3xBAR") {
            isWin = true;
            symbolIndexes = [3];
        }

        if(isWin) {
          this.winSum += 50;
          this.markWinLine(reelIndexes, symbolIndexes);
          this.notifications.push(utils.getNow() + ": 3 3xBAR symbols on any line, +50");
          return true;
        }

        return false;
      },
      checkBarOnAnyLine: function() {
        var isWin = false;
        var reelIndexes = [1,2,3];
        var symbolIndexes;

        if(this.reels[0][0]["text"] == "BAR" && this.reels[1][0]["text"] == "BAR" && this.reels[2][0]["text"] == "BAR") {
          isWin = true;
          symbolIndexes = [1];
        } else if(this.reels[0][1]["text"] == "BAR" && this.reels[1][1]["text"] == "BAR" && this.reels[2][1]["text"] == "BAR") {
          isWin = true;
          symbolIndexes = [2];
        } else if(this.reels[0][2]["text"] == "BAR" && this.reels[1][2]["text"] == "BAR" && this.reels[2][2]["text"] == "BAR") {
          isWin = true;
          symbolIndexes = [3];
        }

        if(isWin) {
          this.winSum += 10;
          this.markWinLine(reelIndexes, symbolIndexes);
          this.notifications.push(utils.getNow() + ": 3 BAR symbols on any line, +10");
          return true;
        }

        return false;
      },
      check2xBarOnAnyLine: function() {
        var isWin = false;
        var reelIndexes = [1,2,3];
        var symbolIndexes;

        if(this.reels[0][0]["text"] == "2xBAR" && this.reels[1][0]["text"] == "2xBAR" && this.reels[2][0]["text"] == "2xBAR") {
          isWin = true;
          symbolIndexes = [1];
        }
        else if (this.reels[0][1]["text"] == "2xBAR" && this.reels[1][1]["text"] == "2xBAR" && this.reels[2][1]["text"] == "2xBAR") {
          isWin = true;
          symbolIndexes = [2];
        }
        else if (this.reels[0][2]["text"] == "2xBAR" && this.reels[1][2]["text"] == "2xBAR" && this.reels[2][2]["text"] == "2xBAR") {
          isWin = true;
          symbolIndexes = [3];
        }

        if(isWin) {
          this.winSum += 20;
          this.markWinLine(reelIndexes, symbolIndexes);
          this.notifications.push(utils.getNow() + ": 3 2xBAR symbols on any line, +20");
          return true;
        }

        return false;
      },
      checkCombinationOfAnyBarOnAnyLine: function() {
        var barCounter = 0;
        var reelIndexes = [1,2,3];
        var symbolIndexes = Array();

        for(var s = 0; s < 3; s++) { // symbol, line
          barCounter = 0;
          for(var r = 0; r < utils.xConstants.NUMBER_OF_REELS; r++) { // reel, column
            if(this.reels[r][s]["text"].includes("BAR")) {
              barCounter++;
              symbolIndexes = [s + 1];
            }
          }
          if(barCounter == 3) {
              this.winSum += 5;
              this.markWinLine(reelIndexes, symbolIndexes);
              this.notifications.push(utils.getNow() + ": Combination of any BAR symbols on any line, +5");

              symbolIndexes = Array();
          }
        }
      },
      markWinLine: function(reelIndexes, symbolIndexes) {
        for(var r = 0; r < reelIndexes.length; r++) {
          var reel = document.getElementById("reel-" + reelIndexes[r]);
          for(var s = 0; s < symbolIndexes.length; s++) {
            var reelSymbol = reel.childNodes[symbolIndexes[s] - 1];
            reelSymbol.getElementsByClassName("win-line")[0].style.display = "block";
          }
        }
      },
      clearWinLines: function() {
        for(var r = 1; r <= utils.xConstants.NUMBER_OF_REELS; r++) {
          var reel = document.getElementById("reel-" + r);
          for(var s = 0; s < utils.xConstants.SYMBOLS_PER_REEL; s++) {
            var reelSymbol = reel.childNodes[s];
            reelSymbol.getElementsByClassName("win-line")[0].style.display = "none";
          }
        }
      }
    },
    watch: {
      totalBalance: function(newVal, oldVal) {
        if(!String(newVal).match(utils.xConstants.REG_EX_BETWEEN_1_5000)) {
          newVal = newVal != 0 ? newVal.slice(0, -1) : 0;
        }
          this.totalBalance = newVal;
      },
      winSum: function(newVal, oldVal) {
        this.winSumHasChanged = true;
        var that = this;
        setTimeout(function(){
            that.winSumHasChanged = false;
        }, 2000);
      }
    },
    data() {
      return {
        totalBalance: 5,
        winSum: 0,
        winSumHasChanged: false,
        blinkClass: 'blink-win',
        reels: [],
        notifications: []
      }
    }
}
