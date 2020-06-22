/* -------------------------------------------------------------------------- *\
    1) Imports and variable definitions.
\* -------------------------------------------------------------------------- */

const nodemailer = require('nodemailer');

/* -------------------------------------------------------------------------- *\
    2) Defines the base SENDMAIL function.
\* -------------------------------------------------------------------------- */

function sendMail(to, subject, html) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: 'a.ceciora@gmail.com', pass: 'gccpmyozhzyefcfi' },
    tls: { rejectUnauthorized: false }
  });
  const mailOptions = {
    from: 'a.ceciora@gmail.com',
    to: to,
    subject: subject,
    html: html
  }
  
  /*
  *
  TODO : Style the email. Create a template and call it here
  *
  */
  // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  transporter.sendMail(mailOptions, (error, info) =>
  {
    if (error)
      throw error
    else
      console.log('Email send: ' + info.response);
  });
}

/* -------------------------------------------------------------------------- *\
    2) Defines the authentification-related email functions.
\* -------------------------------------------------------------------------- */

// Signup confirmation email.
exports.sendConfirmMail = (req, res) => {
  try {
    const to = req.body.email;
    const subject = 'HyperTube Account Confirmation';
    const html = `<h3>Hello ` + res.savedUser.firstName + ` !</h3>
                  <p>Please confirm your account by clicking on this 
                    <a href="http://localhost:4200/signin?id=` + res.savedUser._id + `">link</a>.
                  </p>`;
    sendMail(to, subject, html);
    res.status(201).json({ status: 201, datas: res.savedUser, message: 'User created' });
  } catch (error) {
    return res.status(500).json({ status: 500, datas: null, message: 'Mail' });
  }
};

// Password reset email.
exports.sendResetPwd = async (req, res) => {
  try {
    const to = req.user.email;
    const subject = 'Reset HyperTube Password';
    const html = `<h3>Reset Password!</h3>
                  <p>Reset your password by clicking on this 
                    <a href="http://localhost:4200/forgotPassword?id=` + req.user.id + `&hash=` + res.locals.randomStr +`">link</a>.
                  </p>`;
    sendMail(to, subject, html);
    res.status(200).json({ message : 'Reset Password email sent !' });
  } catch(error) {
    return res.status(500).json({ message: 'Mail could not be sent' });
  }
};