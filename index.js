var targetUrl = "http://jandan.net/duan";
var crawler = require('./crawler.js');
var figlet = require('figlet');
var chalk = require('chalk');
var clear = require('clear');
var inquirer = require('inquirer');

const pageRead = []

figlet.text('Duan Zi', {
    font: "big",
    horizontalLayout: 'default',
    verticalLayout: 'default'
}, function(err, data){
    if(err){
        console.log("Something went wrong");
        console.dir(err);
        return;
    }
    clear();
    console.log(chalk.cyan(data));
    console.log(chalk.yellow("      -- 段子:  拯救无聊时光 --"));
    console.log(chalk.yellow("        from jandan.net/duan"))
    console.log("\n\n");
    // get duanzi from web
    console.log('获取段子中...\n\n');

    crawler.initGet(targetUrl, function(duanziStore, currentPage){
        pageRead.push(currentPage);
        console.log(duanziStore.shift()+"\n\n")
        if (duanziStore.length <= 10) {
            // update duanziStore
            console.log(chalk.bgRed("段子不够了...补货中"))
            console.log("\n\n")
            crawler.updateDuanzi(duanziStore, pageRead, nextStepInquiry, duanziShow)
        }else {
            nextStepInquiry(duanziShow.bind(this, duanziStore))
        }


    })

})

var duanziShow = function(duanziStore, userChoice){
    if (userChoice['userChoice'] == 'One more') {
        console.log("\n\n" + duanziStore.shift()+"\n\n");
    }else if (userChoice["userChoice"] == "来十个") {
        for (var i = 0; i < 10; i++){
            console.log("\n\n" + duanziStore.shift()+"\n\n");
        }
    }else{
        process.exit()
    }
    nextStepInquiry(duanziShow.bind(this, duanziStore))
}

function nextStepInquiry(callback){
    var question = [
        {
            name: 'userChoice',
            message: "What is your next choice?",
            type: 'list',
            choices: ["One more", "来十个", "Exit"]
        }
    ]
    inquirer.prompt(question).then(callback);
}
