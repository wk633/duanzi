var figlet = require('figlet');

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

// console.log(genRandomPageNumber(3810))
module.exports = {
    genRandomPageNumber: genRandomPageNumber,
    welcomePromise: welcomePromise
}
