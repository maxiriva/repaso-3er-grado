// Genera qr.png y qr.svg con el link del sitio. Uso: node scripts/make-qr.mjs https://usuario.github.io/repaso-3er-grado/
import QRCode from "qrcode";
const url = process.argv[2];
if (!/^https:\/\//.test(url || "")) { console.error("Pasá el link https del sitio."); process.exit(1); }
const opts = { errorCorrectionLevel: "M", margin: 2, color: { dark: "#1B2539", light: "#FFFFFF" } };
await QRCode.toFile("qr.png", url, { ...opts, width: 800 });
await QRCode.toFile("qr.svg", url, { ...opts, type: "svg" });
console.log("qr.png y qr.svg listos para", url);
