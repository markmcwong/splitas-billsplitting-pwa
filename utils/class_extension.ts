declare interface String {
  toCurrencyFormat(): number;
}

String.prototype.toCurrencyFormat = function (this: string) {
  return parseFloat(parseFloat(this).toFixed(2));
};

export function check_cookie_by_name(name: string) {
  var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) {
    console.log(match[2]);
    return match[2];
  } else {
    console.log("--something went wrong---");
  }
}
