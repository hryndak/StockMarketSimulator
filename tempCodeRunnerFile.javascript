/**
 * @param {number[][]} accounts
 * @return {number}
 */
var maximumWealth = function(accounts) {
    let arr = new Array(accounts.length)
    for(let i = 0 ; i < accounts.length; i++) {
        for(let j = 0; j < accounts.length; j++) {
            arr += accounts[i][j];
        }
    }
    return Math.max(...arr);
};