const chai = require('chai');

const expect = chai.expect;

chai.should();

const nodeLed = require('../');

describe('nodeLed', function(){
  it('node-led should be an object', function(done){
    nodeLed.should.be.a('object');
    done();
  })
})
