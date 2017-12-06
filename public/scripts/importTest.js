var importTest = {
  hello: function() {
    return "world"
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = importTest
}
