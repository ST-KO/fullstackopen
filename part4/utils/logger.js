const info = (...params) => {
  console.log(...params);
};

const error = (...pararms) => {
  console.error(...params);
};

module.exports = {
  info,
  error,
};
