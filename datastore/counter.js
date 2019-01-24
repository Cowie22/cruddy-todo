const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;


// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////
// The purpose of this function is to read the last ID created 
// At counter.txt and then increments that ID, saves the new ID to 
// Counter.txt and then returns that new idea
exports.getNextUniqueId = (callback) => {
  //declare the count variable
  var counter;
  // Declare the path where we want to get/set our id's from
  var path =  __dirname + '/counter.txt';
  // We're grabbing the last used ID, so that it can be incremented later
  fs.readFile(path, (err, data) => {
    if (err) throw err;
    // It increments the counter, toString because the data is stored as a buffer
    // PareseInt because you can't increment a string
    counter = parseInt(data.toString()) + 1;
    // Now that we have incremented our count, we need to re-write the count
    // In the counter.txt
    fs.writeFile(path, counter, (err) => {
      if (err) throw err;
      // If not an error we call the createNewFileCallback function and
      // Pass in the new ID
      // The zeroPaddedNumber takes a number and adds zeros in front of it
      callback(zeroPaddedNumber(counter))
    });
  });
};






// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
