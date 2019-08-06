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
    .on('data', (row) => {
        results.push(row);

        // csv-parser does NOT require a check/filter for headers
        // => results[0] is the first row of NON-HEADER data

        // check output["ownership"] for owner matching Investor name first
        let matchFound = false;
        while (!matchFound) {
            output["ownership"].forEach((owner) => {
                // If match is found, update data with row and break loop
                if (owner["investor"] === row["INVESTOR"]) {
                    addRowToOwner(row, owner);
                    matchFound = true;
                }
            })
            // If no match is found, add owner to output
            addNewOwner(row);
        }


        // WAIT TO CALCULATE EACH OWNER'S OWNERSHIP AT END!!

        

    })
    .on('end', () => {
        console.log('results[0]: ', results[0])
    })


    
// ONLY add to output["ownership"] array, then call updateOutputTotals()
function addNewOwner(row) {
    let owner = new Owner(investor: row["INVESTOR"], shares: row["SHARES PURCHASED"], cash_paid: row["CASH PAID"], ownership: 0.00);

}

// ONLY update object in output["ownership"] array, then call updateOutputTotals()
function addRowToOwner(row, owner) {

}

// Call after each row is processed
function updateOutputTotals(row) {

}

// Call at end of CSV-parsing
function calculateOwnership() {

}