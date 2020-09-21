export default {
    template: `<div class="debug-area" v-bind:utils="utils">
                <h2>Debug area:</h2>
                <div class="debug-controls-container">
                  <div class="checkbox-container">
                    <label class="checkbox-label">
                      <input type="checkbox" unchecked id="isDebug" v-model="isDebug">
                      <span class="checkbox-custom rectangular"></span>
                    </label>
                  </div>
                  <div v-for="rIndx in utils.xConstants.NUMBER_OF_REELS">
                    <div class="select">
                      <select :id="'reel-' + rIndx + '-pos-select'">
                        <option value="1">Top</option>
                        <option value="2">Center</option>
                        <option value="3">Bottom</option>
                      </select>
                      <div class="select-arrow"></div>
                    </div>
                    <div class="select">
                      <select :id="'reel-' + rIndx + '-symbol-select'">
                        <option v-for="(r, rIndx in utils.reel" :id="'reel-' + r + '-symbol-select'" :value="r.index">{{ r.text }}</option>
                      </select>
                      <div class="select-arrow"></div>
                    </div>
                  </div>

                  <label for="spin-speed-select" class="spin-speed-label">Spin speed (ms):</label>
                  <div class="select">
                    <select id="spin-speed-select" name="spin-speed-select">
                      <option value="100" selected>100</option>
                      <option value="200">200</option>
                      <option value="300">300</option>
                      <option value="400">400</option>
                      <option value="500">500</option>
                    </select>
                    <div class="select-arrow"></div>
                  </div>
                </div>
              </div>`,
    components: {},
    created: function() {},
    methods: {},
    props: {
      utils: { type: Object, required: true }
    },
    data() {
      return {
        isDebug: false
      }
    }
}
