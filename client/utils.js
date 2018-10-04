  /* https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder  */
  /* https://stackoverflow.com/questions/12075927/serialization-of-regexp */
const self = module.exports = {
  str2ab: (str) => {
    const buf = new Uint8Array(str.length); // 2 bytes for each char
    for (let i = 0; i < str.length; i += 1) {
      buf[i] = str.charCodeAt(i);
    }
    return buf;
  },
  __parse_regex__: (obj) => {
    var key, value;
    for (key in obj) {
      value = obj[key];
      if (value !== null && value instanceof RegExp) {
        obj[key] = ("__REGEXP " + value.toString());
      } else if (typeof value === 'object') {
        self.__parse_regex__(value);
      }
    }
  }
};