var figlet = require('figlet');
var cheerio = require('cheerio');
var crawlerPromise = require('./crawler_promise');
var inquirer = require('inquirer');
var clear = require('clear');
var chalk = require('chalk');

function genRandomPageNumber(currentPage){
    return Math.ceil(Math.random() * (currentPage - 0));
}

function welcomePromise(){
    return new Promise(function(resolve, reject){
        figlet.text('Duan Zi', {
            font: "big",
            horizontalLayout: 'default',
            verticalLayout: 'default'
        }, function(err, data){
            if (err) {
                reject(err)
            }
            else {
                resolve(data)
            }
        })
    })
}

function duanziExtractionPromise(data, pageRead){
    return new Promise(function(resolve, reject){
        var content = data.response.text;
        if (content == '') {
            reject('html content is empty, something went wrong');
        }
        pageRead = data.pageRead;
        var $ = cheerio.load(content);
        var duanziStore = []
        $('.row .text').each(function(idx, elem){
            let pArray = $(elem).find("p")
            let duanziContent = ""
            pArray.each(function(index, element){
                duanziContent += $(element).text() + "\n"
            })
            duanziStore[idx] = duanziContent;
        })
        resolve({
            duanziStore,
            pageRead
        })

    })
}




async function propQuestion(question){
    return inquirer.prompt(question)
}

async function duanziUpdate(originalData){
    let pageRead = originalData.pageRead
    let duanziStore = originalData.duanziStore
    return crawlerPromise.getARandomPagePromise(pageRead[0], pageRead)
}

async function mainloop(data, question){
    if (question == null) {
        question = [
            {
                name: 'userChoice',
                message: "What is your next choice?",
                type: 'list',
                choices: ["Another One", "Another Five", "Exit"]
            }
        ]
    }
    try {
        var userChoice = await propQuestion(question);
        switch (userChoice['userChoice']) {
            case "Another One":
                var nextQuestion = await oneDuanziHandle(data);
                break;
            case "Another Five":
                var nextQuestion = await fiveDuanziHandle(data);
                break;
            case "看评论":
                var nextQuestion = await commentViewHandle();
                break;
            case "Exit":
                process.exit();
                break;
            default:
                break;
        }

        if (data.duanziStore.length <= 5) {
            console.log("\n" + chalk.bgRed("段子不够了。。。补货中") + "\n")
            try {
                let randomPageRawData = await duanziUpdate(data)
                let duanziExtracted = await duanziExtractionPromise(randomPageRawData, randomPageRawData.pageRead)
                await mainloop(duanziExtracted, nextQuestion)
            }catch(e){
                console.log(e)
                console.log("duanziUpdate in mainloop failed")
            }
        }else {
            await mainloop(data, nextQuestion);
        }

    } catch(err){
        errorHint(err, "mainloop failed")
    }

}

function oneDuanziHandle(data){
    console.log("\n" + data.duanziStore.shift()+"\n");
    return new Promise(function(resolve, reject){
        resolve([
            {
                name: 'userChoice',
                message: "What is your next choice?",
                type: 'list',
                choices: ["看评论","Another One", "Another Five", "Exit"]
            }
        ])
    })
}
function fiveDuanziHandle(data){
    clear();
    console.log(chalk.yellow("\n------- 段子*5 -------\n"))
    for (let i = 0; i < 5; i++){
        console.log(data.duanziStore.shift()+"\n");
    }
    return new Promise(function(resolve, reject){
        resolve([
            {
                name: 'userChoice',
                message: "What is your next choice?",
                type: 'list',
                choices: ["Another Five", "Another One", "Exit"]
            }
        ])
    })
}
function commentViewHandle(){
    console.log("\ncommentViewHandle\n");
    return new Promise(function(resolve, reject){
        resolve([
            {
                name: 'userChoice',
                message: "What is your next choice?",
                type: 'list',
                choices: ["Another One", "Another Five", "Exit"]
            }
        ])
    })

}
function errorHint(err, info){
    console.log(err);
    if (info) {
        console.log(info)
    }
}

// console.log(genRandomPageNumber(3810))
module.exports = {
    genRandomPageNumber,
    welcomePromise,
    duanziExtractionPromise,
    mainloop
}
