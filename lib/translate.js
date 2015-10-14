define(['./util','./Mandarin'], function(util, code){
  var translate = {};

  var make = function(str, data, separator) {

    // replace spaces to `_` make it more easy to split words in a right form
    var arr = str.replace(/\s+/g, '_').split(/\b/),
      separatorReg = new RegExp('\\' + separator + '\+', 'g')

    // translating, yay!!!
    arr.forEach(function(item, i) {
      if (util.isChinese(item)) arr[i] = util.toLetter(item, data);
    })

    // consider that the `_` we have made
    return util.flatten(arr).join(separator).replace(/_/g, separator).replace(separatorReg, separator).toLowerCase();
  }

  var notation = {
    1: "āēīōū",
    2: "áéíóú",
    3: "ǎěǐǒǔ",
    4: "àèìòù",
    5: "aeiou"
  }

  var phoneticize = function(words) {

    var tmp = []

    words.forEach(function(word) {
      var hasNote = /[1-5]$/.test(word),
        note = hasNote ? word.slice(-1) : 5,
        char = hasNote ? word.slice(0, -1) : word,
        result

      if (note === 5) return tmp.push(char.toLowerCase());

      result = char.toLowerCase().replace(/([aeiou])/, function(i, match) {
        var at = notation[5].indexOf(match)
        return notation[note].charAt(at);
      })

      tmp.push(result);
    })

    return tmp;
  }

  translate.letter = function(){
    var args = [].slice.call(arguments)
      , originalArgs = args.slice()
      , chinese = args.shift()
      , last = args.pop()
      , separator

    if(!originalArgs.length) return '';

    callback = last && util.jsType(last) === 'Function' ? last : null;

    // consider the '0' in javascript and etc.
    separator = args.length ? args[0] : callback !== last && last ?  last : '';

    // make = require('./make')
    return callback ? callback.call(this, null, make(chinese, code, separator)) :
      make(chinese, code, separator);
  }

  /* translate Chinese into Pinyin(letters with notation)
   * @param `chinese` {String} Chinese words or wahtever
   */
  translate.pinyin = function(chinese){
    if(!chinese) return [];
    if(!util.isChinese(chinese)) return [chinese];

    var words = util.toArray(chinese)
      // , phoneticize = require('./phoneticize')
      , hanzi, result

    // find out chinese words
    hanzi = words.filter(function(word){
      return util.isChinese(word);
    })

    // phoneticize notation
    hanzi.forEach(function(word){
      var key = escape(word).slice(2)
        , pinyin = code[key].split(/\s+/)
        words[words.indexOf(word)] = phoneticize(pinyin);
    })

    // concat non-chinese words
    words.reduce(function(prev, cur, i){
      if(util.jsType(prev) !== 'Array' && util.jsType(cur) !=='Array') {
        prev = prev || '';

        // remember the numbers
        words[i] = prev + '' + cur;
        util.jsType(words[--i]) !== 'Array'  && (words[i] = '');

        return prev + '' + cur;
      }
    })

    // generate return value
    result = words.filter(function(item){
      return item.length;
    })

    return result;
  }

  return translate;
});