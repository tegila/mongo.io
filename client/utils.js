module.exports = () => ({
  /* https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder  */
  str2ab: (str) => {
    const buf = new Uint8Array(str.length); // 2 bytes for each char
    for (let i = 0; i < str.length; i += 1) {
      buf[i] = str.charCodeAt(i);
    }
    return buf;
  },
  /* https://stackoverflow.com/questions/12075927/serialization-of-regexp */
  __parse_regex__: (obj) => {
    var key, value;
    for (key in obj) {
      value = obj[key];
      if (value !== null && value instanceof RegExp) {
        obj[key] = ("__REGEXP " + value.toString());
      } else if (typeof value === 'object') {
        __parse_regex__(value);
      }
    }
  }
});