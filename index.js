const { addonBuilder } = require("stremio-addon-sdk");

const manifest = {
  id: "org.kanale.shqip",
  version: "1.0.0",
  name: "Kanale Shqip",
  description: "Addon with Albanian live channels",
  resources: ["catalog", "stream"],
  types: ["tv"],
  catalogs: [{ type: "tv", id: "kanale_shqip_catalog" }],
  idPrefixes: ["kanale_"],
};

const streams = {
  "kanale_klan": { title: "Klan", url: "http://a1.lion.wine:80/live/x9Kw7670/8cxU9044/261956.m3u8" },
  "kanale_topchannel": { title: "Top Channel", url: "http://a1.lion.wine:80/live/x9Kw7670/8cxU9044/261954.m3u8" },
  "kanale_rtsh1": { title: "RTSH 1", url: "http://a1.lion.wine:80/live/x9Kw7670/8cxU9044/261964.m3u8" },
  "kanale_rtsh2": { title: "RTSH 2", url: "http://a1.lion.wine:80/live/x9Kw7670/8cxU9044/261965.m3u8" },
  "kanale_aksion": { title: "Film Aksion", url: "http://a1.lion.wine:80/live/x9Kw7670/8cxU9044/262027.m3u8" },
  "kanale_tringsuper": { title: "Tring Super", url: "http://a1.lion.wine:80/live/x9Kw7670/8cxU9044/262039.m3u8" },
  "kanale_supersport2": { title: "Super Sport 2", url: "http://a1.lion.wine:80/live/x9Kw7670/8cxU9044/262222.m3u8" },
  "kanale_tringsport1": { title: "Tring Sport 1", url: "http://a1.lion.wine:80/live/x9Kw7670/8cxU9044/262243.m3u8" },
  "kanale_natgeo": { title: "National Geographic HD", url: "http://a1.lion.wine:80/live/x9Kw7670/8cxU9044/262189.m3u8" },
  "kanale_discovery": { title: "Discovery Channel HD", url: "http://a1.lion.wine:80/live/x9Kw7670/8cxU9044/262191.m3u8" },
};

const builder = new addonBuilder(manifest);

builder.defineCatalogHandler(() => {
  const metas = Object.entries(streams).map(([id, stream]) => ({
    id,
    type: "tv",
    name: stream.title,
    poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/TV_icon_2.svg/600px-TV_icon_2.svg.png",
  }));
  return Promise.resolve({ metas });
});

builder.defineStreamHandler(({ id }) => {
  const stream = streams[id];
  return Promise.resolve({ streams: stream ? [{ title: stream.title, url: stream.url }] : [] });
});

module.exports = builder.getInterface();
const express = require("express");
const app = express();
const port = process.env.PORT || 80;


app.get("/manifest.json", (req, res) => {
  res.json(builder.getInterface().manifest);
});

app.get("/catalog/:type/:id.json", async (req, res) => {
  const { metas } = await builder.getInterface().get("catalog", req.params);
  res.json({ metas });
});

app.get("/stream/:type/:id.json", async (req, res) => {
  const { streams } = await builder.getInterface().get("stream", req.params);
  res.json({ streams });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Addon is running at: http://localhost:${port}/manifest.json`);
});



