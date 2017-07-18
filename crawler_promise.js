var superagent = require('superagent');
var utils = require('./utils.js');

function superagentPromise(url){
    return new Promise(function(resolve, reject){
        superagent.get(url)
        .end(function(err, res) {
            if (err){
                reject(err)
            }else {
                resolve(res)
            }
        })
    })
}

function getARandomPagePromise(maxPageNum, pageRead) {
    var utils = require('./utils.js');
    return new Promise(function(resolve, reject) {
        // generate a random number between 1 ~ maxPageNum which is not in pageRead
        var randomPageNum = utils.genRandomPageNumber(maxPageNum);
        while (pageRead.indexOf(randomPageNum) != -1){
            randomPageNum = utils.genRandomPageNumber(maxPageNum)
        }
        pageRead.push(randomPageNum)
        superagentPromise("http://jandan.net/duan/page-"+randomPageNum)
        .then(
            (response) => {
                resolve({
                    response: response,
                    pageRead: pageRead
                });
            },
            (err) => {
                console.log("superagentPromise in getARandomPagePromise error");
                reject(err);
            }
        )
    })
}

function commentGetPromise(num) {
    return new Promise(function(resolve, reject){
        superagentPromise("http://jandan.net/tucao/"+num)
        .then(
            (response) => {
                // console.log(response.text)
                responseJson = JSON.parse(response.text)
                if (responseJson.code != '0'){
                    reject("response error")
                }else {
                    var hotTucao = responseJson['hot_tucao'];
                    if (hotTucao.length < 6) {
                        hotTucao = hotTucao.concat(...responseJson.tucao)
                    }
                    hotTucao = hotTucao.slice(0,6);
                }
                resolve(hotTucao)
            }
        )
    })
}

module.exports = {
    superagentPromise: superagentPromise,
    getARandomPagePromise: getARandomPagePromise
}
