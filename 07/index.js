const data = require('../parser')().split('\n');

const FACES_VALUES = { 'T': '10', 'J': '11', 'Q': '12', 'K': '13', 'A': '14' };
const CARDS_WITHOUT_JOKER = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

const getBestCard = (cards) => {
  const counts = {};
  let max = 0;

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    counts[card] = counts[card] ? counts[card] + 1 : 1;

    if (counts[card] > max && card !== 'J') {
      max = counts[card];
    }
  }

  return CARDS_WITHOUT_JOKER.find(el => counts[el] && counts[el] === max) || 'J';
};

class Hand {
  constructor(hand, withJokers = false) {
    const [cards, bid] = hand.split(' ');

    this.jokers = withJokers;
    this.cards = cards.split('');
    this.bid = Number(bid);
    this.value = this.getHandType() * 10e9 + this.getHandValue();
  }

  getHandValue() {
    return Number(this.cards.map(e => !isNaN(e) ? `0${e}` : ((this.jokers && e === 'J') ? '01' : FACES_VALUES[e])).join(''));
  }

  getHandType() {
    const cards = this.jokers
      ? this.cards.join('').replaceAll('J', getBestCard(this.cards)).split('')
      : this.cards;

    const uniques = [...new Set(cards)];

    switch (uniques.length) {
      case 1:
        return 6;
      case 2:
        return uniques.some(c => cards.filter(card => card === c).length === 4) ? 5 : 4;
      case 3:
        return uniques.some(c => cards.filter(card => card === c).length === 3) ? 3 : 2;
      case 4:
        return 1;
      case 5:
        return 0;
    }
  }
}

const getWinnings = hands => hands
  .sort((a, b) => a.value - b.value)
  .reduce((acc, hand, i) => acc + hand.bid * (i + 1), 0);

const hand1 = data.map(hand => new Hand(hand));
console.log(`1) ${getWinnings(hand1)}`);

const hand2 = data.map(hand => new Hand(hand, true));
console.log(`2) ${getWinnings(hand2)}`);
