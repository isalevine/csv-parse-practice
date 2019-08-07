const csv = require('csv-parser');
const fs = require('fs');
 

const output = {
    "date": "",
    "cash_raised": 0.00,
    "total_number_of_shares": 0,
    "ownership": []
}

// NO IDEA HOW TO PRINT A FLOAT WITH 2 DECIMALS (.00) WITHOUT CONVERTING TO STRING!!
function Owner(investor, shares, cash_paid, ownership) {
    this.investor = investor;    // String
    this.shares = shares;        // Integer
    this.cash_paid = cash_paid;  // Decimal
    this.ownership = ownership;   // Decimal (percentage)
}

// set filepath to 1st command-line argument, or to empty string (to catch errors)
const filepath = process.argv[2] || "";

fs.createReadStream(filepath)
    .on('error', () => {
        console.log("Invalid filepath! Exiting program.");
        process.exit();
    })
    .pipe(csv())
    .on('data', (row) => {
        let investment_date = new Date(row["#INVESTMENT DATE"]) // row["#INVESTMENT DATE"] is in 'yyyy-mm-dd' format
        let cutoff_date = validateDate(process.argv[3])

        // if user input is invalid as a date, set cutoff_date to today
        if (!cutoff_date) {
            cutoff_date = new Date();
        }

        // parse and store date in output["date"]
        parseDate(cutoff_date);

        // if investment_date is prior to cutoff_date, execute parsing code
        if (cutoff_date >= investment_date) {
            parseRow(row);
        }
    })
    .on('end', () => {
        calculateOwnership();
        let json = JSON.stringify(output);
        console.log(json);
    })

// regex per https://stackoverflow.com/a/35413963
function validateDate(input) {
    if (!input) {
        return false    // No input
    };
    let regex = /\d{4}-\d{2}-\d{2}/g;
    if (!input.match(regex)) {
        return false    // Invalid format
    };

    let date = new Date(input);
    let dateTime = date.getTime();
    if(!dateTime && dateTime !== 0) {
        return false    // NaN value, invalid date
    };

    return date
}

function parseDate(cutoff_date) {
    let dateString = cutoff_date.toISOString().slice(0, 10); // yyyy-mm-dd
    let dateArray = dateString.split("-"); // [ "yyyy", "mm", "dd"]
    dateString = dateArray[1] + "/" + dateArray[2] + "/" + dateArray[0]; // "mm/dd/yyyy"
    output["date"] = dateString;
}

function parseRow(row) {
    // destructure row
    let shares_purchased = parseInt(row[" SHARES PURCHASED"]);
    let cash_paid = parseFloat(row[" CASH PAID"]);
    let investor = row[" INVESTOR"].trim();

    // check output["ownership"] for owner matching Investor name first
    let matchFound = false;
    while (!matchFound) {
        // output["ownership"].forEach((owner) => {
        for (i = 0; i < output["ownership"].length; i++) {
            let owner = output["ownership"][i];

            // If match is found, update data with row and break loop
            if (owner["investor"] == investor) {
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
}

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
    for (i = 0; i < output["ownership"].length; i++) {
        let owner = output["ownership"][i];

        // rounding strategy per https://stackoverflow.com/a/9453447
        owner["ownership"] = Math.round((owner["shares"] / output["total_number_of_shares"]) * 10000) / 100
    };
}
