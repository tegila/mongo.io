var Assembler = function() {
  Assembler.prototype.find = function() {
    console.log('add');
    return this;
  };

  Assembler.prototype.remove = function() {
    console.log('remove');
    return this;
  };

  Assembler.prototype.insert = function() {
    console.log('insert');
    return this;
  };

  Assembler.prototype.update = function() {
    console.log('update');
    return this;
  };

  if (this instanceof Assembler) {
    console.log('instanceOf');
    return this.Assembler;
  } else {
    console.log('new');
    return new Assembler();
  }
};


var test = Assembler();
test.add().del();