#! /usr/bin/env node

require('babel-polyfill');
var utils = require('./utils_compiled.js');
var crawlerPromise = require('./crawler_promise');
var chalk = require('chalk');
var clear = require('clear');
var cheerio = require('cheerio');
var inquirer = require('inquirer');
var clear = require('clear');
var currentPage;
var pageRead = [];
var duanziList = [];


var targetUrl = "http://jandan.net/duan"

utils.welcomePromise()
.then(
    (data) => {
        clear();
        console.log(chalk.cyan(data));
        console.log(chalk.yellow("      -- 段子:  拯救无聊时光 --"));
        console.log(chalk.yellow("        from jandan.net/duan"))
        console.log("\n\n");
        // get duanzi from web
        console.log('获取段子中...\n\n');
        return crawlerPromise.superagentPromise(targetUrl)
    },
    (err) => {
        console.log("utils.welcomePromise error");
        console.log(err)
    }
)
.then(
    (response) => {
        // first time get duanzi page

        // get maximum page
        var $ = cheerio.load(response.text);
        var currentPage = $('span.current-comment-page').first().text();
        currentPage = parseInt(currentPage.substr(1, currentPage.length-2));
        return crawlerPromise.getARandomPagePromise(currentPage, pageRead)
    },
    (err) => {
        console.log(err)
        console.log('crawlerPromise.superagentPromise error')
    }
)
.then(
    (data) => {
        // after get a random page content
        // duanzi extraction
        return utils.duanziExtractionPromise(data, data.pageRead)
    },
    (err) => {
        console.log(err)
        console.log('utils.getARandomPagePromise error')
    }
)
.then(
    (data) => {
        var firstDuanziData = data.duanziStore.shift()
        console.log(firstDuanziData['duanziContent']+"\n");
        var question = [
            {
                name: 'userChoice',
                message: "What is your next choice?",
                type: 'list',
                choices: ["Another One", "看评论", "Another Five", "Exit"]
            }
        ];
        utils.mainloop(data,  question, firstDuanziData["duanziId"]);
    },
    (err) => {
        console.log(err);
        console.log("utils.duanziExtractionPromise error")
    }
)
