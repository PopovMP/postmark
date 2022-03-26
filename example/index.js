'use strict'

/**
 * Logs a test mail.
 *
 * Set a config-local.json to send a real email.
 *
 * Example config-local.json
 * {
 *   "loggerLogPath": "./log.txt",
 *   "loggerOptions": { "tee": false, "suppress": ["debug"] },
 *   "postmarkToken": "set-your-post-mark-app-token-here",
 *   "emailDriver"  : "postmark",
 *   "fromEmail"    : "john@exmaple.com"
 * }
 */

// Init config-json and micro-logger in index.js
const { configGet } = require('@popovmp/config-json').init(__dirname)
require('@popovmp/micro-logger').init(configGet('loggerLogPath'), configGet('loggerOptions'))


// Using postmark in a module
const { sendMail } = require('../index')

// Gets your email from the config.json (or config-local.json)
const email = configGet('fromEmail')

/** @type { MailModel } */
const mail = {
	to     : email,
	from   : email,  // Optional. Set from config if missing.
	tag    : 'TEST', // Optional. Helps to sort mails in PostMark
	subject: 'Test email subject',
	message: 'Test email body.',
}

sendMail(mail)
