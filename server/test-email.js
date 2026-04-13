import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function testEmail() {
    console.log('Testing with EMAIL_USER:', process.env.EMAIL_USER);
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        await transporter.verify();
        console.log('✅ SMTP connection verified successfully');

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'Portfolio Test Email',
            text: 'This is a test email to verify your portfolio configuration.',
        });

        console.log('✅ Email sent successfully:', info.messageId);
    } catch (error) {
        console.error('❌ Email Failure Error Details:');
        console.error('Error Code:', error.code);
        console.error('Error Message:', error.message);
        if (error.response) console.error('SMTP Response:', error.response);
    }
}

testEmail();
