declare interface String {
  toCurrencyFormat(): number;
}

String.prototype.toCurrencyFormat = function (this: string) {
  return parseFloat(parseFloat(this).toFixed(2));
};
