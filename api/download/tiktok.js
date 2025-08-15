const cheerio = require("cheerio")
const axios = require("axios")

async function tiktok(query) {
    try {
        const encodedParams = new URLSearchParams();
        encodedParams.set("url", query);
        encodedParams.set("hd", "1");

        const response = await axios({
            method: "POST",
            url: "https://tikwm.com/api/",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                Cookie: "current_language=en",
                "User-Agent":
                    "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
            },
            data: encodedParams,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

const headers = {
    "authority": "ttsave.app",
    "accept": "application/json, text/plain, */*",
    "origin": "https://ttsave.app",
    "referer": "https://ttsave.app/en",
    "user-agent": "Postify/1.0.0",
};

const tiktokdl = {
    submit: async function (url, referer) {
        const headerx = { ...headers, referer };
        const data = { "query": url, "language_id": "1" };
        return axios.post('https://ttsave.app/download', data, { headers: headerx });
    },

    parse: function ($) {
        const description = $('p.text-gray-600').text().trim();
        const dlink = {
            nowm: $('a.w-full.text-white.font-bold').first().attr('href'),
            audio: $('a[type="audio"]').attr('href'),
        };

        const slides = $('a[type="slide"]').map((i, el) => ({
            number: i + 1,
            url: $(el).attr('href')
        })).get();

        return { description, dlink, slides };
    },

    fetchData: async function (link) {
        try {
            const response = await this.submit(link, 'https://ttsave.app/en');
            const $ = cheerio.load(response.data);
            const result = this.parse($);
            return {
                video_nowm: result.dlink.nowm,
                audio_url: result.dlink.audio,
                slides: result.slides,
                description: result.description
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = function (app) {
    app.get('/download/tiktok', async (req, res) => {
        const { url } = req.query;
        if (!url) return res.status(400).json({ status: false, error: 'Url is required' });

        try {
            const results = await tiktokdl.fetchData(url);
            res.status(200).json({
                status: true,
                result: results
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });

    app.get('/download/tiktok-v2', async (req, res) => {
        const { url } = req.query;
        if (!url) return res.status(400).json({ status: false, error: 'Url is required' });

        try {
            const results = await tiktok(url);
            res.status(200).json({
                status: true,
                result: results
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
}