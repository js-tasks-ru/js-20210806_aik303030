/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
  if (!obj) return;
  const arr = Object.entries(obj);
  if (arr.length) {
    const newObj = {};
    arr.forEach(([key, value]) => {
      newObj[value] = key;
    });
    return newObj;
  }
  return {};
}
