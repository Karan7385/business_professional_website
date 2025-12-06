import {
  submit_contact_model,
  get_enquiries_model,
  update_enquiry_model
} from '../../models/contacts/contact_model.js';

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: "../../config/" });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function handle_submit(req, res) {
  try {
    const {
      name,
      company,
      email,
      country_code,
      phone,
      message,
      categories,
      products,
    } = req.body || {};

    // Basic validation (you can tighten as needed)
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ error: "At least one category is required" });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "At least one product is required" });
    }

    // Prepare payload for DB (matches your table columns)
    const payload = {
      name: name.trim(),
      company: (company || "").trim(),
      email: email.trim(),
      country_code: (country_code || "").trim(),
      phone: (phone || "").trim(),
      message: message.trim(),
      categories,
      products,
    };

    // 1) Save to DB
    const result = await submit_contact_model(payload);

    // 2) Prepare emails
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

    const adminMailOptions = {
      from: email,
      to: adminEmail,
      subject: `New enquiry from ${name}`,
      html: `
  <div style="max-width: 650px; margin: auto; font-family: Arial, sans-serif; background: #ffffff; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden;">
    
    <div style="background: #007BFF; padding: 20px; color: white;">
      <h2 style="margin: 0; font-size: 22px;">📩 New Enquiry Received</h2>
    </div>

    <div style="padding: 20px;">
      <p style="font-size: 16px; margin: 0 0 12px 0;">
        A new enquiry has been received from your website. Please review the details below:
      </p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 18px;">
        <tr>
          <td style="padding: 8px; font-weight: bold;">Name:</td>
          <td style="padding: 8px;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Company:</td>
          <td style="padding: 8px;">${company || "-"}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Email:</td>
          <td style="padding: 8px;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Phone:</td>
          <td style="padding: 8px;">${country_code || ""} ${phone || ""}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; vertical-align: top;">Message:</td>
          <td style="padding: 8px;">${message}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Categories:</td>
          <td style="padding: 8px;">${categories.join(", ")}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Products:</td>
          <td style="padding: 8px;">${products.join(", ")}</td>
        </tr>
      </table>

      <p style="margin-top: 26px; font-size: 14px; color: #555;">
        📌 <strong>Action Required:</strong> Please contact the user as soon as possible.
      </p>
    </div>

    <div style="background: #f7f7f7; padding: 15px; text-align: center; font-size: 13px; color: #666;">
      This notification was generated automatically from the website.
    </div>
  </div>
`,
    };

    const userMailOptions = {
      from: `${process.env.EMAIL_USER}`,
      to: email,
      subject: "Your enquiry has been received",
      html: `
  <div style="max-width: 650px; margin: auto; font-family: Arial, sans-serif; background: #ffffff; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden;">
    
    <div style="background: #28a745; padding: 20px; color: white; text-align: center;">
      <h2 style="margin: 0; font-size: 22px;">🎉 Your Enquiry Has Been Received</h2>
    </div>

    <div style="padding: 22px;">
      <p style="font-size: 16px; margin-top: 0;">Hi <strong>${name}</strong>,</p>

      <p style="font-size: 15px; line-height: 1.6;">
        Thank you for contacting us. We are pleased to inform you that your enquiry has been
        successfully received. Our team is now reviewing your request and will get back to you shortly.
      </p>

      <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0;">
        <p style="font-size: 15px; margin: 0 0 6px 0;"><strong>Your message:</strong></p>
        <p style="font-size: 15px; margin: 0;">${message}</p>
      </div>

      <p style="font-size: 15px; margin-top: 20px;">
        If you have more questions, feel free to reply to this email — we’re always happy to help!
      </p>

      <p style="font-size: 15px; margin-top: 32px;">
        Best regards,<br/>
        <strong>Support Team</strong>
      </p>
    </div>

    <div style="background: #f1f1f1; padding: 14px; text-align: center; font-size: 13px; color: #666;">
      We appreciate your interest. You will hear from us soon.
    </div>
  </div>
`,
    };

    // 3) Send both emails (in parallel)
    try {
      await Promise.all([
        transporter.sendMail(adminMailOptions),
        transporter.sendMail(userMailOptions),
      ]);
    } catch (mailErr) {
      console.error("Error sending emails:", mailErr);
      // You can still return success for the enquiry, but mention email issue if you want
      return res.status(201).json({
        success: true,
        id: result?.insertId || null,
        message: "Enquiry submitted, but failed to send confirmation emails",
      });
    }

    // 4) Final response
    return res.status(201).json({
      success: true,
      id: result?.insertId || null,
      message: "Enquiry submitted successfully and emails sent",
    });
  } catch (err) {
    console.error("Error in handle_submit:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

async function get_enquiries(req, res) {
  try {
    const data = await get_enquiries_model();

    return res.status(200).json({
      success: true,
      data: Array.isArray(data) ? data[0] : [],
    });
  } catch (err) {
    console.error("Error in get_enquiries:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

async function update_enquiry_status(req, res) {
  try {
    const { id } = req.params;    

    const result = await update_enquiry_model(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }

    return res.json({ success: true, message: "Status updated to seen" });
  } catch (err) {
    console.error("Error updating enquiry status:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export {
  handle_submit,
  get_enquiries,
  update_enquiry_status
}