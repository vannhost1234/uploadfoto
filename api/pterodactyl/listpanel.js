import axios from 'axios';

export default async function handler(req, res) {
  const { eggid, nestid, loc, domain, ptla, ptlc } = req.query;

  if (!eggid || !nestid || !loc || !domain || !ptla || !ptlc) {
    return res.status(400).json({
      success: false,
      message: 'Missing one or more required parameters'
    });
  }

  try {
    const response = await axios.get(`${ptla}/api/application/servers`, {
      headers: {
        'Authorization': `Bearer ${ptlc}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const allServers = response.data.data;

    const filtered = allServers.filter(server =>
      server.attributes.egg == parseInt(eggid) &&
      server.attributes.nest == parseInt(nestid) &&
      server.attributes.allocation?.location_id == parseInt(loc) &&
      server.attributes.name.toLowerCase().includes(domain.toLowerCase())
    );

    res.json({
      success: true,
      count: filtered.length,
      result: filtered.map(srv => ({
        id: srv.attributes.id,
        uuid: srv.attributes.uuid,
        name: srv.attributes.name,
        user_id: srv.attributes.user,
        egg: srv.attributes.egg,
        nest: srv.attributes.nest,
        location: srv.attributes.allocation.location_id,
        created_at: srv.attributes.created_at
      }))
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch server list',
      error: error.response?.data || error.message
    });
  }
}