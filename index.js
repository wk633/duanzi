var targetUrl = "http://jandan.net/duan";
var crawler = require('./crawler.js');

console.log('获取段子中...');

crawler.initGet(targetUrl, function(duanziStore, currentPage){
    console.log(currentPage);
})
