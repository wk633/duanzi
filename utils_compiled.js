'use strict';

var propQuestion = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(question) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        return _context.abrupt('return', inquirer.prompt(question));

                    case 1:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function propQuestion(_x) {
        return _ref.apply(this, arguments);
    };
}();

var duanziUpdate = function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(originalData) {
        var pageRead, duanziStore;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        pageRead = originalData.pageRead;
                        duanziStore = originalData.duanziStore;
                        return _context2.abrupt('return', crawlerPromise.getARandomPagePromise(pageRead[0], pageRead));

                    case 3:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function duanziUpdate(_x2) {
        return _ref2.apply(this, arguments);
    };
}();

var mainloop = function () {
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(data, question, lastId) {
        var userChoice, oneDuanziReturn, nextQuestion, duanziId, randomPageRawData, duanziExtracted;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        if (question == null) {
                            question = [{
                                name: 'userChoice',
                                message: "What is your next choice?",
                                type: 'list',
                                choices: ["Another One", "Another Five", "Exit"]
                            }];
                        }
                        _context3.prev = 1;
                        _context3.next = 4;
                        return propQuestion(question);

                    case 4:
                        userChoice = _context3.sent;
                        _context3.t0 = userChoice['userChoice'];
                        _context3.next = _context3.t0 === "Another One" ? 8 : _context3.t0 === "Another Five" ? 14 : _context3.t0 === "看评论" ? 18 : _context3.t0 === "Exit" ? 22 : 24;
                        break;

                    case 8:
                        _context3.next = 10;
                        return oneDuanziHandle(data);

                    case 10:
                        oneDuanziReturn = _context3.sent;
                        nextQuestion = oneDuanziReturn['nextQuestion'];
                        duanziId = oneDuanziReturn['duanziId'];
                        return _context3.abrupt('break', 25);

                    case 14:
                        _context3.next = 16;
                        return fiveDuanziHandle(data);

                    case 16:
                        nextQuestion = _context3.sent;
                        return _context3.abrupt('break', 25);

                    case 18:
                        _context3.next = 20;
                        return commentViewHandle(lastId);

                    case 20:
                        nextQuestion = _context3.sent;
                        return _context3.abrupt('break', 25);

                    case 22:
                        process.exit();
                        return _context3.abrupt('break', 25);

                    case 24:
                        return _context3.abrupt('break', 25);

                    case 25:
                        if (!(data.duanziStore.length <= 5)) {
                            _context3.next = 54;
                            break;
                        }

                        console.log("\n" + chalk.bgRed("段子不够了。。。补货中") + "\n");
                        _context3.prev = 27;
                        _context3.next = 30;
                        return duanziUpdate(data);

                    case 30:
                        randomPageRawData = _context3.sent;
                        _context3.next = 33;
                        return duanziExtractionPromise(randomPageRawData, randomPageRawData.pageRead);

                    case 33:
                        duanziExtracted = _context3.sent;
                        _context3.prev = 34;

                        if (!(userChoice['userChoice'] == "Another One")) {
                            _context3.next = 40;
                            break;
                        }

                        _context3.next = 38;
                        return mainloop(duanziExtracted, nextQuestion, duanziId);

                    case 38:
                        _context3.next = 42;
                        break;

                    case 40:
                        _context3.next = 42;
                        return mainloop(duanziExtracted, nextQuestion);

                    case 42:
                        _context3.next = 47;
                        break;

                    case 44:
                        _context3.prev = 44;
                        _context3.t1 = _context3['catch'](34);

                        errorHint(_context3.t1, "try to enter another mainloop failed");

                    case 47:
                        _context3.next = 52;
                        break;

                    case 49:
                        _context3.prev = 49;
                        _context3.t2 = _context3['catch'](27);

                        errorHint(_context3.t2, "duanziUpdate or duanziextraction in mainloop failed");

                    case 52:
                        _context3.next = 67;
                        break;

                    case 54:
                        _context3.prev = 54;

                        if (!(userChoice['userChoice'] == "Another One")) {
                            _context3.next = 60;
                            break;
                        }

                        _context3.next = 58;
                        return mainloop(data, nextQuestion, duanziId);

                    case 58:
                        _context3.next = 62;
                        break;

                    case 60:
                        _context3.next = 62;
                        return mainloop(data, nextQuestion);

                    case 62:
                        _context3.next = 67;
                        break;

                    case 64:
                        _context3.prev = 64;
                        _context3.t3 = _context3['catch'](54);

                        errorHint(_context3.t3, "try to enter another mainloop failed");

                    case 67:
                        _context3.next = 72;
                        break;

                    case 69:
                        _context3.prev = 69;
                        _context3.t4 = _context3['catch'](1);

                        errorHint(_context3.t4, "mainloop failed");

                    case 72:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this, [[1, 69], [27, 49], [34, 44], [54, 64]]);
    }));

    return function mainloop(_x3, _x4, _x5) {
        return _ref3.apply(this, arguments);
    };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var figlet = require('figlet');
var cheerio = require('cheerio');
var crawlerPromise = require('./crawler_promise');
var inquirer = require('inquirer');
var clear = require('clear');
var chalk = require('chalk');

function genRandomPageNumber(currentPage) {
    var base = currentPage - 100;
    return Math.ceil(Math.random() * (currentPage - base)) + base;
}

function welcomePromise() {
    return new Promise(function (resolve, reject) {
        figlet.text('Duan Zi', {
            font: "big",
            horizontalLayout: 'default',
            verticalLayout: 'default'
        }, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

function duanziExtractionPromise(data, pageRead) {
    return new Promise(function (resolve, reject) {
        var content = data.response.text;
        if (content == '') {
            reject('html content is empty, something went wrong');
        }
        pageRead = data.pageRead;
        var $ = cheerio.load(content);
        var duanziStore = [];

        $('.commentlist li').each(function (idx, elem) {
            var commentLike = parseInt($(elem).find('.tucao-like-container span').text());
            var commentUnlike = parseInt($(elem).find('.tucao-unlike-container span').text());
            if (commentUnlike + commentLike >= 50 && commentLike / commentUnlike < 0.618) {
                // bad duanzi
            } else {
                var duanziId = $(elem).find(".righttext a").text();
                var pArray = $(elem).find("p");
                var duanziContent = "";
                pArray.each(function (index, element) {
                    duanziContent += $(element).text() + "\n";
                });
                duanziStore.push({
                    duanziId: duanziId,
                    duanziContent: duanziContent,
                    commentLike: commentLike,
                    commentUnlike: commentUnlike
                });
            }
        });

        resolve({
            duanziStore: duanziStore,
            pageRead: pageRead
        });
    });
}

function oneDuanziHandle(data) {
    var tmp = data.duanziStore.shift();
    console.log("\n" + tmp['duanziContent'] + "\n");
    return new Promise(function (resolve, reject) {
        resolve({
            "nextQuestion": [{
                name: 'userChoice',
                message: "What is your next choice?",
                type: 'list',
                choices: ["Another One", "看评论", "Another Five", "Exit"]
            }],
            "duanziId": tmp["duanziId"]
        });
    });
}
function fiveDuanziHandle(data) {
    clear();
    console.log(chalk.yellow("\n------- 段子*5 -------\n"));
    for (var i = 0; i < 5; i++) {
        var tmp = data.duanziStore.shift();
        console.log(tmp['duanziContent'] + "\n");
    }
    return new Promise(function (resolve, reject) {
        resolve([{
            name: 'userChoice',
            message: "What is your next choice?",
            type: 'list',
            choices: ["Another Five", "Another One", "Exit"]
        }]);
    });
}
function commentViewHandle(lastId) {
    return new Promise(function (resolve, reject) {
        crawlerPromise.commentGetPromise(lastId).then(function (hotTucao) {
            console.log("");
            if (hotTucao.length == 0) {
                console.log(chalk.yellow("> 没有吐槽。。") + "\n");
            } else {
                for (var i = 0; i < hotTucao.length; i++) {
                    var tmpTucao = hotTucao[i];
                    // console.log(tmpTucao["comment_date"]);
                    console.log(chalk.yellow(tmpTucao["comment_content"].replace(/<a.*?\/a>/, "").trim() + "\n"));
                }
            }

            resolve([{
                name: 'userChoice',
                message: "What is your next choice?",
                type: 'list',
                choices: ["Another One", "Another Five", "Exit"]
            }]);
        }, function (err) {
            errorHint(err, "crawlerPromise.commentGetPromise reject err");
            reject(err);
        });
    });
}
function errorHint(err, info) {
    console.log(err);
    if (info) {
        console.log(info);
    }
}

// console.log(genRandomPageNumber(3810))
module.exports = {
    genRandomPageNumber: genRandomPageNumber,
    welcomePromise: welcomePromise,
    duanziExtractionPromise: duanziExtractionPromise,
    mainloop: mainloop
};
