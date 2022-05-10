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
    // open the file if exist or not
    fs.open(lib.baseDirectory + dir + '/' + file + '.json', 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // file opend successfully, write content
            const stringData = JSON.stringify(data)
            fs.writeFile(fileDescriptor, stringData, (err) => {
                if (!err) {
                    // data has been written succussfuly
                    fs.close(fileDescriptor, (err) => {
                        if (!err) {
                            callback(false) // meaning file is closed and done
                        } else {
                            callback('can not close the file')
                        }
                    })
                } else {
                    callback('can not write the file')
                }
            })
        } else {
            callback('can not open the file')
        }
    })
}

// [R] Read
lib.read = (dir, file, callback) => {
    fs.readFile(lib.baseDirectory + dir + '/' + file + '.json', 'utf-8', (err, data) => {
        callback(err, data)
    })
}

// [U] Update
lib.update = (dir, file, data, callback) => {
    fs.open(lib.baseDirectory + dir + '/' + file + '.json', 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // truncate the file content
            fs.truncate(fileDescriptor, (err) => {
                if (!err) {
                    // write the new content
                    const stringData = JSON.stringify(data)
                    fs.writeFile(fileDescriptor, stringData, (err) => {
                        if (!err) {
                            // close the file
                            fs.close(fileDescriptor, (err) => {
                                if (!err) {
                                    callback(false)
                                } else {
                                    callback('Error: can not close file')
                                }
                            })
                        } else { 
                            callback('Error: can not write to file')
                        }
                    })
                } else {
                    callback('Error: can not truncating file')
                }
            })
        } else {
            callback('Error: can not open the file')
        }
    })
}

// [D] Delete
lib.delete = (dir, file, callback) => {
    fs.unlink(lib.baseDirectory + dir + '/' + file + '.json', (err) => {
        if (!err) {
            callback(false)
        } else {
            callback('Error: can not remove file')
        }
    })
}


// Exporting the library to the outside world
module.exports = lib