/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */

export function sortStrings(arr, param = 'asc') {
  const newArr = [...arr];
  const order = {
    'asc': 1,
    'desc': -1,
  };
  const locales = ['ru', 'en'];
  const options = {
    caseFirst: 'upper',
  };
  newArr.sort((a, b) => {
    return order[param] * a.localeCompare(b, locales, options);
  });
  return newArr;
}
