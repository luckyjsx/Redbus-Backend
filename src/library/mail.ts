import nodemailer from 'nodemailer';
export async function sendmail(to: string, subject: string, otp: string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const htmlTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #4a90e2; color: white; padding: 20px; text-align: center;">
                <h2>${subject}</h2>
            </div>
            <div style="padding: 30px; color: #333; text-align: center;">
                  <p style="font-size: 18px;">Use the OTP below to proceed:</p>
                <div style="font-size: 32px; font-weight: bold; color: #4a90e2; margin: 20px 0;">
                    ${otp}
                </div>
                <p>This OTP is valid for 10 minutes. Do not share it with anyone.</p>
            </div>
            <div style="background-color: #f7f7f7; padding: 15px; text-align: center; font-size: 12px; color: #888;">
                <p>You're receiving this email because you are a registered user.</p>
                <p>&copy; ${new Date().getFullYear()} Red Bus</p>
            </div>
        </div>
    `;

    const mailOptions = {
        from: `"Red Bus" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: htmlTemplate,
        otp
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Mail sent successfully to ${to}`);
    } catch (error) {
        console.log(`Error sending mail:`, error);
        throw error;
    }
}