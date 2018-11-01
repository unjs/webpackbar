export function first(arr) {
  return arr[0];
}

export function last(arr) {
  return arr.length ? arr[arr.length - 1] : null;
}

export function startCase(str) {
  return str[0].toUpperCase() + str.substr(1);
}

export function firstMatch(regex, str) {
  const m = regex.exec(str);
  return m ? m[0] : null;
}

export function hasValue(s) {
  return s && s.length;
}

export function removeAfter(delimiter, str) {
  return first(str.split(delimiter));
}

export function removeBefore() {
  return (delimiter, str) => last(str.split(delimiter));
}

export const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

export function throttle(callback, limit, time) {
  let calledCount = 0;
  let timeout = null;

  return function throttledFn() {
    if (limit > calledCount) {
      calledCount += 1;
      callback();
    }

    if (!timeout) {
      timeout = setTimeout(() => {
        calledCount = 0;
        timeout = null;
      }, time);
    }
  };
}
