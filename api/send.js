// /api/send.js
// Node 18 hat "fetch" nativ – keine extra Abhängigkeiten nötig.

// OPTIONAL: eigene URL per ENV überschreiben (sonst Default).
const INSIGHTO_API_URL =
  process.env.INSIGHTO_API_URL || "https://app.insighto.ai/api/chat";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { assistant_id, user_external_id, message } = req.body || {};

    if (!assistant_id || !user_external_id || !message) {
      return res.status(400).json({
        ok: false,
        error: "Missing fields: assistant_id, user_external_id, message",
        received: req.body,
      });
    }

    // Anfrage an Insighto weiterleiten
    const r = await fetch(INSIGHTO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.INSIGHTO_API_KEY}`,
      },
      body: JSON.stringify({
        assistant_id,
        user_external_id,
        message,
      }),
    });

    const insighto = await r.json();

    // Eine bestmögliche Antwort-Textspur aus der Insighto-Response extrahieren
    const replyText =
      insighto?.reply ||
      insighto?.message ||
      insighto?.text ||
      insighto?.answer ||
      insighto?.choices?.[0]?.message?.content ||
      "";

    return res.status(200).json({
      ok: true,
      sent: { assistant_id, user_external_id, message },
      replyText,
      raw: insighto, // zur Not im Zap aus "raw" mappen
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
