var inquirer = require('inquirer');

inquirer.prompt(
    [
        {
            name: 'userChoice',
            message: "What is your next choice?",
            type: 'list',
            choices: ["Another One", "Another Five", "Exit"]
        }
    ]
).then(
    commonHandle,
    err
).then(
    commonProp,
    err
).then(
    commonHandle,
    err
).then(
    commonProp,
    err
).then(
    commonHandle,
    err
).then(
    commonProp,
    err
).then(
    commonHandle,
    err
).then(
    commonProp,
    err
).then(
    commonHandle,
    err
).then(
    commonProp,
    err
).then(
    commonHandle,
    err
).then(
    commonProp,
    err
)




function commonProp(question){
    return inquirer.prompt(question)
}

function commonHandle(userChoice) {
    console.log(userChoice)
    switch(userChoice['userChoice']){
        case 'Another One':
            return oneDuanziHandle();
            break;
        case 'Another Five':
            return fiveDuanziHandle();
            break;
        case '看评论':
            return commentViewHandle();
            break;
        case 'Exit':
            process.exit();
            break;
        default:
            break;
    }
}

function err(err, info){
    console.log(err);
    if (info){
        console.log(info);
    }
}

function oneDuanziHandle() {
    console.log("one duanzi handle..\n");
    return new Promise(function(resolve, reject){
        resolve([
            {
                name: 'userChoice',
                message: "What is your next choice?",
                type: 'list',
                choices: ["看评论","Another One", "Another Five", "Exit"]
            }
        ])
    })
}
function commentViewHandle() {
    console.log("comment related \n")
    return new Promise(function(resolve, reject){
        resolve([
            {
                name: 'userChoice',
                message: "What is your next choice?",
                type: 'list',
                choices: ["Another One", "Another Five", "Exit"]
            }
        ])
    })
}
function fiveDuanziHandle() {
    console.log("five duanzi handle\n");
    return new Promise(function(resolve, reject){
        resolve([
            {
                name: 'userChoice',
                message: "What is your next choice?",
                type: 'list',
                choices: ["Another Five", "Another One", "Exit"]
            }
        ])
    })
}
