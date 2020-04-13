const fs = require('fs');
const [, , ...args] = process.argv;

const commitMsg = fs.readFileSync(args[0], "utf8");

const log = 'message : ' + commitMsg + '\n';
console.log(log);

if (!commitMsg) {
    console.log('Veuillez ajouter un message au commit');
    process.exit(1);
}
else if (commitMsg.toLowerCase().indexOf("feature") !== 0 &&
    commitMsg.toLowerCase().indexOf("hotfix") !== 0 &&
    commitMsg.toLowerCase().indexOf("fix") !== 0 &&
    commitMsg.toLowerCase().indexOf("merge") !== 0 &&
    commitMsg.toLowerCase().indexOf("WIP") !== 0) {
    console.log('Veuillez commencer votre message par "Feature"|"Hotfix"|"Fix"');
    process.exit(1);
}