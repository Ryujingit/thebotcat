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