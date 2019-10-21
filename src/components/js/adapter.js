const numToSet = grade => {
  ++grade;
  return {
    grade: Math.floor((grade + 1) / 2),
    term: (grade % 2) ? 1 : 2,
  }
}

const setToNum = set => {
  let decr = set.term == 1 ? 1 : 0;
  return set.grade * 2 - decr;
}


export default {
  numToSet,
  setToNum
}