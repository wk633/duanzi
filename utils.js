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
        content = data.response.text;
        if (content == '') {
            reject('html content is empty, something went wrong');
        }
        pageRead = data.pageRead;
        var $ = cheerio.load(content);
        var duanziStore = []
        $('.row .text').each(function(idx, elem){
            pArray = $(elem).find("p")
            duanziContent = ""
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

function commonPropQuestion(data){
    var question = [
        {
            name: 'userChoice',
            message: "What is your next choice?",
            type: 'list',
            choices: ["One more", "来五个", "Exit"]
        }
    ]
    inquirer.prompt(question).then(function(userChoice){
        if (userChoice['userChoice'] == 'One more') {
            console.log("\n" + data.duanziStore.shift()+"\n");
        }else if (userChoice["userChoice"] == "来五个") {
            clear();
            console.log(chalk.yellow("\n------- 段子*5 -------\n"))
            for (var i = 0; i < 5; i++){
                console.log(data.duanziStore.shift()+"\n");
            }
        }else{
            process.exit()
        }

        if (data.duanziStore.length <= 5) {
            console.log("\n" + chalk.bgRed("段子不够了。。。补货中") + "\n")
            duanziUpdateCallback(data, commonPropQuestion)
        }else {
            commonPropQuestion(data)
        }

    });
}

function duanziUpdateCallback(originalData, callback){
    pageRead = originalData.pageRead
    duanziStore = originalData.duanziStore
    crawlerPromise.getARandomPagePromise(pageRead[0], pageRead)
    .then(
        (crawlerData) => {
            return duanziExtractionPromise(crawlerData, crawlerData.pageRead)
        },
        (err) => {console.log(err)}
    ).then(
        (extractedData) => {
            callback(extractedData)
        },
        (err) => {
            console.log(err)
        }
    )
}

// console.log(genRandomPageNumber(3810))
module.exports = {
    genRandomPageNumber,
    welcomePromise,
    duanziExtractionPromise,
    commonPropQuestion
}
