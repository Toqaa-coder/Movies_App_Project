const nodemailer = require('nodemailer');

// חשוב: יש להוסיף שני משתנים ל-.env:
// EMAIL_USER=הכתובת-שלך@gmail.com
// EMAIL_PASS=App Password (לא הסיסמה הרגילה! ראו הסבר למטה)

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// שליחת מייל עם קוד (לאיפוס סיסמה או כניסה עם קוד)
async function sendCodeEmail(toEmail, code) {
    const mailOptions = {
        from: `"Netflix Project" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'קוד אימות - Netflix Project',
        html: `
            <div dir="rtl" style="font-family: Arial, sans-serif;">
                <h2>קוד האימות שלך</h2>
                <p>הקוד הבא תקף ל-10 דקות:</p>
                <h1 style="color:#e50914;">${code}</h1>
                <p>אם לא ביקשת קוד זה, אפשר להתעלם מהמייל.</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
}

module.exports = { sendCodeEmail };

