# Postmark

## Sends emails via Postmark

`Postmark` sends text mails via https://postmarkapp.com.

## Synopsis

```javascript
const { sendMail } = require('@popovmp/postmark')

// Email model
const mail = {
	to     : 'john@example.com',
	tag    : 'Foo',              // Optional. Helps to sort mails in PostMark
	subject: 'Test email subject',
	message: 'Test email body.',
}

// Fire and forget
sendMail(mail)
```

## Initialization

`Postmark` depends of own modules `config-json` and `micro-logger`.
They have to be initialized in the application's `index.js`

```javascript
// in index.js
const { configGet } = require('@popovmp/config-json').init(__dirname)
require('@popovmp/micro-logger').init(configGet('loggerLogPath'), configGet('loggerOptions'))
```

`Postmark` needs of teh log file path, logger options, your email and your Postmark token.

The easiest way to have them is to set the info in `config.json`.

Optionally, you can have a public `config.json` and a private `config-local.json`.

Example of `config.json` or `config-local.json`
```json
{
  "loggerLogPath": "./log.txt",
  "loggerOptions": { "tee": false, "suppress": ["debug"] },
  "postmarkToken": "set-your-post-mark-app-token-here",
  "emailDriver"  : "postmark",
  "fromEmail"    : "John Doe <john@example.com>"
}
```

The `emailDriver` can be `log` or `postmark`.

## Methods


**sendMail(mail)**

`mail` is defined as follows:

```js
/**
 * @typedef {Object } MailModel
 *
 * @property { string } to
 * @property { string } subject
 * @property { string } message
 * @property { string } [replyTo]
 * @property { string } [tag]
 */
```

## Dependencies

`config-json` https://www.npmjs.com/package/@popovmp/config-json

`micro-logger` https://www.npmjs.com/package/@popovmp/micro-logger

Copyright @ 2022 Miroslav Popov
