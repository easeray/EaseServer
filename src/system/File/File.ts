/*
┌─────────────────────────────────────────────────────┐
|File Interface
|─────────────────────────────────────────────────────
|服务器内置的文件操作接口
|
|@Author:Cubesion
└─────────────────────────────────────────────────────┘
*/

import * as fs from 'fs';
import * as path from 'path';

export default class File {
  public write(filePath: string, fileContent: string, callback ? : Function): void {
    let file = fs.createWriteStream(filePath, {
      flags: 'w+',
      encoding: 'utf8'
    });
    file.write(fileContent);
    file.on('close', () => {
      callback.call(null, {}, true);
    });
    file.on('error', (err: any) => {
      callback.call(null, { code: err.code, message: err.message }, false);
    });
  }
  /*
  callback:function(err:object,data:string){
    
  }
  */
  public read(path:string, type: 'File' | 'Directory', callback: Function): void {
    if (type == 'File') {
      let file = fs.createReadStream(path, { highWaterMark: 1 });
      let fileCache: string = '';
      file.on('data', (data: any) => {
        fileCache += data.toString();
      });
      file.on('error', (err: any) => {
        callback.call(null, { code: err.code, message: err.message }, '');
      });
      file.on('close', () => {
        callback.call(null, {}, fileCache);
      });
    } else if (type == 'Directory') {
      let cache: any;
      fs.readdir(path, { withFileTypes: true }, (err, data) => {
        if (err) {
          callback.call(null, { code: err.code, message: err.message }, []);
        } else {
          (cache as fs.Dirent[]) = data;
          callback.call(null, {}, {
            isFile: function(index: number | string): boolean {
              if (typeof index == 'number') {
                if (index <= cache.length) {
                  if (cache[index].isFile()) {
                    return true;
                  } else {
                    return false;
                  }
                } else {
                  return false;
                }
              } else if (typeof index == 'string') {
                for (let i = 0; i < cache.length; i++) {
                  if (cache[i].name == index) {
                    if (cache[i].isFile()) {
                      return true;
                    } else {
                      return false;
                    }
                    break;
                  }
                }
              } else {
                return false;
              }
            },
            isDirectory: function(index: number | string): boolean {
              if (typeof index == 'number') {
                if (index <= cache.length) {
                  if (cache[index].isDirectory()) {
                    return true;
                  } else {
                    return false;
                  }
                } else {
                  return false;
                }
              } else if (typeof index == 'string') {
                for (let i = 0; i < cache.length; i++) {
                  if (cache[i].name == index) {
                    if (cache[i].isDirectory()) {
                      return true;
                    } else {
                      return false;
                    }
                    break;
                  }
                }
              } else {
                return false;
              }
            }
          });
        }
      });
    } else {
      callback.call(null, {}, undefined);
    }
  }
  /** 文件与目录复制操作*/
  public copy(source: {path:string,type:'File'|'Directory'},target:{path:string,type:'File'|'Directory'},callback:Function):void {
    if(source.type == 'File'){
      
    }else if(source.type == 'Directory'){
      if(target.type == 'Directory'){
        
      }else if(target.type == 'File'){
        
      }
    }else{
      return callback.call(null,{},false);
    }
  }
  /** 
  *文件与目录的创建，且文件无内容，目录里为空
  */
  public create(path: string, type: 'File' | 'Directory', callback: Function): boolean {
    if (type == 'File') {
      fs.open(path, 'wx+', (err, fd) => {
        if (err) callback.call(null, { code: err.code, message: err.message }, false);
        fs.write(fd, '', (err) => {
          if (err) {
            callback.call(null, { code: err.code, message: err.message }, false);
          } else {
            callback.call(null, {}, true);
            fs.close(fd);
          }
        });
      });
    } else if (type == 'Directory') {
      fs.mkdir(path,(err) => {
        if(err){
          callback.call(null,{code:err.code,message:err.message},false);
        }else{
          callback.call(null,{},true);
        }
      });
    } else {
      callback.call(null,{},false)
    }
  }
}
console.log('test')
