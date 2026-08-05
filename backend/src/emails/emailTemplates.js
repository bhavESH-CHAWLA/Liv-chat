export function createWelcomeEmailTemplate(name, clientURL) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to LIV-CHAT</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
    <div style="background: linear-gradient(to right, #36D1DC, #5B86E5); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
      <img src="https://img.freepik.com/free-vector/hand-drawn-message-element-vector-cute-sticker_53876-118344.jpg" alt="LIV-CHAT Logo" style="width: 80px; height: 80px; margin-bottom: 20px; border-radius: 50%; background-color: white; padding: 10px;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 500;">Welcome to LIV-CHAT!</h1>
    </div>
    <div style="background-color: #ffffff; padding: 35px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
      <p style="font-size: 18px; color: #5B86E5;"><strong>Hello ${name},</strong></p>
      <p>We're excited to have you join LIV-CHAT. Connect with friends, family, and colleagues in real time.</p>
      <div style="background-color: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #36D1DC;">
        <p style="font-size: 16px; margin: 0 0 15px 0;"><strong>Get started in just a few steps:</strong></p>
        <ul style="padding-left: 20px; margin: 0;">
          <li style="margin-bottom: 10px;">Complete your profile</li>
          <li style="margin-bottom: 10px;">Add contacts</li>
          <li style="margin-bottom: 10px;">Send your first message</li>
          <li style="margin-bottom: 0;">Enable security features like 2FA</li>
        </ul>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${clientURL}" style="background: linear-gradient(to right, #36D1DC, #5B86E5); color: white; text-decoration: none; padding: 12px 30px; border-radius: 50px; font-weight: 500; display: inline-block;">Open LIV-CHAT</a>
      </div>
      <p style="margin-bottom: 5px;">If you need help, we're always here to assist.</p>
      <p style="margin-top: 0;">Happy chatting!</p>
      <p style="margin-top: 25px; margin-bottom: 0;">Best regards,<br>The LIV-CHAT Team</p>
    </div>
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
      <p>© 2025 LIV-CHAT. All rights reserved.</p>
      <p>
        <a href="#" style="color: #5B86E5; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
        <a href="#" style="color: #5B86E5; text-decoration: none; margin: 0 10px;">Terms of Service</a>
        <a href="#" style="color: #5B86E5; text-decoration: none; margin: 0 10px;">Contact Us</a>
      </p>
    </div>
  </body>
  </html>
  `;
}

export function createEmailVerificationTemplate(name, clientURL, token) {
  const verifyUrl = `${clientURL}/verify-email?token=${token}`;
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your LIV-CHAT Email</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f6fb;">
    <div style="background: #0b72d9; padding: 30px; color: white; text-align: center; border-radius: 12px 12px 0 0;">
      <h1 style="margin: 0; font-size: 28px;">Verify Your Email</h1>
    </div>
    <div style="background: white; padding: 35px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
      <p style="font-size: 18px; color: #0b72d9;"><strong>Hi ${name},</strong></p>
      <p>Thanks for signing up with LIV-CHAT. Please verify your email to activate your account and keep your messages secure.</p>
      <div style="text-align:center; margin: 30px 0;">
        <a href="${verifyUrl}" style="background: #0b72d9; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; display: inline-block;">Verify Email</a>
      </div>
      <p>If the button doesn't work, copy and paste the following link into your browser:</p>
      <p style="word-break: break-all;">${verifyUrl}</p>
      <p>If you did not create an account, please ignore this email.</p>
      <p style="margin-top: 25px;">Thanks,<br>The LIV-CHAT Team</p>
    </div>
  </body>
  </html>
  `;
}

export function createPasswordResetEmailTemplate(name, clientURL, token) {
  const resetUrl = `${clientURL}/reset-password?token=${token}`;
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset for LIV-CHAT</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f6fb;">
    <div style="background: #0b72d9; padding: 30px; color: white; text-align: center; border-radius: 12px 12px 0 0;">
      <h1 style="margin: 0; font-size: 28px;">Reset Your Password</h1>
    </div>
    <div style="background: white; padding: 35px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
      <p style="font-size: 18px; color: #0b72d9;"><strong>Hello ${name},</strong></p>
      <p>We received a request to reset your LIV-CHAT password.</p>
      <div style="text-align:center; margin: 30px 0;">
        <a href="${resetUrl}" style="background: #0b72d9; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; display: inline-block;">Reset Password</a>
      </div>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all;">${resetUrl}</p>
      <p>This link expires in one hour.</p>
      <p>If you did not request this password reset, no further action is needed.</p>
      <p style="margin-top: 25px;">Thanks,<br>The LIV-CHAT Team</p>
    </div>
  </body>
  </html>
  `;
}

export function createTwoFactorTemplate(name, code) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Two-Factor Code</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f6fb;">
    <div style="background: #0b72d9; padding: 30px; color: white; text-align: center; border-radius: 12px 12px 0 0;">
      <h1 style="margin: 0; font-size: 28px;">Your Two-Factor Code</h1>
    </div>
    <div style="background: white; padding: 35px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
      <p style="font-size: 18px; color: #0b72d9;"><strong>Hello ${name},</strong></p>
      <p>Use the code below to complete your login:</p>
      <p style="font-size: 24px; font-weight: 700; letter-spacing: 4px; text-align: center; margin: 20px 0;">${code}</p>
      <p>This code expires in 10 minutes. If you did not request it, please ignore this email.</p>
      <p style="margin-top: 25px;">Thanks,<br>The LIV-CHAT Team</p>
    </div>
  </body>
  </html>
  `;
}
