const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // Goal is to create a persistent todo object
  // We created on inner callback function 
  // That accepts a unique id as its sole paramater
  var createNewFileCallback = (uniqueId) => {
    // Declare the pathname where we wanted to created the
    // Text file that represents the object
    var path = __dirname + '/data/' + uniqueId + '.txt';
    // Purpose is to create a file with the text inside of it 
    // at that file location
    fs.writeFile(path, text, (err) => {
      // If there is an error, such as invalid path, or permission error
      // Throw an error
      if (err) throw err;
      // Otherwise trigger the callback passed in from server.js
      // Callback sends response.body with newly created todo object
      callback(null, { uniqueId, text });
    });
  }
  // Calling the get unique ID method that was imported from counter.js
  // This method grabs a persistently unique ID from our database
  // Because of the asynchrounous nature, we have to pass our callback into
  // The function, otherwise getNextUniqueId won't be able to return the 
  // Generated Unique id to our create new file function.
  counter.getNextUniqueId(createNewFileCallback);
};

// The purpose of this function is to read all of the Text documents
// In the Data folder
exports.readAll = (callback) => {
  // We declare the path as data because we want all of the newly created
  // Files to be contained here
  var path = __dirname + '/data';
  // Declare a temp data array, which will store all our text document objects
  // That will eventually be sent as the response body to the client
  var data = []
  // Read the /data directory and reurn an array of the files in that directory
  fs.readdir(path, (err, files) => {
    // Set i as 0 so we can increment over the files array using i
    var i = 0;
    // Define a recursive function that will iterate over the files array
    // In an asynchronous way, by only calling itself inside the asynchous
    // Callback of fs.readFile while also incrementing i
    var iterator = function(i) {
      // File path has files[i] becuase that is the entire file name
      var filePath = __dirname + '/data/' + files[i];
      // Reads file defined at the path efined in file path
      fs.readFile(filePath, (err, bufferText) => {
        var text = bufferText.toString();
        var id = files[i].split('.')[0];
        // This is the information in the todo
        var todo = { id, text };
        // Push this information to our temp data array
        data.push(todo);
        // If i is less than the length of the array, then increment the 
        // Counter of i and perform the recursive function on the next
        // File in the files array
        if (i < files.length - 1) {
          i++;
          iterator(i);
        } else {
          // Otherwise pass the complete data array containing all our files
          // Into the callback passed in from server.js which will handle 
          // Sending the data array to the client
          callback(null, data)
        }
      });
    }
    // Call the iterator function and pass in the intial i value
    iterator(i);
  })
};

exports.readOne = (id, callback) => {
  var path = __dirname + '/data/' + id + '.txt';
  fs.readFile(path, (err, bufferText) => {
    if (!bufferText) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      var text = bufferText.toString();
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  var path = __dirname + '/data/' + id + '.txt';
  fs.readFile(path, (err, bufferText) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(path, text, (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, { id, text });
        }
      });
    }
  })
};

exports.delete = (id, callback) => {
  var path = __dirname + '/data/' + id + '.txt';
  fs.unlink(path, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
