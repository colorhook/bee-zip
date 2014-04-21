/**
mail test
-------------

**/
var bee = require('bee');
var plugin = require('../lib/index');
plugin(bee);

describe('bee-archive is an bee plugin', function(){
  

  xit("plugin is a function", function(){
    plugin.should.be.a('function');
  });

  xit("bee has zip, unzip, tar, untar task", function(){
    bee.task.getTask('zip').should.be.a('function');
    bee.task.getTask('unzip').should.be.a('function');
    //bee.task.getTask('tar').should.be.a('function');
    //bee.task.getTask('untar').should.be.a('function');
  });

  xit('zip can work', function(done){
    bee.createProject(__dirname + '/build.xml').execute('zip', done);
  });

  it('unzip can work', function(done){
    bee.createProject(__dirname + '/build.xml').execute('unzip', done);
  });

  xit('tar can work', function(done){
    bee.createProject(__dirname + '/build.xml').execute('tar', done);
  });

  xit('untar can work', function(done){
    bee.createProject(__dirname + '/build.xml').execute('untar', done);
  });

});


