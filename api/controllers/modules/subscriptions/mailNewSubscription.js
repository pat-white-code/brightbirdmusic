// given a request object, send an email with all the relevant information about the new subscription

const nodemailer = require('nodemailer');

const mailNewSubscription = (req, res) => {
  let output = `
  <p>You have a new subscription</p>
  <h3>Student Details</h3>
  <ul>
    <li><b>Student ID : </b>${req.body.studentId}</li>
    <li><b>Student Address : </b>${req.body.address_id}</li>
    <li><b>Start Date : </b>${req.body.startDate}</li>
    <li><b>Lesson Time : </b>${req.body.time_} </li>
    <li><b>Lesson Duration : </b>${req.body.duration} minutes </li>
    <li><b>Instrument ID : </b>${req.body.instrumentId}</li>
  </ul>
  `;


  async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();
  
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
          user: 'emmy25@ethereal.email',
          pass: 'uJ1SuU6XhgPznKkZ7r'
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "Emmy Corkery <emmy25@ethereal.email>", // sender address
      to: "bar@example.com, baz@example.com", // list of receivers
      subject: "New Subscription Received", // Subject line
      text: "Subscription info", // plain text body
      html: output // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

  }
  
  main().then(()=>{
    res.status(200).send("Message sent")
  }).catch(console.error);
}

module.exports = mailNewSubscription;