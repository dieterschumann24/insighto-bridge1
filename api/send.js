export default async function handler(req, res) {
  try {
    // Prüfen ob Body korrekt ist
    if (!req.body) {
      return res.status(400).json({ ok: false, error: "Missing body" });
    }

    const { assistant_id, user_external_id, message } = req.body;

    if (!assistant_id || !user_external_id || !message) {
      return res.status(400).json({ 
        ok: false, 
        error: "Missing fields", 
        received: req.body 
      });
    }

    // Test-Response zurückgeben
    return res.status(200).json({
      ok: true,
      assistant_id,
      user_external_id,
      message,
    });

  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message || "Unknown server error",
    });
  }
}
