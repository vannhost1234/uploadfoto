const axios = require('axios');
const cheerio = require('cheerio');

async function facebook(url) {
    if (!/facebook\.\w+\/(reel|watch|share)/gi.test(url)) {
        throw new Error("URL tidak valid. Harap masukkan URL video Facebook yang benar.");
    }

    try {
        const pageRes = await axios.get("https://fdownloader.net/id", {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
            },
        });

        const html = pageRes.data;
        const ex = html.match(/k_exp ?= ?"(\d+)"/i)?.[1];
        const token = html.match(/k_token ?= ?"([a-f0-9]+)"/i)?.[1];

        if (!ex || !token) {
            throw new Error("Gagal mengambil token k_exp atau k_token.");
        }

        const postRes = await axios.post(
            "https://v3.fdownloader.net/api/ajaxSearch?lang=id",
            new URLSearchParams({
                k_exp: ex,
                k_token: token,
                q: url,
                lang: "id",
                web: "fdownloader.net",
                v: "v2",
                w: "",
            }),
            {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                    "Origin": "https://fdownloader.net",
                    "Content-Type": "application/x-www-form-urlencoded"
                },
            }
        );

        const data = postRes.data;
        if (data.status !== "ok") {
            throw new Error("Gagal mengambil data dari fdownloader.");
        }

        const $ = cheerio.load(data.data);
        const title = $(".thumbnail > .content > .clearfix > h3").text().trim();
        const duration = $(".thumbnail > .content > .clearfix > p").text().trim();
        const thumbnail = $(".thumbnail > .image-fb > img").attr("src") || null;
        const audio = $("#fbdownloader").find("#audioUrl").attr("value") || null;

        const videos = $("#fbdownloader")
            .find(".tab__content")
            .eq(0)
            .find("tr")
            .map((i, el) => {
                const quality = $(el).find(".video-quality").text().trim();
                const videoUrl =
                    $(el).find("a").attr("href") ||
                    $(el).find("button").attr("data-videourl") ||
                    null;
                return videoUrl && videoUrl !== "#note_convert" ? { quality, url: videoUrl } : null;
            })
            .get()
            .filter(Boolean);

        return {
            title,
            duration,
            thumbnail,
            video: videos,
            audio
        };
    } catch (error) {
        throw new Error("Gagal memproses permintaan: " + error.message);
    }
}

module.exports = function (app) {
    app.get('/download/facebook', async (req, res) => {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ status: false, error: 'Parameter url wajib diisi.' });
        }

        try {
            const result = await facebook(url);
            res.status(200).json({ status: true, result });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
};