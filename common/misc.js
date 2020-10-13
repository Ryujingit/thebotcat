// normal rps, where p1 and p2 are either 'rock', 'paper', or 'scissors', and the return value is 1 if p2 wins, -1 if p1 wins, and 0 if its a tie
function rps(p1, p2) {
  if (p1 == p2) return 0;
  switch (p1) {
    case 'rock':
      if (p2 == 'paper') return 1;
      else return -1;
      break;
    case 'scissors':
      if (p2 == 'rock') return 1;
      else return -1;
      break;
    case 'paper':
      if (p2 == 'scissors') return 1;
      else return -1;
      break;
  }
}

module.exports = { rps };
