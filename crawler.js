var superagent = require('superagent');
var cheerio = require('cheerio');


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
        if (duanziStore.length < 10) {
            // get duanzi from next page
            currentPage -= 1;
            initGet("http://jandan.net/duan/page-"+currentPage, callback)
        }else {
            callback(duanziStore, currentPage)
        }
    })
}

function updateDuanzi(currentDuanzi, callback){
    
}

module.exports = {
    initGet: initGet,
    updateDuanzi: updateDuanzi
}
