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

async function propQuestion(order){
    var question = [
        {
            name: 'userChoice',
            message: "What is your next choice?",
            type: 'list',
            choices: ["One more", "来五个", "Exit"]
        }
    ]
    if (order == 'reverse') {
        question[0].choices = ["来五个", "One more", "Exit"]
    }
    return inquirer.prompt(question)
    // inquirer.prompt(question).then(function(userChoice){
    //     return userChoice;
    // }

}

async function duanziUpdate(originalData){
    let pageRead = originalData.pageRead
    let duanziStore = originalData.duanziStore
    return crawlerPromise.getARandomPagePromise(pageRead[0], pageRead)
}

async function mainloop(data, order){
    try {
        var userChoice = await propQuestion(order);
        if (userChoice['userChoice'] == 'One more') {
            order = null;
            console.log("\n" + data.duanziStore.shift()+"\n");
            // console.log(chalk.cyan("剩余选择次数: " + (i+1) + " / 100" + "\n"))

        }else if (userChoice["userChoice"] == "来五个") {
            order = 'reverse'
            clear();
            console.log(chalk.yellow("\n------- 段子*5 -------\n"))
            for (let i = 0; i < 5; i++){
                console.log(data.duanziStore.shift()+"\n");
            }
            // console.log(chalk.cyan("剩余选择次数: " + (i+1) + " /100" + "\n"))
        }else{
            process.exit()
        }

        if (data.duanziStore.length <= 5) {
            console.log("\n" + chalk.bgRed("段子不够了。。。补货中") + "\n")
            try {
                let randomPageRawData = await duanziUpdate(data)
                let duanziExtracted = await duanziExtractionPromise(randomPageRawData, randomPageRawData.pageRead)
                await mainloop(duanziExtracted, order)
            }catch(e){
                console.log(e)
                console.log("duanziUpdate in mainloop failed")
            }
        }else {
            await mainloop(data, order);
        }

    } catch(err){
        console.log(err);
        console.log("mainloop error");
    }

}

// console.log(genRandomPageNumber(3810))
module.exports = {
    genRandomPageNumber,
    welcomePromise,
    duanziExtractionPromise,
    mainloop
}
