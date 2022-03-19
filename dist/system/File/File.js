"use strict";
/*
┌─────────────────────────────────────────────────────┐
|File Interface
|─────────────────────────────────────────────────────
|服务器内置的文件操作接口
|
|@Author:Cubesion
└─────────────────────────────────────────────────────┘
*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
class File {
    write(filePath, fileContent, callback) {
        let file = fs.createWriteStream(filePath, {
            flags: 'w+',
            encoding: 'utf8'
        });
        file.write(fileContent);
        file.on('close', () => {
            callback.call(null, {}, true);
        });
        file.on('error', (err) => {
            callback.call(null, { code: err.code, message: err.message }, false);
        });
    }
    /*
    callback:function(err:object,data:string){
      
    }
    */
    read(path, type, callback) {
        if (type == 'File') {
            let file = fs.createReadStream(path, { highWaterMark: 1 });
            let fileCache = '';
            file.on('data', (data) => {
                fileCache += data.toString();
            });
            file.on('error', (err) => {
                callback.call(null, { code: err.code, message: err.message }, '');
            });
            file.on('close', () => {
                callback.call(null, false, fileCache);
            });
        }
        else if (type == 'Directory') {
            let cache;
            fs.readdir(path, { withFileTypes: true }, (err, data) => {
                if (err) {
                    callback.call(null, { code: err.code, message: err.message }, []);
                }
                else {
                    cache = data;
                    callback.call(null, {}, {
                        isFile: function (index) {
                            if (typeof index == 'number') {
                                if (index <= cache.length) {
                                    if (cache[index].isFile()) {
                                        return true;
                                    }
                                    else {
                                        return false;
                                    }
                                }
                                else {
                                    this.isFile(index - 1);
                                    return {
                                        code: -1,
                                        message: 'Not Valuable Index,try again.'
                                    };
                                }
                            }
                            else if (typeof index == 'string') {
                                for (let i = 0; i < cache.length; i++) {
                                    if (cache[i].name == index) {
                                        if (cache[i].isFile()) {
                                            return true;
                                        }
                                        else {
                                            return false;
                                        }
                                        break;
                                    }
                                }
                            }
                            else {
                                return {
                                    code: -2,
                                    message: 'unexpect agrument'
                                };
                            }
                        },
                        isDirectory: function (index) {
                            if (typeof index == 'number') {
                                if (index <= cache.length) {
                                    if (cache[index].isDirectory()) {
                                        return true;
                                    }
                                    else {
                                        return false;
                                    }
                                }
                                else {
                                    this.isDirectory(index - 1);
                                    return {
                                        code: -1,
                                        message: 'Not Valuable Index,try again.'
                                    };
                                }
                            }
                            else if (typeof index == 'string') {
                                for (let i = 0; i < cache.length; i++) {
                                    if (cache[i].name == index) {
                                        if (cache[i].isDirectory()) {
                                            return true;
                                        }
                                        else {
                                            return false;
                                        }
                                        break;
                                    }
                                }
                            }
                            else {
                                return {
                                    code: -2,
                                    message: 'unexpect agrument'
                                };
                            }
                        },
                        getAll: function () {
                            let data;
                            for (let i = 0; i < cache.length; i++) {
                                data.join(cache[i].name);
                            }
                            return data;
                        }
                    });
                }
            });
        }
        else {
            callback.call(null, {}, undefined);
        }
    }
}
exports.default = File;
