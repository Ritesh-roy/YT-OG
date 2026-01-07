// ================================
// YOUTUBE VIDEO PROCESS + RAPID API
// ================================

async function processVideo() {
  const urlInput = document.getElementById("videoUrl").value.trim()

  if (!urlInput) {
    alert("Please input a YouTube URL")
    return
  }

  const loader = document.getElementById("loader")
  const result = document.getElementById("resultSection")

  loader.style.display = "block"
  result.style.display = "none"

  // ✅ Extract Video ID (supports youtu.be, watch?v=, shorts)
  let videoId = null
  try {
    const parsed = new URL(urlInput)

    if (parsed.hostname.includes("youtu.be")) {
      videoId = parsed.pathname.replace("/", "")
    } else if (parsed.searchParams.get("v")) {
      videoId = parsed.searchParams.get("v")
    } else if (parsed.pathname.includes("/shorts/")) {
      videoId = parsed.pathname.split("/shorts/")[1]
    }
  } catch (e) {}

  if (!videoId) {
    loader.style.display = "none"
    alert("Invalid YouTube URL")
    return
  }

  try {
    // ============================
    // 1️⃣ FETCH VIDEO META (SAFE)
    // ============================
    const metaRes = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    )
    const meta = await metaRes.json()

    document.getElementById("displayThumb").src =
      `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    document.getElementById("displayTitle").innerText = meta.title
    document.getElementById("displayAuthor").innerText = meta.author_name

    // ============================
    // 2️⃣ RAPIDAPI – CHANNEL VIDEOS
    // ============================
    const apiUrl = "https://youtube138.p.rapidapi.com/channel/videos/"

    const apiOptions = {
      method: "POST",
      headers: {
        "x-rapidapi-key": "417c460c40msh5b12538f9b7eeeep174e0fjsn41109c2ce8fa",
        "x-rapidapi-host": "youtube138.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: "UCJ5v_MCY6GNUBTO8-D3XoAg",
        filter: "videos_latest",
        cursor: "",
        hl: "en",
        gl: "US",
      }),
    }

    const apiRes = await fetch(apiUrl, apiOptions)
    const apiData = await apiRes.json()

    console.log("RapidAPI Result:", apiData)

    // ============================
    // 3️⃣ DOWNLOAD LINKS
    // ============================
    document.getElementById("dl-1080").href =
      `https://9xbuddy.com/download?url=https://www.youtube.com/watch?v=${videoId}`
    document.getElementById("dl-720").href =
      `https://en.savefrom.net/1-youtube-video-downloader-460/?url=https://www.youtube.com/watch?v=${videoId}`
    document.getElementById("dl-mp3").href =
      "https://ytmp3.nu/C0ZE/"

    loader.style.display = "none"
    result.style.display = "block"

  } catch (error) {
    loader.style.display = "none"
    console.error(error)
    alert("API connection failed. Try again.")
  }
}
