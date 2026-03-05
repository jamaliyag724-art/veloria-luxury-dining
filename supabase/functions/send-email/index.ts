import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const RESEND_API = "https://api.resend.com/emails";

const goldColor = "#D4AF37";
const darkBg = "#0f0f0f";
const cardBg = "#1a1a1d";
const textLight = "#e5e5e5";
const textMuted = "#999999";

const baseTemplate = (title: string, body: string) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${darkBg};font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${darkBg};padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:${cardBg};border-radius:24px;border:1px solid rgba(212,175,55,0.2);overflow:hidden;">
        <tr><td style="padding:40px 40px 20px;text-align:center;border-bottom:1px solid rgba(212,175,55,0.15);">
          <h1 style="font-family:Georgia,serif;font-size:32px;color:${goldColor};margin:0;letter-spacing:2px;">VELORIA</h1>
          <p style="color:${textMuted};font-size:12px;margin:8px 0 0;letter-spacing:3px;text-transform:uppercase;">Fine Dining Experience</p>
        </td></tr>

        <tr><td style="padding:30px 40px 10px;text-align:center;">
          <h2 style="font-family:Georgia,serif;font-size:24px;color:${textLight};margin:0;">${title}</h2>
        </td></tr>

        <tr><td style="padding:20px 40px 40px;color:${textLight};font-size:14px;line-height:1.8;">
          ${body}
        </td></tr>

        <tr><td style="padding:20px 40px;text-align:center;border-top:1px solid rgba(212,175,55,0.15);background:rgba(0,0,0,0.3);">
          <p style="color:${textMuted};font-size:11px;margin:0;">© ${new Date().getFullYear()} Veloria Fine Dining. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

const orderConfirmationHtml = (data: any) => {
  const itemsHtml = (data.items || [])
    .map(
      (item: any) =>
        `<tr>
          <td style="padding:8px 0;color:${textLight};border-bottom:1px solid rgba(255,255,255,0.05);">${item.name} × ${item.quantity}</td>
          <td style="padding:8px 0;color:${goldColor};text-align:right;border-bottom:1px solid rgba(255,255,255,0.05);">₹${(item.price * item.quantity).toFixed(0)}</td>
        </tr>`
    )
    .join("");

  return baseTemplate(
    "Order Confirmed! 🎉",
    `<p>Dear <strong>${data.fullName}</strong>,</p>
    <p>Thank you for your order. Here are your details:</p>

    <div style="background:rgba(0,0,0,0.3);border-radius:16px;padding:20px;margin:20px 0;border:1px solid rgba(212,175,55,0.1);">
      <p style="margin:0 0 10px;"><span style="color:${textMuted};">Order ID:</span> <strong style="color:${goldColor};">${data.orderId}</strong></p>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px;">
        ${itemsHtml}

        <tr><td colspan="2" style="padding:12px 0 0;border-top:1px solid rgba(212,175,55,0.2);"></td></tr>

        <tr>
          <td style="color:${textMuted};padding:4px 0;">Subtotal</td>
          <td style="color:${textLight};text-align:right;">₹${data.subtotal}</td>
        </tr>

        <tr>
          <td style="color:${textMuted};padding:4px 0;">Tax</td>
          <td style="color:${textLight};text-align:right;">₹${data.tax}</td>
        </tr>

        <tr>
          <td style="font-family:Georgia,serif;font-size:18px;color:${textLight};padding:8px 0 0;">Total</td>
          <td style="font-family:Georgia,serif;font-size:18px;color:${goldColor};text-align:right;padding:8px 0 0;">₹${data.totalAmount}</td>
        </tr>
      </table>
    </div>

    <p style="text-align:center;margin-top:24px;">
      <a href="${data.trackingLink || '#'}" style="display:inline-block;background:${goldColor};color:#000;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:600;font-size:14px;">Track Your Order</a>
    </p>`
  );
};

const reservationConfirmationHtml = (data: any) =>
  baseTemplate(
    "Reservation Confirmed ✨",
    `<p>Dear <strong>${data.fullName}</strong>,</p>
    <p>Your table has been reserved. We look forward to welcoming you!</p>

    <div style="background:rgba(0,0,0,0.3);border-radius:16px;padding:20px;margin:20px 0;border:1px solid rgba(212,175,55,0.1);">
      <p style="margin:4px 0;"><span style="color:${textMuted};">Reservation ID:</span> <strong style="color:${goldColor};">${data.reservationId}</strong></p>
      <p style="margin:4px 0;"><span style="color:${textMuted};">Date:</span> ${data.date}</p>
      <p style="margin:4px 0;"><span style="color:${textMuted};">Time:</span> ${data.time}</p>
      <p style="margin:4px 0;"><span style="color:${textMuted};">Guests:</span> ${data.guests}</p>
      ${data.specialRequest ? `<p style="margin:4px 0;"><span style="color:${textMuted};">Special Request:</span> ${data.specialRequest}</p>` : ""}
    </div>

    <p style="text-align:center;margin-top:24px;">
      <a href="${data.statusLink || '#'}" style="display:inline-block;background:${goldColor};color:#000;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:600;font-size:14px;">Check Status</a>
    </p>`
  );

const orderStatusUpdateHtml = (data: any) =>
  baseTemplate(
    `Order ${data.status}`,
    `<p>Dear <strong>${data.fullName}</strong>,</p>

    <p>Your order <strong style="color:${goldColor};">${data.orderId}</strong> status has been updated:</p>

    <div style="text-align:center;margin:24px 0;">
      <span style="display:inline-block;background:${goldColor}22;border:1px solid ${goldColor}44;color:${goldColor};padding:12px 28px;border-radius:50px;font-size:16px;font-weight:600;">${data.status}</span>
    </div>

    <p style="text-align:center;margin-top:24px;">
      <a href="${data.trackingLink || '#'}" style="display:inline-block;background:${goldColor};color:#000;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:600;font-size:14px;">Track Order</a>
    </p>`
  );

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "RESEND_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { type, data } = await req.json();

    let subject: string;
    let html: string;
    let to: string;

    switch (type) {
      case "order_confirmation":
        subject = `Order Confirmed - ${data.orderId} | Veloria`;
        html = orderConfirmationHtml(data);
        to = data.email;
        break;

      case "reservation_confirmation":
        subject = `Reservation Confirmed - ${data.reservationId} | Veloria`;
        html = reservationConfirmationHtml(data);
        to = data.email;
        break;

      case "order_status_update":
        subject = `Order ${data.status} - ${data.orderId} | Veloria`;
        html = orderStatusUpdateHtml(data);
        to = data.email;
        break;

      default:
        return new Response(JSON.stringify({ error: "Invalid email type" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Veloria <onboarding@resend.dev>",
        to: [to],
        subject,
        html,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("Resend error:", result);

      return new Response(JSON.stringify({ error: "Email send failed", details: result }), {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Edge function error:", err);

    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
