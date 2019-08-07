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

        // NO IDEA HOW TO PRINT A FLOAT WITH 2 DECIMALS (.00) WITHOUT CONVERTING TO STRING!!

        // destructure row
        let investment_date, shares_purchased, cash_paid, investor;
        // investment_date = 
        shares_purchased = parseInt(row[" SHARES PURCHASED"]);
        cash_paid = parseFloat(row[" CASH PAID"]).toFixed(2);
        investor = row[" INVESTOR"].trim();

        // csv-parser does NOT require a check/filter for headers
        // => results[0] is the first row of NON-HEADER data

        // check output["ownership"] for owner matching Investor name first
        let matchFound = false;
        while (!matchFound) {
            // output["ownership"].forEach((owner) => {
            for (i = 0; i < output["ownership"].length; i++) {
                let owner = output["ownership"][i];

                // If match is found, update data with row and break loop
                if (owner["investor"] == investor) {
                    console.log("match found!")
                    addRowToOwner(shares_purchased = shares_purchased, cash_paid = cash_paid, owner_index = i);
                    matchFound = true;
                }
            }
            // If no match is found, add owner to output
            if (!matchFound) {
                addNewOwner(investor = investor, shares_purchased = shares_purchased, cash_paid = cash_paid);
                matchFound = true;
            };
        }


        // WAIT TO CALCULATE EACH OWNER'S OWNERSHIP AT END!!

        

    })
    .on('end', () => {
        // console.log('results[0]: ', results[0]);
        calculateOwnership();
    })

// CURRENTLY: built w/o consideration of date
// => refactor to filter by date w/ If

// ONLY add to output["ownership"] array, then call updateOutputTotals()
function addNewOwner(investor, shares_purchased, cash_paid) {
    let owner = new Owner(investor = investor, shares = shares_purchased, cash_paid = cash_paid, ownership = 0.00);
    output["ownership"].push(owner);
    updateOutputTotals(shares_purchased, cash_paid);
}

// ONLY update object in output["ownership"] array, then call updateOutputTotals()
function addRowToOwner(shares_purchased, cash_paid, owner_index) {
    let owner = output["ownership"][i];
    owner["shares"] += shares_purchased;
    owner["cash_paid"] += cash_paid;

    updateOutputTotals(shares_purchased, cash_paid);
}

// Call after each row is processed
function updateOutputTotals(shares_purchased, cash_paid) {
    output["cash_raised"] += cash_paid;
    output["total_number_of_shares"] += shares_purchased;
}

// Call at end of CSV-parsing
function calculateOwnership() {
    console.log(output)
}