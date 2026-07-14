import { Resend } from 'resend';

// Use environment variable, fallback to dummy for local dev if not provided
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');
// Use env var if set (set RESEND_FROM_EMAIL on Fly.io once domain is verified)
// e.g: fly secrets set RESEND_FROM_EMAIL="Liquid Broker <no-reply@liquidglobalinvestments.com>" --app onerepo
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Liquid Broker <onboarding@resend.dev>';

/**
 * Helper to safely send emails without crashing the server
 */
async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Email Suppressed - No API Key] To: ${to} | Subject: ${subject}`);
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('[Email Error]', error);
    } else {
      console.log(`[Email Sent] To: ${to} | ID: ${data?.id}`);
    }
  } catch (err) {
    console.error('[Email Exception]', err);
  }
}

// ---------------------------------------------------------------------------
// Email Templates
// ---------------------------------------------------------------------------

export const EmailService = {
  /**
   * Sent when a user registers a new account
   */
  sendWelcomeEmail: async (to: string, name: string) => {
    const subject = 'Welcome to Liquid Global Investments!';
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333; max-w-xl mx-auto;">
        <h2 style="color: #6366f1;">Welcome aboard, ${name}!</h2>
        <p>Thank you for choosing Liquid Global Investments. Your account has been successfully created.</p>
        <p>You can now log in, complete your KYC verification, and start your trading journey with access to Forex, Crypto, Indices, and more.</p>
        <p>If you have any questions, our support team is available 24/5.</p>
        <br/>
        <p>Best regards,<br/><strong>The Liquid Global Team</strong></p>
      </div>
    `;
    return sendEmail(to, subject, html);
  },

  /**
   * Sent when a user logs in
   */
  sendLoginAlert: async (to: string, name: string, ip: string = 'Unknown IP') => {
    const subject = 'New Login Alert - Liquid Global';
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333; max-w-xl mx-auto;">
        <h3>Security Alert</h3>
        <p>Hi ${name},</p>
        <p>We detected a new login to your Liquid Global account.</p>
        <p><strong>Time:</strong> ${new Date().toUTCString()}</p>
        <p><strong>IP Address:</strong> ${ip}</p>
        <p>If this was you, you can safely ignore this email. If you did not authorize this login, please contact support immediately.</p>
        <br/>
        <p>Stay safe,<br/><strong>The Liquid Global Security Team</strong></p>
      </div>
    `;
    return sendEmail(to, subject, html);
  },

  /**
   * Sent when a deposit request is submitted
   */
  sendDepositRequestAlert: async (to: string, name: string, amount: number, currency: string) => {
    const subject = 'Deposit Request Received';
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333; max-w-xl mx-auto;">
        <h3 style="color: #10b981;">Deposit Request Received</h3>
        <p>Hi ${name},</p>
        <p>We have received your deposit request for <strong>${amount} ${currency}</strong>.</p>
        <p>Our financial team is currently reviewing your transaction. You will receive another email once the funds have been credited to your wallet.</p>
        <br/>
        <p>Best regards,<br/><strong>The Liquid Global Team</strong></p>
      </div>
    `;
    return sendEmail(to, subject, html);
  },

  /**
   * Sent when a deposit is approved
   */
  sendDepositApprovedAlert: async (to: string, name: string, amount: number, currency: string) => {
    const subject = 'Deposit Approved!';
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333; max-w-xl mx-auto;">
        <h3 style="color: #10b981;">Deposit Approved</h3>
        <p>Hi ${name},</p>
        <p>Great news! Your deposit of <strong>${amount} ${currency}</strong> has been approved and credited to your wallet.</p>
        <p>You can now transfer these funds to your trading accounts and begin trading.</p>
        <br/>
        <p>Happy Trading,<br/><strong>The Liquid Global Team</strong></p>
      </div>
    `;
    return sendEmail(to, subject, html);
  },

  /**
   * Sent when a withdrawal request is submitted
   */
  sendWithdrawalRequestAlert: async (to: string, name: string, amount: number, currency: string) => {
    const subject = 'Withdrawal Request Received';
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333; max-w-xl mx-auto;">
        <h3 style="color: #f59e0b;">Withdrawal Request Initiated</h3>
        <p>Hi ${name},</p>
        <p>We have received your withdrawal request for <strong>${amount} ${currency}</strong>.</p>
        <p>Our team will process this request shortly. Withdrawals typically take 1-3 business days depending on the method.</p>
        <br/>
        <p>Best regards,<br/><strong>The Liquid Global Team</strong></p>
      </div>
    `;
    return sendEmail(to, subject, html);
  },

  /**
   * Sent when a withdrawal is approved
   */
  sendWithdrawalApprovedAlert: async (to: string, name: string, amount: number, currency: string) => {
    const subject = 'Withdrawal Processed Successfully';
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333; max-w-xl mx-auto;">
        <h3 style="color: #10b981;">Withdrawal Processed</h3>
        <p>Hi ${name},</p>
        <p>Your withdrawal of <strong>${amount} ${currency}</strong> has been successfully processed and sent to your designated account/wallet.</p>
        <p>Please note that banking networks or blockchain confirmations may take additional time to reflect the balance on your end.</p>
        <br/>
        <p>Best regards,<br/><strong>The Liquid Global Team</strong></p>
      </div>
    `;
    return sendEmail(to, subject, html);
  }
};
