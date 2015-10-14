define(function(){

  // Production steps of ECMA-262, Edition 5, 15.4.4.18
  // Reference: http://es5.github.io/#x15.4.4.18
  if (!Array.prototype.forEach) {

    Array.prototype.forEach = function(callback, thisArg) {

      var T, k;

      if (this == null) {
        throw new TypeError(' this is null or not defined');
      }

      // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
      var O = Object(this);

      // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
      // 3. Let len be ToUint32(lenValue).
      var len = O.length >>> 0;

      // 4. If IsCallable(callback) is false, throw a TypeError exception.
      // See: http://es5.github.com/#x9.11
      if (typeof callback !== "function") {
        throw new TypeError(callback + ' is not a function');
      }

      // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
      if (arguments.length > 1) {
        T = thisArg;
      }

      // 6. Let k be 0
      k = 0;

      // 7. Repeat, while k < len
      while (k < len) {

        var kValue;

        // a. Let Pk be ToString(k).
        //   This is implicit for LHS operands of the in operator
        // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
        //   This step can be combined with c
        // c. If kPresent is true, then
        if (k in O) {

          // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
          kValue = O[k];

          // ii. Call the Call internal method of callback with T as the this value and
          // argument list containing kValue, k, and O.
          callback.call(T, kValue, k, O);
        }
        // d. Increase k by 1.
        k++;
      }
      // 8. return undefined
    };
  }

  return {
    // detect a chinese word
    isChinese: function(word) {
      // TODO: is it a better way to dectect with `%u`?
      return /[\u4E00-\uFA29]+|[\uE7C7-\uE7F3]+/.test(word)
    },

    // detect javascript type
    jsType: function(obj) {
      var str = Object.prototype.toString.call(obj);
      return str.replace(/^\[object (\w+)\]$/, '$1');
    },

    // split Chinese words into an array
    toLetter: function(words, data){
      var that = this

      words = escape(words).split('%u'), words.shift(), words;
      words.forEach(function(item, i) {
        // rember to translate non-Chinese words to it's own unicode
        words[i] = data[item] ? data[item].split(/\s+/)[0].replace(/[1-5]/,'') : item.replace(/[%@*]+/g,'');
      })

      return words;
    },

    // build string to array
    toArray: function(words){
      var len = words.length
        , i = 0, arr = []
      for(;i<len;i++) {
        arr.push(words[i]);
      }
      return arr;
    },

    // flatten the 2-d array
    flatten: function(arr){
      var tmp = [];
      arr.forEach(function(item){
        tmp.concat ? (tmp = tmp.concat(item)) : tmp.push(item);
      })
      return tmp;
    }
  }
});