function getName() {
    let p
    p = new Promise(function (resolve, reject) {
        setTimeout(function() {
            resolve('test')
        }, 2000)
    })
    return p
}
// getName().then(function (name) {
//     console.log(name)
// })

function promisify(f) {
    return function () {
        let args = Array.prototype.slice.call(arguments);
        return new Promise(function (resolve, reject) {
            args.push(function (err, result) {
                if (err) reject(err);
                else resolve(result);
            });
            f.apply(null, args);
        });
    }
}

// test inquirer usage in promise
var inquirer = require('inquirer');
function basic_problem() {
    var question = [
        {
            name: 'userChoice',
            message: "What is your next choice?",
            type: 'list',
            choices: ["One more", "来十个"]
        }
    ]
    return inquirer.prompt(question)
}
// basic_problem()
// .then(function(args){
//     console.log(args)
// })

// test superagent promise encapsulation
var superagent = require('superagent');

function superagentPromise(url, info){
    return new Promise(function(resolve, reject){
        superagent.get(url)
        .end(function(err, res) {
            if (err){
                reject(err)
            }else {
                console.log(info)
                resolve({
                    response: res,
                    addinfo: 'add info'
                })
            }
        })
    })
}
superagentPromise("http://jandan.net/duan/page-2381", 'test')
.then(function(data){
    // console.log(data.text)
    console.log(data.addinfo)
}, function(err){
    // console.log(err)
    console.log("err")
})
