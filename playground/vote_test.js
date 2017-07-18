var superagent = require('superagent');
var cheerio = require("cheerio");


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

superagentPromise("http://jandan.net/duan/page-"+2088)
.then(
    (response) => {
        var content = response.text
        var $ = cheerio.load(content);
        var duanziStore = []

        $('.commentlist li').each(function(idx, elem) {
            let commentLike = parseInt($(elem).find('.tucao-like-container span').text());
            let commentUnlike = parseInt($(elem).find('.tucao-unlike-container span').text());
            if (commentUnlike+ commentLike >= 50 && (commentLike / commentUnlike) < 0.618){
                // bad duanzi
            }else {
                let duanziId = $(elem).find(".righttext a").text()
                let pArray = $(elem).find("p")
                let duanziContent = ""
                pArray.each(function(index, element){
                    duanziContent += $(element).text() + "\n"
                })
                duanziStore.push({
                    duanziId,
                    duanziContent,
                    commentLike,
                    commentUnlike
                })
            }
        })

        console.log(duanziStore)
    },
    (err) => {
        console.log("superagentPromise in getARandomPagePromise error");
        reject(err);
    }
)
