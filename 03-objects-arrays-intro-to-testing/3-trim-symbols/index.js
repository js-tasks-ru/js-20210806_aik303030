/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (string === '' || size === 0) return '';

  if (!size) return string;

  const arr = [];
  let firstSymbol;
  let newStr;
  let oldStr;

  const getNewString = (str) => {
    firstSymbol = str[0];
    if (str.endsWith(firstSymbol)) return str;
    return getNewString(str.slice(0, str.length - 1));
  };

  const getOldString = (str) => {
    if (firstSymbol !== str[0]) return str;
    return getOldString(str.slice(1));
  };

  const getArr = (str) => {
    newStr = getNewString(str.slice(0, size));
    oldStr = getOldString(str.slice(size));

    arr.push(newStr);

    if (!oldStr.length) return;

    return getArr(oldStr);
  };

  getArr(string);

  return arr.join('');
}
