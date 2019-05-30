// https://coursesweb.net/nodejs/move-copy-file
var fs = require('fs');

//moves the $file to $dir2
var moveFile = (file, dir2)=>{
    //include the fs, path modules
    var fs = require('fs');
    var path = require('path');
  
    //gets file name and adds it to dir2
    var f = path.basename(file);
    var dest = path.resolve(dir2, f);
    
    if (!fs.existsSync(dir2)){
        fs.mkdirSync(dir2);
    }

    fs.rename(file, dest, (err)=>{
      if(err) throw err;
      else console.log('Successfully moved');
    });
  };
  
  moveFile('./dist/index.d.ts', './lib/');