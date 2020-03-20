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

function sendMail(to, subject, html) {
  mailOptions.to = to;
  mailOptions.subject = subject;
  mailOptions.html = html;
  
  // TODO : Style the email. Create a template and call it here
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: error });
    } else {
      console.log('Email send: ' + info.response);
    }
  });
}

exports.sendConfirmMail = (req, res, next) => {
  const to = req.body.email;
  const subject = 'HyperTube Account Confirmation';
  const html = ` <h3> Hello ` + res.savedUser.firstName + ` !</h3>
                      <p>Please confirm your account by clicking on this 
                      <a href="http://localhost:4200/signin?id=` + res.savedUser._id + `">link</a>
                      </p>`;
  sendMail(to, subject, html);
  res.status(201).json({
    message: 'User created',
    result: res.savedUser
  });
};

exports.sendResetPwd = async (req, res, next) => {
  const to = req.user.email;
  const subject = 'Reset HyperTube Password';
  const html =
    `<h3>Reset Password!</h3
                <p>Follow this <a href="http://localhost:4200/forgotPassword?id=` +
    req.user.id +
    `&hash=` +
    res.locals.randomStr +
    `">link</a>
                </p>`;
  sendMail(to, subject, html);
  res.status(200).json({ message : 'Reset Password email sent !' });
};