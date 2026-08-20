const express = require("express");
const path = require("path");
const os = require("os");

const app = express();
const PORT = 3000;

app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse form data

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/", (req, res) => {
  res.send("Hello World!, Im a post req");
});
// ✅ GET: File Download
app.get("/download", (req, res) => {
  const filePath = path.join(__dirname, "files", "verified-badge-profile-icon-png.webp");
  res.download(filePath);   // res.download(filePath, "verified-badge-profile-icon-png.webp"); // if you want to specify a different filename for the download
});

// ✅ GET: Return links
app.get("/links", (req, res) => {
  res.json({
    link1:
      "Link 1Here",
    link2:
      "Link 2 Here",
  });
});

// ✅ POST: Simple text message response
app.post("/echo", (req, res) => {
  const { message } = req.body;
  res.json({ received: message });
});

// ✅ POST: Simulate login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "secret") {
    return res.json({ success: true, token: "fake-jwt-token" });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }
});

// ✅ POST: Receive firmware update info
app.post("/firmware", (req, res) => {
  const { version, deviceId } = req.body;
  console.log(
    `Received firmware update request from ${deviceId} for version ${version}`
  );
  res.json({ status: "Queued for update", deviceId, version });
});

app.listen(PORT, () => {
  // Get LAN IPv4 address
  const interfaces = os.networkInterfaces();
  let lanIp = "localhost";
  for (let key in interfaces) {
    for (let iface of interfaces[key] || []) {
      if (iface.family === "IPv4" && !iface.internal) {
        lanIp = iface.address;
      }
    }
  }
  let time = Date();
  console.log(`\n`);
  console.log(`⏰ ${time}`);
  console.log(`✅ Server running at:`);
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   Network: http://${lanIp}:${PORT}`);
  console.log(
    `✅ File download server running at: http://localhost:${PORT}/download`
  );
});
