function genRandomPageNumber(currentPage){
    return Math.floor(Math.random() * (currentPage - 0));
}
// console.log(genRandomPageNumber(3810))
module.exports = {
    genRandomPageNumber: genRandomPageNumber
}
