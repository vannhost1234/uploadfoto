export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: false, error: 'Method Not Allowed' });
  }

  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ status: false, error: 'Url is required' });
    }

    const response = await fetch(`https://fastrestapis.fasturl.cloud/downup/bstationdown?url=${encodeURIComponent(url)}`);
    const data = await response.json();

    if (!data || !data.result) {
      return res.status(502).json({ status: false, error: 'Invalid response from upstream API' });
    }

    return res.status(200).json({
      status: true,
      result: data.result
    });

  } catch (error) {
    return res.status(500).json({ status: false, error: `Internal Server Error: ${error.message}` });
  }
}