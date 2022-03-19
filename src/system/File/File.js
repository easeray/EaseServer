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
exports.__esModule = true;
var fs = require("fs");
var File = /** @class */ (function () {
    function File() {
    }
    File.prototype.write = function (filePath, fileContent) {
        var returnData;
        var file = fs.createWriteStream(filePath, {
            flags: 'w+',
            encoding: 'utf8'
        });
        file.write(fileContent);
        file.on('close', function () {
            returnData = true;
        });
        file.on('error', function () {
            returnData = false;
        });
        return returnData;
    };
    File.prototype.read = function (path, type) {
        if (type == 'File') {
            var file = fs.createReadStream(path, { highWaterMark: 1 });
            var fileCache_1 = '';
            file.on('data', function (data) {
                fileCache_1 += data.toString();
            });
            file.on('error', function () {
                return false;
            });
            file.on('close', function () {
                return fileCache_1;
            });
        }
        else if (type == 'Directory') {
            var cache_1;
            var returnData_1;
            fs.readdir(path, { withFileTypes: true }, function (err, data) {
                if (err) {
                    returnData_1 = false;
                }
                else {
                    cache_1 = data;
                    returnData_1 = {
                        isFile: function (index) {
                            if (typeof index == 'number') {
                                if (index <= cache_1.length) {
                                    if (cache_1[index].isFile()) {
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
                                for (var i = 0; i < cache_1.length; i++) {
                                    if (cache_1[i].name == index) {
                                        if (cache_1[i].isFile()) {
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
                                if (index <= cache_1.length) {
                                    if (cache_1[index].isDirectory()) {
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
                                for (var i = 0; i < cache_1.length; i++) {
                                    if (cache_1[i].name == index) {
                                        if (cache_1[i].isDirectory()) {
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
                            var data;
                            for (var i = 0; i < cache_1.length; i++) {
                                data.join(cache_1[i].name);
                            }
                            return data;
                        }
                    };
                }
            });
            return returnData_1;
        }
        else {
            return false;
        }
    };
    return File;
}());
exports["default"] = File;
