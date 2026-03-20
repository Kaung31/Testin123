// app/api/repair-booking/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Create email transporter (using Gmail as example)
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // your-email@gmail.com
        pass: process.env.EMAIL_PASSWORD, // your app password
      },
    });

    // Format the email content
    const emailHTML = generateEmailHTML(data);
    
    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // ← Changed! Now sends to your email
      subject: `🔧 New Repair Booking - ${data.scooterModel} - ${data.customerName}`,
      html: emailHTML,
    });

    // Also send confirmation to customer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: data.customerEmail,
      subject: '✓ Your Pure Electric Repair Booking Confirmation',
      html: generateCustomerConfirmationHTML(data),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to submit booking' },
      { status: 500 }
    );
  }
}

function generateEmailHTML(data: any) {
  const { total, items, isWarranty } = data.estimatedCost;
  
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
        .photo-list { list-style: none; padding: 0; }
        .photo-list li { padding: 5px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔧 New Repair Booking Received</h1>
          <p>Submitted: ${new Date(data.submittedAt).toLocaleString()}</p>
        </div>

        <!-- Customer Information -->
        <div class="section">
          <h2>👤 Customer Information</h2>
          <p><span class="label">Name:</span><span class="value">${data.customerName}</span></p>
          <p><span class="label">Email:</span><span class="value">${data.customerEmail}</span></p>
          <p><span class="label">Phone:</span><span class="value">${data.customerPhone || 'Not provided'}</span></p>
          ${data.serviceType === 'collection' ? `
            <p><span class="label">Address:</span></p>
            <p class="value">
              ${data.addressLine1}<br>
              ${data.addressLine2 ? data.addressLine2 + '<br>' : ''}
              ${data.city}, ${data.postalCode}
            </p>
          ` : ''}
        </div>

        <!-- Scooter Information -->
        <div class="section">
          <h2>🛴 Scooter Information</h2>
          <p><span class="label">Model:</span><span class="value">${data.scooterModel}</span></p>
          <p><span class="label">Purchase Date:</span><span class="value">${data.purchaseDate}</span></p>
          <p><span class="label">Serial Number:</span><span class="value">${data.serialNumber || 'Not provided'}</span></p>
          <p><span class="label">Warranty Status:</span>
            <span class="${isWarranty ? 'warranty-yes' : 'warranty-no'}">
              ${isWarranty ? '✓ UNDER WARRANTY' : '✗ OUT OF WARRANTY'}
            </span>
          </p>
          <p><span class="label">Accident/Crash:</span>
            <span class="value">${data.hadAccident ? '⚠️ YES - NOT COVERED' : '✓ No'}</span>
          </p>
        </div>

        <!-- Reported Issues -->
        <div class="section">
          <h2>⚠️ Reported Issues</h2>
          <p><span class="label">Issue Categories:</span></p>
          <div>
            ${data.issueCategories.map((cat: string) => `<span class="issue-tag">${cat}</span>`).join('')}
          </div>

          ${data.selectedErrorCodes.length > 0 ? `
            <p style="margin-top: 15px;"><span class="label">Error Codes:</span></p>
            <div>
              ${data.selectedErrorCodes.map((code: string) => `<span class="issue-tag">${code}</span>`).join('')}
            </div>
          ` : ''}

          ${data.selectedDamageParts.length > 0 ? `
            <p style="margin-top: 15px;"><span class="label">Damaged Parts:</span></p>
            <ul>
              ${data.selectedDamageParts.map((part: string) => `<li>${part}</li>`).join('')}
            </ul>
          ` : ''}

          ${data.selectedPerformanceIssues.length > 0 ? `
            <p style="margin-top: 15px;"><span class="label">Performance Issues:</span></p>
            <ul>
              ${data.selectedPerformanceIssues.map((issue: string) => `<li>${issue}</li>`).join('')}
            </ul>
          ` : ''}

          ${data.otherDescription ? `
            <p style="margin-top: 15px;"><span class="label">Description:</span></p>
            <p class="value">${data.otherDescription}</p>
          ` : ''}

          <p style="margin-top: 15px;">
            <span class="label">Scooter Rideable:</span>
            <span class="value">${data.scooterRideable ? 'Yes' : '⚠️ NO - DO NOT RIDE'}</span>
          </p>
        </div>

        <!-- Booking Details -->
        <div class="section">
          <h2>📅 Booking Details</h2>
          <p><span class="label">Service Type:</span>
            <span class="value">${data.serviceType === 'drop-off' ? '🏪 Drop-off at Workshop' : '🚚 Collection Service'}</span>
          </p>
          <p><span class="label">Preferred Date:</span><span class="value">${data.preferredDate}</span></p>
          ${data.timeSlot ? `<p><span class="label">Time Slot:</span><span class="value">${data.timeSlot}</span></p>` : ''}
        </div>

        <!-- Cost Estimate -->
        <div class="section">
          <h2>💰 Estimated Cost</h2>
          ${isWarranty ? `
            <p class="warranty-yes">✓ COVERED BY WARRANTY (Inspection Only)</p>
            <p style="font-size: 0.9em; color: #666;">Customer pays £0 if warranty claim approved.</p>
          ` : `
            <table class="cost-table">
              ${items.map((item: any) => `
                <tr>
                  <td>${item.item}</td>
                  <td style="text-align: right;">£${item.cost}</td>
                </tr>
              `).join('')}
              <tr style="border-top: 2px solid #333;">
                <td class="total">TOTAL ESTIMATED</td>
                <td class="total" style="text-align: right;">£${total}</td>
              </tr>
            </table>
            <p style="font-size: 0.9em; color: #666;">
              * Final cost may vary after inspection. Deposit of £40 required.
            </p>
          `}
        </div>

        <!-- Photos -->
        ${data.photos.length > 0 ? `
          <div class="section">
            <h2>📷 Uploaded Photos</h2>
            <p>${data.photos.length} photo(s) uploaded (see attachments)</p>
          </div>
        ` : ''}

        <!-- Next Steps -->
        <div class="section">
          <h2>✅ Next Steps for CS Team</h2>
          <ol>
            <li>Review booking details above</li>
            <li>Check photos and verify issue description</li>
            <li>Contact customer at <strong>${data.customerEmail}</strong> or <strong>${data.customerPhone}</strong></li>
            <li>${data.serviceType === 'collection' ? 'Arrange courier pickup' : 'Confirm drop-off appointment'}</li>
            <li>Update customer on repair timeline (7-10 working days)</li>
          </ol>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateCustomerConfirmationHTML(data: any) {
  const { total, isWarranty } = data.estimatedCost;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3B82F6; color: white; padding: 20px; border-radius: 10px; text-align: center; }
        .section { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; }
        .label { font-weight: bold; }
        .button { display: inline-block; padding: 12px 24px; background: #3B82F6; color: white; text-decoration: none; border-radius: 8px; margin-top: 15px; }
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
          <p>We've received your repair booking for your <strong>${data.scooterModel}</strong>.</p>
          
          <p><strong>Booking Reference:</strong> #${Date.now().toString().slice(-6)}</p>
          <p><strong>Service Type:</strong> ${data.serviceType === 'drop-off' ? 'Workshop Drop-off' : 'Collection Service'}</p>
          <p><strong>Preferred Date:</strong> ${data.preferredDate}</p>
          
          ${isWarranty ? `
            <p style="color: #10B981; font-weight: bold;">✓ Your scooter is under warranty</p>
            <p>No charge for covered repairs (subject to inspection).</p>
          ` : `
            <p><strong>Estimated Cost:</strong> £${total}</p>
            <p style="font-size: 0.9em; color: #666;">*Deposit of £40 required. Final cost confirmed after inspection.</p>
          `}
        </div>

        <div class="section">
          <h3>What Happens Next?</h3>
          <ol>
            <li>Our CS team will contact you within 24 hours</li>
            <li>${data.serviceType === 'collection' ? 'We will arrange courier pickup' : 'Bring your scooter to our workshop'}</li>
            <li>Repair typically takes 7-10 working days</li>
            <li>We'll update you throughout the process</li>
          </ol>
        </div>

        <div class="section">
          <h3>Need Help?</h3>
          <p>Contact our support team:</p>
          <p>📧 Email: support@pureelectric.com</p>
          <p>📞 Phone: [Your phone number]</p>
        </div>

        <p style="text-align: center; color: #666; font-size: 0.9em; margin-top: 30px;">
          This is an automated confirmation. Please do not reply to this email.
        </p>
      </div>
    </body>
    </html>
  `;
}
