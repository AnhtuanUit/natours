const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
const mailjetTransport = require('nodemailer-mailjet-transport');

// new Email(user, url).sendWelcome();
module.exports = class Email {
  constructor(user, url) {
    // this.from = `TuanDo <${process.env.EMAIL_FROM}>`;
    this.from = `TuanDo <${process.env.EMAIL_FROM}>`;
    this.firstName = user.name.split(' ')[0];
    this.to = user.email;
    this.url = url;
  }

  newTransporter() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid - https://sendgrid.com/en-us

      // https://www.mailjet.com/
      // return nodemailer.createTransport(
      //   mailjetTransport({
      //     auth: {
      //       apiKey: process.env.MJ_APIKEY_PUBLIC,
      //       apiSecret: process.env.MJ_APIKEY_PRIVATE,
      //     },
      //   }),
      // );

      // Or Gmail
      // return nodemailer.createTransport({
      //   host: process.env.GMAIL_HOST,
      //   port: process.env.GMAIL_PORT,
      //   secure: true,
      //   auth: {
      //     user: process.env.GMAIL_USERNAME,
      //     pass: process.env.GMAIL_PASSWORD,
      //   },
      // });

      // Template use test platform
      return nodemailer.createTransport({
        host: process.env.MAIL_HOG_HOST,
        port: process.env.MAIL_HOG_PORT,
      });
    }

    // Mailtrap - https://mailtrap.io/
    // Or local Mail hog -  https://github.com/mailhog/MailHog
    return nodemailer.createTransport({
      host: process.env.MAIL_HOG_HOST,
      port: process.env.MAIL_HOG_PORT,
    });
  }

  async send(template, subject) {
    // 1) Render HTML base on pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2) Define email options
    const emailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html, { wordwrap: 130 }),
    };

    // 3) Create a transporter and send email
    try {
      await this.newTransporter().sendMail(emailOptions);
    } catch (err) {
      console.log(err);
    }
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)',
    );
  }
};
