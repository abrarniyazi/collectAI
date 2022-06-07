# CollectAI Coding Challenge


### How to run
First run commmservice app on your machine and then run below commands from this directory:

#### `npm install`
#### `npm run start`

### Solution
This app reads the csv file and parses in to array of string. Then for each invoice it creates asynchronous call to fetch the status of the invoice.  
Once the API response for an invoice shows paid, no more messages are send for that invoice.  
  
There is only one third party library being used in this app which is to parse csv file.

### Known issues:
Sometimes there is a mismatch is request time by few milliseconds. This is mainly because the solution uses the `setTimeout` function which is not made for accuracy because of asynchronous nature of Nodejs/javascript.  
The issue can be possibly solved either just using a third party library or by relying on system clock which appears to be a more time taking solution.

### Scripts

#### `npm run start:dev`

Starts the application in development using `nodemon` and `ts-node` to do hot reloading.

#### `npm run start`

Starts the app in production by first building the project with `npm run build`, and then executing the compiled JavaScript at `build/index.js`.

#### `npm run build`

Builds the app at `build`, cleaning the folder first.

#### `npm run test`

Runs the `jest` tests once.

#### `npm run test:dev`

Format your code.

#### `npm run prettier-watch`

Format your code in watch mode, waiting for file changes.

