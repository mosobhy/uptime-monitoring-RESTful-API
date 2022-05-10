/**
 * Providing an interface to all handlers
 */

// Dependancies
// import handlers
const user = require('./core_handlers/users')

// Container for handlers interface
const handlers = {}

// Adding the common handlers
handlers.user = user


// Exporting the library
module.exports = handlers