var util = require('util');
var alphaChars = require('./alphaChars');
var numChars = require('./numChars');
var padend = require('lodash.padend');

function Backpack(io, options){

  if(io.io){
    //allow j5 board to be passed in
    this.io = io.io;
  }else{
    this.io = io;
  }

  options = options || {};

  this.options = options;

  this.address = options.address || 0x70;

  this.io.i2cConfig(0);
  this.io.i2cWrite(this.address, 0, [0x21]); // turn on oscillator
  this.io.i2cWrite(this.address, 0, [0x81]); // disp on
  this.setBrightness(options.brightness || 0xF); // 0x0 to 0xF);
}


Backpack.prototype.setBrightness = function(brightness) {
    this.io.i2cWrite(this.address,0, [0xE0 | brightness]);
};

Backpack.prototype.clearDisplay = function() {
    this.io.i2cWrite(this.address, 0, [0,0,0,0,0,0,0,0]);
};


/*** 8x8 Matrix backpack *********************************/

function Matrix8x8(io, options){
  Backpack.apply(this, arguments);
}

util.inherits(Matrix8x8, Backpack);

Matrix8x8.prototype.clearDisplay = function() {
    this.io.i2cWrite(this.address, 0, [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
};

Matrix8x8.prototype.drawBitmap = function(data) {
  var splitBits = [];
  data.forEach(function(i){
    splitBits.push(i & 0xFF);
    splitBits.push(i >> 8);
  });
  this.io.i2cWrite(0x70, 0, this.rotateBuffer(splitBits));
};

Matrix8x8.prototype.rotateBuffer = function(buf){
  var tempBuf = [];
  buf.forEach( function(value) {
    //Then shift last bit over if switched on it'll switch on 2^7
      var rotated = (value >> 1) | (value << 7);
      //Casting the 16-bit integer to 8-bit
      var eightBitArray = new Uint8Array([rotated]);
      //return the 8-bit value
     tempBuf.push(eightBitArray[0]); 
  })

  return tempBuf;
};


/*** 8x16 Matrix backpack *********************************/

function Matrix8x16(io, options){
  Backpack.apply(this, arguments);
}


util.inherits(Matrix8x16, Backpack);


Matrix8x16.prototype.drawBitmap = function(data) {
  //render the thing

};



/*** 8x8 Bi-Color Matrix backpack *********************************/

function BicolorMatrix(io, options){
  Backpack.apply(this, arguments);
}


util.inherits(BicolorMatrix, Backpack);


BicolorMatrix.prototype.drawBitmap = function(data) {
  //render the thing
};




/*** Alphanumeric 4 character backpack *********************************/

function AlphaNum4(io, options){
  Backpack.apply(this, arguments);
}


util.inherits(AlphaNum4, Backpack);


AlphaNum4.prototype.writeText = function(str) {
  var desiredBits = padend(str, 4, ' ').substring(0, 4).split('').map(function(c){
      return alphaChars[c.charCodeAt(0)] || 0;
  });
  var output = [];
  desiredBits.forEach(function(i){
    output.push(i & 0xFF);
    output.push(i >> 8);
  });
  this.io.i2cWrite(0x70, 0, output);
};


/*** 7-segment display x 4 backpack *********************************/

function SevenSegment(io, options){
  Backpack.apply(this, arguments);
}


util.inherits(SevenSegment, Backpack);


SevenSegment.prototype.writeText = function(str) {
  //render the thing
};


/*** Bargraph 24 backpack *********************************/

function Bargraph24(io, options){
  Backpack.apply(this, arguments);
}


util.inherits(Bargraph24, Backpack);


Bargraph24.prototype.drawGraph = function(data) {
  //render the thing
};



module.exports = {
  Backpack: Backpack,
  Matrix8x8: Matrix8x8,
  Matrix8x16: Matrix8x16,
  AlphaNum4: AlphaNum4,
  SevenSegment: SevenSegment,
  Bargraph24: Bargraph24
}
