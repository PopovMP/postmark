'use strict'

const { configGet   } = require('@popovmp/config-json')
const { requestJson } = require('@popovmp/request-service')
const { logError, logInfo, logText, logDebug } = require('@popovmp/micro-logger')

const emailDriver   = configGet('emailDriver')
const fromEmail     = configGet('fromEmail')
const postmarkToken = configGet('postmarkToken')
const postmarkUrl   = 'https://api.postmarkapp.com/email'
const retryInterval = 60 * 1000

/**
 * @typedef {Object } MailModel
 *
 * @property { string } to
 * @property { string } subject
 * @property { string } message
 * @property { string } [replyTo]
 * @property { string } [tag]
 */

/**
 * Sends an email
 * @param { MailModel } mail
 */
function sendMail(mail)
{
	switch (emailDriver) {
		case 'postmark':
			sendMailPostMark(mail)
			break
		case 'log':
			logMail(mail)
			break
		default:
			logError('emailDriver is not set', 'postmark :: sendMail')
	}
}

/**
 * Sends an email via PostMark
 *
 * @param { MailModel } mail
 */
function sendMailPostMark(mail)
{
	const data = {
		'Tag'          : mail.tag,
		'To'           : mail.to,
		'Subject'      : mail.subject,
		'TextBody'     : mail.message,
		'From'         : fromEmail,
		'Attachments'  : [],
		'TrackOpens'   : false,
		'TrackLinks'   : 'None',
		'MessageStream': 'outbound',
	}

	if (mail.replyTo && mail.replyTo !== fromEmail) {
		data['ReplyTo'] = mail.replyTo
	}

	const headers = {
		'Accept'                 : 'application/json',
		'Content-Type'           : 'application/json',
		'X-Postmark-Server-Token': postmarkToken,
		'Request-Timeout'        : 20,
	}

	requestJson(postmarkUrl, data, headers,
		requestJson_ready)

	function requestJson_ready(err, res)
	{
		if (err) {
			logDebug('Network Error: ' + err, 'postmark :: requestJson')
			setTimeout(sendMailPostMark, retryInterval, mail)
			return
		}

		if (res && res['ErrorCode'] !== 0) {
			const error = `Postmark Error: ${res['ErrorCode']}. ${res['Message']}`
			logError(error, 'postmark :: sendMailPostMark')
		}
	}
}

/**
 * Logs an email
 *
 * @param { MailModel } mail
 */
function logMail(mail)
{
	const messageSubject = `From: ${fromEmail}, To: ${mail.to}, Subject: ${mail.subject}`
	logInfo(messageSubject, 'postmark :: logMail')
	logText(mail.message)
}

module.exports = {
	sendMail,
}
