/**
@module bee
**/

/**
zip任务
-------------
压缩文件

### 用法

    <zip basedir='.' destfile='my.zip'>
      <fileset dir='.'>
        <exclude value='.svn'/>
      </fileset>
    <zip>

@class zip
**/
module.exports = function(bee) {

  var path = require('path');

  bee.register('zip', function(options, callback) {
    
    var fs = require('fs');
    var archiver = require('archiver');
    var archive = archiver('zip');

    var destfile = options.destfile || options.dest;
    if(!destfile){
      return bee.error('the destfile is required in zip task.');
    }
    
    var output = fs.createWriteStream(destfile);
    
    //event handler
    output.on('close', function() {
      bee.debug(destfile + ' created, ' + archive.pointer() + ' total bytes');
      callback();
    });
    archive.on('error', callback);
    archive.pipe(output);
    
    options.childNodes.forEach(function(item){
      if(item.name === 'fileset'){
        var fileset = bee.util.getFileSet(item.value);
        fileset.files.forEach(function(fileItem){
          if(bee.fileutil.isFile(fileItem)){
            archive.append(fs.createReadStream(fileItem), { name: fileItem, type: 'file'});
          }else{
            archive.append(null, { name: fileItem, type: 'directory'});
          }
        });
      }else if(item.name === 'item'){
        var name = item.value.name;
        var file = item.value.file;
        var value = item.value.value;
        if(!name){
          return callback('the name property of item tag is required in zip task.');
        }
        if(file){
          archive.append(fs.createReadStream(file), { name: name });
        }else{
          archive.append(value, {name: name});
        }
      }
    });
    
    archive.finalize();
    
  });
}