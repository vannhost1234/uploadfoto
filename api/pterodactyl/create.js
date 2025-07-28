import axios from 'axios';

export default async function handler(req, res) {
  const {
    username, ram, disk, cpu = 0,
    eggid, nestid, loc, domain, ptla, ptlc
  } = req.query;

  if (!username || !ram || !disk || !eggid || !nestid || !loc || !domain || !ptla || !ptlc) {
    return res.status(400).json({ success: false, message: "Missing required parameters" });
  }

  try {
    const createServer = await axios.post(
      `${ptla}/api/application/servers`,
      {
        name: username,
        user: 1, // Ganti sesuai ID user di panel
        egg: parseInt(eggid),
        docker_image: "ghcr.io/pterodactyl/yolks:nodejs_18",
        startup: "npm start",
        environment: {
          STARTUP_CMD: "npm start"
        },
        limits: {
          memory: parseInt(ram),
          swap: 0,
          disk: parseInt(disk),
          io: 500,
          cpu: parseInt(cpu)
        },
        feature_limits: {
          databases: 1,
          allocations: 1,
          backups: 1
        },
        allocation: {
          default: parseInt(loc)
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: []
        },
        start_on_completion: true
      },
      {
        headers: {
          'Authorization': `Bearer ${ptlc}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    return res.status(200).json({
      success: true,
      message: "Server created successfully!",
      data: createServer.data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create server",
      error: error.response?.data || error.message
    });
  }
}