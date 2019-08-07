# Cap Table CSV Parser

    Cap Table CSV Parser is a command-line tool for processing cap tables
    entered as CSVs with headers for "#INVESTMENT DATE", "SHARES PURCHASED",
    "CASH PAID", and "INVESTOR". The program will generate a summary including
    total "cash_raised", "total_number_of_shares", and a summary of ownership
    with each owner's name as "investor", their "shares", their total "cash paid",
    and their percent "ownership" of the "total_number_of_shares".

    Cap Table CSV Parser also accepts an optional command-line argument for a date
    in YYYY-MM-DD format. If provided, only investments made on or before that date
    will be processed; if not provided, the default cutoff date is today.


## Installation

    Cap Table CSV Parser is a Node.js application. It makes use of the 'csv-parser'
    package: https://www.npmjs.com/package/csv-parser 
    
    To install:
        1. Clone this repo and `cd` to enter the directory.
        2. Run `npm install` to install dependencies.


## Usage

    Cap Table CSV Parser requires a filepath argument, and has an optional date argument.
    
    To run the program using 'example_data.csv' in the current directory, run:
    `node app.js example_data.csv`

    You can also supply dates in YYYY-MM-DD format:
    `node app.js example_data.csv 1990-01-27`

    Supplying the optional date will create a cutoff date--only investments made
    on or before that date will be processed. If no date is provided (or if the
    argument is an invalid date), the default date is set to today.



