var superagent = require('superagent');
var cheerio = require('cheerio');

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

superagentPromise("http://jandan.net/duan/page-2419")
.then(
    (response) => {
        return new Promise(function(resolve, reject){
            resolve({
                response: response
            });
        })
    },
    (err) => {
        console.log("superagentPromise in getARandomPagePromise error");
        reject(err);
    }
).then(
    (data) => {
        var content = data.response.text;
        var $ = cheerio.load(content);
        var duanziStore = []
        $('.row .text').each(function(idx, elem){
            let id = $(elem).find(".righttext a").text()
            let pArray = $(elem).find("p")
            let duanziContent = ""
            pArray.each(function(index, element){
                duanziContent += $(element).text() + "\n"
            })
            duanziStore[idx] = {
                id,
                duanziContent
            };
        })
        // console.log(duanziStore);
    }
)

superagentPromise("http://jandan.net/tucao/3510939")
.then(
    (response) => {
        // console.log(response.text)
        responseJson = JSON.parse(response.text)
        if (responseJson.code != '0'){
            console.log("response error")
        }else {
            var hotTucao = responseJson['hot_tucao'];
            if (hotTucao.length < 6) {
                hotTucao = hotTucao.concat(...responseJson.tucao)
            }
            hotTucao = hotTucao.slice(0,6);
        }

        console.log(hotTucao)
    }
)
