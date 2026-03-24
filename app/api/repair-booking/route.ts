// app/api/repair-booking/route.ts (RESEND VERSION)
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Send email to CS team
    await resend.emails.send({
      from: `Testing Company <${process.env.FROM_EMAIL}>`,
      to: [process.env.CS_TEAM_EMAIL!],
      subject: `🔧 New Repair Booking - ${data.model} - ${data.customerName}`,
      html: generateEmailHTML(data),
    });

    // Send confirmation to customer
    await resend.emails.send({
      from: `Testing Company <${process.env.FROM_EMAIL}>`,
      to: [data.customerEmail],
      subject: '✓ Your Testing Company Repair Booking Confirmation',
      html: generateCustomerConfirmationHTML(data),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

function generateEmailHTML(data: any) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: #3B82F6; color: white; padding: 20px; border-radius: 10px; }
        .section { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; }
        .label { font-weight: bold; color: #555; }
        .value { margin-left: 10px; }
        .warranty-yes { color: #10B981; font-weight: bold; }
        .warranty-no { color: #EF4444; font-weight: bold; }
        .issue-tag { display: inline-block; padding: 5px 10px; margin: 5px; background: #FEE2E2; border-radius: 5px; color: #DC2626; }
        .cost-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        .cost-table td { padding: 8px; border-bottom: 1px solid #ddd; }
        .total { font-size: 1.2em; font-weight: bold; color: #3B82F6; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔧 New Repair Booking Received</h1>
          <p>Submitted: ${new Date(data.submittedAt).toLocaleString()}</p>
        </div>

        <div class="section">
          <h2>👤 Customer Information</h2>
          <p><span class="label">Name:</span><span class="value">${data.customerName}</span></p>
          <p><span class="label">Email:</span><span class="value">${data.customerEmail}</span></p>
          <p><span class="label">Phone:</span><span class="value">${data.customerPhone || 'Not provided'}</span></p>
          ${data.serviceType === 'collection' ? `
            <p><span class="label">Address:</span></p>
            <p class="value">
              ${data.addressLine1}<br>
              ${data.city}, ${data.postalCode}
            </p>
          ` : ''}
        </div>

        <div class="section">
          <h2>🛴 Scooter Information</h2>
          <p><span class="label">Model:</span><span class="value">${data.model}</span></p>
          <p><span class="label">Purchase Date:</span><span class="value">${data.purchaseDate}</span></p>
          <p><span class="label">Serial Number:</span><span class="value">${data.serialNumber || 'Not provided'}</span></p>
          <p><span class="label">Warranty Status:</span>
            <span class="${data.isWarranty ? 'warranty-yes' : 'warranty-no'}">
              ${data.isWarranty ? '✓ UNDER WARRANTY' : '✗ OUT OF WARRANTY / VOID'}
            </span>
          </p>
          <p><span class="label">Accident/Crash:</span>
            <span class="value">${data.hadAccident ? '⚠️ YES - WARRANTY VOIDED' : '✓ No'}</span>
          </p>
        </div>

        <div class="section">
          <h2>⚠️ Reported Issues</h2>
          <p><span class="label">Issue Categories:</span></p>
          <div>
            ${data.issueCategories.map((cat: string) => `<span class="issue-tag">${cat}</span>`).join('')}
          </div>

          ${data.errorCodes && data.errorCodes.length > 0 ? `
            <p style="margin-top: 15px;"><span class="label">Error Codes:</span></p>
            <div>
              ${data.errorCodes.map((code: string) => `<span class="issue-tag">${code}</span>`).join('')}
            </div>
          ` : ''}

          ${data.damageParts && data.damageParts.length > 0 ? `
            <p style="margin-top: 15px;"><span class="label">Damaged Parts:</span></p>
            <ul>
              ${data.damageParts.map((part: string) => `<li>${part}</li>`).join('')}
            </ul>
          ` : ''}

          ${data.noiseIssues && data.noiseIssues.length > 0 ? `
            <p style="margin-top: 15px;"><span class="label">Performance/Noise Issues:</span></p>
            <ul>
              ${data.noiseIssues.map((issue: string) => `<li>${issue}</li>`).join('')}
            </ul>
          ` : ''}

          ${data.otherDescription ? `
            <p style="margin-top: 15px;"><span class="label">Description:</span></p>
            <p class="value">${data.otherDescription}</p>
          ` : ''}

          <p style="margin-top: 15px;">
            <span class="label">Scooter Rideable:</span>
            <span class="value">${data.rideable ? 'Yes' : '⚠️ NO - DO NOT RIDE'}</span>
          </p>

          <p style="margin-top: 15px;"><span class="label">Fix Strategy:</span> 
            ${data.fixAll ? 'Customer wants ALL issues fixed' : 'Customer only wants SPECIFIC issues fixed'}
          </p>
          <ul>
            ${data.selectedRepairs && data.selectedRepairs.map((repair: string) => `<li>Requested Quote for: <strong>${repair}</strong></li>`).join('')}
          </ul>
        </div>

        <div class="section">
          <h2>📅 Booking Details</h2>
          <p><span class="label">Service Type:</span>
            <span class="value">${data.serviceType === 'drop-off' ? '🏪 Drop-off at Workshop' : '🚚 Courier Collection'}</span>
          </p>
          <p><span class="label">Booking Date:</span><span class="value">${data.bookingDate}</span></p>
          ${data.timeSlot ? `<p><span class="label">Time Slot:</span><span class="value">${data.timeSlot}</span></p>` : ''}
          <p><span class="label">Payment Plan:</span><span class="value">${data.paymentOption === 'pay-now' ? '💰 Agreed to Pay Deposit Now' : 'Pay on Completion'}</span></p>
        </div>

        <div class="section">
          <h2>💰 Estimated Cost</h2>
          ${data.isWarranty ? `
            <p class="warranty-yes">✓ COVERED BY WARRANTY (Inspection Only)</p>
            <p style="font-size: 0.9em; color: #666;">Customer pays £0 if warranty claim approved. Note: Excludes wear and tear items.</p>
          ` : `
            <table class="cost-table">
              <tr>
                <td class="total">DEPOSIT REQUIRED</td>
                <td class="total" style="text-align: right; color: #DC2626;">£${data.depositRequired}</td>
              </tr>
              <tr style="border-top: 2px solid #333;">
                <td class="total">TOTAL ESTIMATED</td>
                <td class="total" style="text-align: right;">£${data.estimatedTotal}</td>
              </tr>
            </table>
            <p style="font-size: 0.9em; color: #666;">
              * Deposit covers Diagnostics (£20) + Courier (£20) if applicable.
            </p>
          `}
        </div>

      </div>
    </body>
    </html>
  `;
}

function generateCustomerConfirmationHTML(data: any) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3B82F6; color: white; padding: 20px; border-radius: 10px; text-align: center; }
        .section { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✓ Booking Confirmed!</h1>
          <p>Thank you for choosing Pure Electric</p>
        </div>

        <div class="section">
          <h2>Hi ${data.customerName},</h2>
          <p>We've received your repair booking for your <strong>${data.model}</strong>.</p>
          
          <p><strong>Booking Reference:</strong> #${Date.now().toString().slice(-6)}</p>
          <p><strong>Service Type:</strong> ${data.serviceType === 'drop-off' ? 'Workshop Drop-off' : 'Courier Collection'}</p>
          <p><strong>Date:</strong> ${data.bookingDate}</p>
          
          ${data.isWarranty ? `
            <p style="color: #10B981; font-weight: bold;">✓ Your scooter is flagged as under warranty</p>
            <p>No charge for covered repairs (subject to physical inspection).</p>
          ` : `
            <p><strong>Estimated Total:</strong> £${data.estimatedTotal}</p>
            <p><strong>Deposit Required:</strong> £${data.depositRequired}</p>
            <p style="font-size: 0.9em; color: #666;">*Final cost confirmed after inspection.</p>
          `}
        </div>

        <div class="section">
          <h3>What Happens Next?</h3>
          <ol>
            <li>Our CS team will contact you within 24 hours</li>
            <li>${data.serviceType === 'collection' ? 'We will arrange your courier pickup' : 'Bring your scooter to our workshop'}</li>
            <li>Repair typically takes 7-10 working days</li>
            <li>We'll update you throughout the process</li>
          </ol>
        </div>
      </div>
    </body>
    </html>
  `;
}
