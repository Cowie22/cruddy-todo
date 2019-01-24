const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  var createNewFileCallback = (id) => {
    var path = __dirname + '/data/' + id + '.txt';
    fs.writeFile(path, text, (err) => {
      if (err) throw err;
      callback(null, { id, text });
    });
  }
  counter.getNextUniqueId(createNewFileCallback);
};

exports.readAll = (callback) => {
  var path = __dirname + '/data';
  var data = []
  fs.readdir(path, (err, files) => {
    var i = 0;
    var iterator = function(i) {
      var filePath = __dirname + '/data/' + files[i];
      fs.readFile(filePath, (err, bufferText) => {
        var text = bufferText.toString();
        var id = files[i].split('.')[0];
        var todo = { id, text };
        data.push(todo);
        if (i < files.length - 1) {
          i++;
          iterator(i);
        } else {
          callback(null, data)
        }
      });
    }
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
  // var item = items[id];
  // delete items[id];
  
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
