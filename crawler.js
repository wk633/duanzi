var superagent = require('superagent');
var cheerio = require('cheerio');
var utils = require('./util')

function initGet(targetUrl, callback){
    superagent.get(targetUrl)
    .end(function(err, res){
        if(err){
            console.error(err);
            return;
        }
        // console.log(res.text);

        var $ = cheerio.load(res.text);
        var currentPage = $('span.current-comment-page').first().text();
        currentPage = parseInt(currentPage.substr(1, currentPage.length-2));

        const duanziStore = []
        $('.righttext + p').each(function(idx, elem){
            duanziStore[idx] = $(this).text();
            // console.log($(this).text()+"\n");
            // fs.writeFileSync('duanzi.txt', duanziStore[idx]+"\n", {flag: 'a'})
        })
        callback(duanziStore, currentPage);
    })
}

function updateDuanzi(leftDuanzi, pageRead, nextStepInquiry, duanziShow){
    var maxPageNum = pageRead[0];
    var randomPageNum = utils.genRandomPageNumber(maxPageNum)
    while (pageRead.indexOf(randomPageNum) != -1){
        randomPageNum = utils.genRandomPageNumber(maxPageNum)
    }
    pageRead.push(randomPageNum)

    superagent.get("http://jandan.net/duan/page-"+randomPageNum)
    .end(function(err, res){
        if(err){
            console.error(err);
            return;
        }
        // console.log(res.text);

        var $ = cheerio.load(res.text);
        var currentPage = $('span.current-comment-page').first().text();
        currentPage = parseInt(currentPage.substr(1, currentPage.length-2));

        const duanziStore = []
        $('.righttext + p').each(function(idx, elem){
            duanziStore[idx] = $(this).text();
            // console.log($(this).text()+"\n");
            // fs.writeFileSync('duanzi.txt', duanziStore[idx]+"\n", {flag: 'a'})
        })
        nextStepInquiry(duanziShow.bind(this, duanziStore));
    })

}

module.exports = {
    initGet: initGet,
    updateDuanzi: updateDuanzi
}
