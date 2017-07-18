var figlet = require('figlet');
var cheerio = require('cheerio');
var crawlerPromise = require('./crawler_promise');
var inquirer = require('inquirer');
var clear = require('clear');
var chalk = require('chalk');

function genRandomPageNumber(currentPage){
    var base = currentPage - 200;
    return Math.ceil(Math.random() * (currentPage - base))+base;
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
            let duanziId = $(elem).find(".righttext a").text()
            let pArray = $(elem).find("p")
            let duanziContent = ""
            pArray.each(function(index, element){
                duanziContent += $(element).text() + "\n"
            })
            duanziStore[idx] = {
                duanziId,
                duanziContent
            }
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

async function mainloop(data, question, lastId){
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
                var oneDuanziReturn = await oneDuanziHandle(data);
                var nextQuestion = oneDuanziReturn['nextQuestion'];
                var duanziId = oneDuanziReturn['duanziId'];
                break;
            case "Another Five":
                var nextQuestion = await fiveDuanziHandle(data);
                break;
            case "看评论":
                var nextQuestion = await commentViewHandle(lastId);
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
                var duanziExtracted = await duanziExtractionPromise(randomPageRawData, randomPageRawData.pageRead)
                try {
                    if (userChoice['userChoice'] == "Another One") {
                        await mainloop(duanziExtracted, nextQuestion, duanziId)
                    }else {
                        await mainloop(duanziExtracted, nextQuestion)
                    }

                }catch(e){
                    errorHint(e, "try to enter another mainloop failed");
                }
            }catch(e){
                errorHint(e, "duanziUpdate or duanziextraction in mainloop failed")
            }
        }else {
            try {
                if (userChoice['userChoice'] == "Another One") {
                    await mainloop(data, nextQuestion, duanziId)
                }else {
                    await mainloop(data, nextQuestion)
                }
            }catch(e){
                errorHint(e, "try to enter another mainloop failed");
            }

        }

    } catch(err){
        errorHint(err, "mainloop failed")
    }

}

function oneDuanziHandle(data){
    var tmp = data.duanziStore.shift();
    console.log("\n" + tmp['duanziContent'] +"\n");
    return new Promise(function(resolve, reject){
        resolve({
            "nextQuestion": [
                {
                    name: 'userChoice',
                    message: "What is your next choice?",
                    type: 'list',
                    choices: ["看评论","Another One", "Another Five", "Exit"]
                }
            ],
            "duanziId": tmp["duanziId"]
        })
    })
}
function fiveDuanziHandle(data){
    clear();
    console.log(chalk.yellow("\n------- 段子*5 -------\n"))
    for (let i = 0; i < 5; i++){
        var tmp = data.duanziStore.shift();
        console.log(tmp['duanziContent']+"\n");
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
function commentViewHandle(lastId){
    return new Promise(function(resolve, reject){
        crawlerPromise.commentGetPromise(lastId)
        .then(
            (hotTucao)=>{
                if (hotTucao.length == 0){
                    console.log("没有吐槽。。"+"\n");
                }else{
                    for(let i = 0; i < hotTucao.length; i++){
                        let tmpTucao = hotTucao[i];
                        console.log(tmpTucao["comment_date"]);
                        console.log(tmpTucao["comment_content"]+"\n");
                    }
                }

                resolve([
                    {
                        name: 'userChoice',
                        message: "What is your next choice?",
                        type: 'list',
                        choices: ["Another One", "Another Five", "Exit"]
                    }
                ])
            },
            (err) => {
                errorHint(err, "crawlerPromise.commentGetPromise reject err")
                reject(err);
            }
        )
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
