const axios = require('axios')
const fs = require('fs')
const url = 'https://graphql-beta.bnbscriptions.xyz/'

const headers = {
    "Origin": "https://bnbscriptions.xyz",
    "Referer": "https://bnbscriptions.xyz/",
    "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
};

const main = () => {
    // 获取所有地址
    const addresses = fs.readFileSync(__dirname + '/obnb.txt').toString().split(/[(\r\n)\r\n]+/)
    addresses.forEach(item => {
        axios.post(url, {
            operationName: 'BrcBalances',
            query: "query BrcBalances($distinct: [BrcBalanceScalarFieldEnum!], $orderBy: [BrcBalanceOrderByWithRelationInput!], $where: BrcBalanceWhereInput) {\n  brcBalances(distinct: $distinct, orderBy: $orderBy, where: $where) {\n    assetIn {\n      name\n      storedIn\n      protocol\n      mintLimit\n      decimal\n      deployAt\n      __typename\n    }\n    aid\n    balance\n    balanceHex\n    balance_H\n    balance_L\n    __typename\n  }\n}",
            variables: {
                distinct: ['aid'],
                orderBy: [{ assetIn: { deployAt: 'desc' } }],
                where: {
                    address: { equals: item },
                    storedIn: { equals: 'opbnb' }
                }
            }
        }, { headers }).then(({ data }) => {
            console.log(`${item}---balance of obnb :${data.data.brcBalances[0].balance_H}`)
        })

    })
}

main()