/**
 * Create different environments with its variables
*/


const environments = {}

// development env
environments.development = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'development'
}

// production env
environments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production'
}

// accessing the passed env_var value
const env_var = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : ''

const environmentToExport = typeof(environments[env_var]) == 'object' ? environments.production : environments.development

module.exports = environmentToExport