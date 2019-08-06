const csv = require('csv-parser');
const fs = require('fs');
 

const output = {
    "date": "",
    "cash_raised": 0.00,
    "total_number_of_shares": 0,
    "ownership": []
}

function Owner(investor, shares, cash_paid, ownership) {
    this.investor = investor;    // String
    this.shares = shares;        // Integer
    this.cash_paid = cash_paid;  // Decimal
    this.ownership = ownership;   // Decimal (percentage)
}

const results = [];   

fs.createReadStream('example_data.csv')
    .pipe(csv())
    .on('data', (data) => {
        results.push(data)
    })
    .on('end', () => {
        console.log('results[0]: ', results[0])
    })