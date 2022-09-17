require('dotenv').config()

const nodemailer = require('nodemailer')

class MailSender {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD,
      },
    })
  }

  sendEmail(targetEmail, content) {
    const message = {
      from: 'Openmusic API',
      to: targetEmail,
      subject: 'Ekspor Playlists',
      text: 'Hasil export Playlist dapat dilihat dibawah sini...',
      attachments: [
        {
          filename: 'playlists.json',
          content,
        },
      ],
    }

    return this._transporter.sendMail(message)
  }
}

module.exports = MailSender
