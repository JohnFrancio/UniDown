const express = require("express");
const cors = require("cors");
const { chooseUrl, downloadFile } = require("./download");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;
const HOSTNAME = process.env.NAME;

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

app.use(express.json()); // For parsing JSON request bodies

//check the api
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Route to download a video from a chosen platform
app.post("/download", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required." });
  }

  try {
    // Choose the URL based on the platform
    const downloadUrl = await chooseUrl(url);

    // Start the download process
    await downloadFile(downloadUrl, "720 HD");
    res.status(200).json({ message: "Video Downloaded!" });
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({ error: "Failed to download the file." });
  }
});

app.listen(PORT, () => {
  console.log(`API server is running on http://${HOSTNAME}:${PORT}`);
});

module.exports = app;
