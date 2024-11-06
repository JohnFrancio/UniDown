const fs = require("fs");
const axios = require("axios");
const path = require("path");
const nayan = require("nayan-media-downloader");
const os = require("os");

const osPath = `${os.homedir()}/Downloads/uni-down`;
fs.mkdirSync(osPath, { recursive: true });

const { instagram, ndown, tikdown, ytdown } = nayan;
async function chooseUrl(url) {
  let data, res, type;
  let choice = url.includes("facebook.com")
    ? "facebook"
    : url.includes("instagram.com")
    ? "instagram"
    : url.includes("tiktok.com")
    ? "tiktok"
    : url.includes("youtube.com") || url.includes("youtu.be")
    ? "youtube"
    : "";
  switch (choice) {
    case "instagram":
      data = await instagram(url);
      return data.data.video;
    case "facebook":
      data = await ndown(url);
      return data.data[0].url;
    case "tiktok":
      data = await tikdown(url);
      return data.data.video;
    case "youtube":
      data = await ytdown(url);
      return data.data.video;
    default:
      return "Something went wrong while downloading your video.";
  }
}

async function downloadFile(fileUrl, resolution) {
  const fileName = `video_${resolution}_${Date.now()}.mp4`;
  const filePath = path.resolve(osPath, fileName);
  const response = await axios.get(fileUrl, { responseType: "stream" });

  response.data.pipe(fs.createWriteStream(filePath));
  // console.log(`Downloading ${resolution}...`);

  return new Promise((resolve, reject) => {
    response.data.on("end", () => {
      // console.log(`Downloaded ${fileName}`);
      resolve();
    });
    response.data.on("error", reject);
  });
}

module.exports = {
  chooseUrl,
  downloadFile,
};
