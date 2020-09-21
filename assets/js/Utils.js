const REG_EX_BETWEEN_1_5000 = /^(?:[1-9]|\d{2,3}|[1-4]\d{3}|5000)$/;

export default {
  xConstants: {
      NUMBER_OF_REELS: 3,
      SYMBOLS_PER_REEL: 5,
      SYMBOL_HEIGHT: 120,
      SYMBOL_MOVE_DURATION: 100,
      REG_EX_BETWEEN_1_5000: REG_EX_BETWEEN_1_5000
  },
  reel:[
    {
      index: 1,
      position: 1,
      text: '3xBAR',
      img: '3xBAR.png',
    },
    {
      index: 2,
      position: 2,
      text: 'BAR',
      img: 'BAR.png',
    },
    {
      index: 3,
      position: 3,
      text: '2xBAR',
      img: '2xBAR.png'
    },
    {
      index: 4,
      position: 4,
      text: '7',
      img: '7.png',
    },
    {
      index: 5,
      position: 5,
      text: 'CHERRY',
      img: 'Cherry.png',
    }
  ],
  getNow: function() {
    return new Date().toLocaleString();
  },
  generateRandomNumber: function(min, max) {
      var n = Math.random() * (max - min) + min;
      return n;
  }
}
