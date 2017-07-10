var superagent = require('superagent');
var cheerio = require('cheerio');

var targetUrl = "http://jandan.net/duan";
const duanziStore = []
var currentPage;

superagent.get(targetUrl)
.end(function(err, res){
    if(err){
        console.error(err);
        return;
    }
    console.log('Get HTML');
    // console.log(res.text);

    var $ = cheerio.load(res.text);
    currentPage = $('span.current-comment-page').first().text();
    currentPage = parseInt(currentPage.substr(1, currentPage.length-2));
    console.log(currentPage)

    $('.righttext + p').each(function(idx, elem){
        duanziStore[idx] = $(this).text();
        console.log($(this).text()+"\n");
    })
})
