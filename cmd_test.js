var figlet = require('figlet');
var chalk = require('chalk');
var clear = require('clear');
var inquirer = require('inquirer');

figlet.text('Duan Zi', {
    font: "big",
    horizontalLayout: 'default',
    verticalLayout: 'default'
}, function(err, data){
    if(err){
        console.log("Something went wrong");
        console.dir(err);
        return;
    }
    clear();
    console.log(chalk.cyan(data));
    console.log(chalk.yellow("      -- 段子:  拯救无聊时光 --"));
    console.log("\n\n");
    // get duanzi from web
    
    nextStep(function(){
        console.log(arguments);
    })
})

function nextStep(callback){
    var question = [
        {
            name: 'userChoice',
            message: "What is your next choice?",
            type: 'list',
            choices: ["One more", "来十个"]
        }
    ]
    inquirer.prompt(question).then(callback);
}
