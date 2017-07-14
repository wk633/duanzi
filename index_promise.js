var util = require('./utils');
var crawlerPromise = require('./crawler_promise');
var chalk = require('chalk');
var clear = require('clear');
var currentPage
var pageRead = []

var targetUrl = "http://jandan.net/duan"

util.welcomePromise()
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
        console.log("util.welcomePromise error");
        console.log(err)
    }
)
.then(
    (response) => {
        // first time get duanzi page
        console.log(response.text)
        console.log("get first page success")
    },
    (err) => {
        console.log(err)
        console.log('crawlerPromise.superagentPromise error')
    }
)
