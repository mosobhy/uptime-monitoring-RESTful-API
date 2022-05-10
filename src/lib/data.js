/**
 * Creating data and store it into the filesystem
 */

// Dependancies
const fs = require('fs');
const path = require('path');

// Container for the module's functionality
const lib = {}

lib.baseDirectory = path.join(__dirname, '/../.data/')

// [C] Create 
lib.create = (dir, file, data, callback) => {

}

// [R] Read
lib.read = (dir, file, callback) => {

}

// [U] Update
lib.update = (dir, file, data, callback) => {

}

// [D] Delete
lib.delete = (dir, file, callback) => {

}


// Exporting the library to the outside world
module.exports = lib