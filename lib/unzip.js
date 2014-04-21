/**
@module bee
**/

/**
unzip任务
-------------
解压缩文件

### 用法

    <unzip src='my.zip' dest='my'/>

@class unzip
**/
module.exports = function(bee) {

  bee.register('unzip', function(options, callback) {
    
    var iconvLite = require('iconv-lite');

    //force load gbk
    var unzipping = false;
    var encoding = (options.encoding || 'gbk').toLowerCase();
    var supportChinese = (encoding === 'gbk' || encoding === 'gb2312')
    
    if(supportChinese){
      //force load gbk codec
      iconvLite.decode(new Buffer(''), 'gbk');
    }

    //hack see: https://github.com/bigsan/nodeunzip/blob/master/extend-buffer-tostring-encodings.js
    Buffer.prototype._$_toString = Buffer.prototype.toString;
    Buffer.prototype.toString = function(enc, start, end) {
      if (unzipping && enc == 'utf8' && supportChinese) {
        start = start || 0;
        end = end || this.length;
        var buf = this.slice(start, end);
        return iconvLite.decode(buf, 'gbk');
      }
      return this._$_toString.apply(this, arguments);
    };
    

    var fs = require('fs');
    var unzip = require('unzip');

    var src = options.src || options.file;
    var dest = options.dest || options.dir;

    if(!src || !dest){
      return bee.error('the src and dest options are required in unzip task.');
    }

    var unzipParser = unzip.Extract({ path: dest });
    //event handler
    unzipParser.on('error', function(err){
      unzipping = false;
      callback(err);
    });

    unzipParser.on('close', function(){
      unzipping = false;
      bee.debug(src + ' extracted to ' + dest);
      callback();
    });

    //start unzip
    unzipping = true;
    fs.createReadStream(src).pipe(unzipParser);

  });
}