// mot de passe Gmail : gccpmyozhzyefcfi
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'a.ceciora@gmail.com',
        pass: 'gccpmyozhzyefcfi'
    }
});

const mailOptions = {
    from: 'a.ceciora@gmail.com'
}

exports.sendConfirmMail = (req, res, next) => {
    console.log(req.body);
    mailOptions.to = req.body.email;
    mailOptions.subject = 'HyperTube Account Confirmation';
    mailOptions.html = ` <h3> Hello ` + res.savedUser.firstName + ` !</h3>
                        <p> Please confirm your account by clicking on this 
                        <a href="http://localhost:4200/signin?id=` + res.savedUser._id + `">link</a>
                        </p>`;
    // TODO : Style the email. Create a template and call it here
    console.log(mailOptions);
    console.log(res.savedUser);
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: error });
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    res.status(201).json({
      message: 'User created',
      result: res.savedUser
    });
}