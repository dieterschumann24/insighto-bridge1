// Datei: api/send.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const { assistant_id, user_external_id, message } = req.body || {};
    if (!assistant_id || !user_external_id || !message) {
      return res.status(400).json({
        error: 'Missing required fields',
        need: { assistant_id: true, user_external_id: true, message: true },
        got: { assistant_id, user_external_id, message }
      });
    }

    // Hier (später) dein Insighto-Request:
    // const r = await fetch('https://DEIN_INSIGHTO_ENDPOINT', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.INSIGHTO_API_KEY}`
    //   },
    //   body: JSON.stringify({ assistant_id, user_external_id, message })
    // });

    console.log('Received from Zapier:', { assistant_id, user_external_id, message });

    return res.status(200).json({
      ok: true,
      received: { assistant_id, user_external_id, message }
    });
  } catch (err) {
    console.error('Server error in /api/send:', err);
    return res.status(500).json({ error: 'Server error', details: err?.message || String(err) });
  }
}
