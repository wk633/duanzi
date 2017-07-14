var utils = require('./utils');
var superagent = require('superagent');


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

module.exports = {
    superagentPromise: superagentPromise,
    getARandomPagePromise: getARandomPagePromise
}
