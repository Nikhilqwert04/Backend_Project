const Mailgen = require('mailgen')
const nodemailer = require("nodemailer")

const sendMail = async (options) => {
    var mailGenerator = new Mailgen({
        theme: 'default',
        product: {

            name: 'Task Manager',
            link: 'https://taskmanagelink.com'
        }
    });

    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent)
    const emailHTML = mailGenerator.generate(options.mailgenContent)

    var transporter = nodemailer.createTransport({
        host: process.env.MAIL_TRAP_SMTP,
        port: process.env.MAIL_TRAP_PORT,
        auth: {
            user: process.env.MAIL_TRAP_USER,
            pass: process.env.MAIL_TRAP_PASS
        }
    });
    const mail={
        from: "nikhilluthra04052007@gmail.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html:emailHTML
    }
    
    try{
        await transporter.sendMail(mail)
    }catch(error){
        console.error("Email Service failed Silently. Make sure that you have provided your mailtrap credentials in the .env file")
        console.error("Error",error)
    }
}

const emailVerificationMailGenContent = (username, verificationURL) => {
    return {
        body: {
            name: 'John Appleseed',
            intro: 'Welcome to Mailgen! We\'re very excited to have you on board.',
            action: {
                instructions: 'To get started with Mailgen, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Confirm your account',
                    link: 'verificationURL'
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }
}

const forgotPasswordMailGenContent = (username, passwordResetURL) => {
    return {
        body: {
            name: 'John Appleseed',
            intro: 'We got a Request to reset the Password to your account',
            action: {
                instructions: 'To reset the password, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Verify your paswword',
                    link: 'passwordResetURL'
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }
}

module.exports = {
    sendMail,
    emailVerificationMailGenContent,
    forgotPasswordMailGenContent
}