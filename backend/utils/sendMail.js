const nodemailer = require('nodemailer');

const sendMail = async(options)=>{

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'cordell.rodriguez@ethereal.email',
            pass: 'tZVQ3jB3FkXAXxqxpE'
        }
    });
    console.log(options.email);

    // const transporter = nodemailer.createTransport({
    //     host:process.env.SMTP_HOST,
    //     port:6379,
    //     service:process.env.SMTP_SERVICE,
    //     auth: {
    //         user: process.env.SMTP_MAIL, 
    //         pass: process.env.SMTP_PASS, 
    //       },
    // });

    const messageOptions = {
        from:'cordell.rodriguez@ethereal.email',
        to:options.email,
        subject:options.subject,
        text:options.message,

    }

    await transporter.sendMail(messageOptions);
    
}

module.exports = sendMail;