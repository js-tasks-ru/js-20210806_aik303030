/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */

export function createGetter(path) {
  const steps = path.split('.');
  let step;
  let counter = 0;
  return function getProperty(obj) {
    step = steps[counter];
    if (obj[step] === undefined) {
      return;
    }
    if (counter === steps.length - 1) return obj[step];
    counter++;
    return getProperty(obj[step]);
  };
}
