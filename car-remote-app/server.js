const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = path.join(__dirname, 'data.json');

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {}
  return { parkedLocation: null, vehicleToken: null };
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

let store = loadData();

const CLIENT_ID = process.env.SMARTCAR_CLIENT_ID;
const CLIENT_SECRET = process.env.SMARTCAR_CLIENT_SECRET;
const REDIRECT_URI = process.env.SMARTCAR_REDIRECT_URI || 'http://localhost:3001/callback';
const SC_MODE = process.env.SMARTCAR_MODE || 'live'; // set to 'simulated' for testing without a real car

// ── Parking ──────────────────────────────────────────────────────────────────

app.get('/api/parking', (_req, res) => res.json({ location: store.parkedLocation }));

app.post('/api/parking', (req, res) => {
  const { lat, lng, address, timestamp } = req.body;
  store.parkedLocation = { lat, lng, address, timestamp };
  saveData(store);
  res.json({ success: true, location: store.parkedLocation });
});

app.delete('/api/parking', (_req, res) => {
  store.parkedLocation = null;
  saveData(store);
  res.json({ success: true });
});

// ── SmartCar OAuth ────────────────────────────────────────────────────────────

app.get('/auth/connect', (req, res) => {
  if (!CLIENT_ID) {
    return res.status(500).send('SMARTCAR_CLIENT_ID env var not set. See car-remote-app/README for setup.');
  }
  const scope = [
    'required:read_vehicle_info',
    'required:read_location',
    'required:control_security',
  ].join(' ');

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope,
    mode: SC_MODE,
  });

  res.redirect(`https://connect.smartcar.com/oauth/authorize?${params}`);
});

app.get('/callback', async (req, res) => {
  const { code, error } = req.query;
  if (error) return res.redirect('/?error=' + encodeURIComponent(error));
  if (!code) return res.status(400).send('No auth code received');

  try {
    const tokenRes = await fetch('https://auth.smartcar.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const tokens = await tokenRes.json();
    if (tokens.error) return res.redirect('/?error=' + encodeURIComponent(tokens.error_description || tokens.error));

    tokens.expires_at = Date.now() + tokens.expires_in * 1000;
    store.vehicleToken = tokens;
    saveData(store);

    res.redirect('/?connected=true');
  } catch (err) {
    res.redirect('/?error=' + encodeURIComponent(err.message));
  }
});

// ── Token helpers ─────────────────────────────────────────────────────────────

async function getToken() {
  if (!store.vehicleToken) throw new Error('Car not connected');

  if (Date.now() >= store.vehicleToken.expires_at - 60_000) {
    const r = await fetch('https://auth.smartcar.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
      },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: store.vehicleToken.refresh_token }),
    });
    const t = await r.json();
    t.expires_at = Date.now() + t.expires_in * 1000;
    store.vehicleToken = t;
    saveData(store);
  }

  return store.vehicleToken.access_token;
}

async function getVehicleId(token) {
  const r = await fetch('https://api.smartcar.com/v2.0/vehicles', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const d = await r.json();
  if (!d.vehicles?.length) throw new Error('No vehicles found on this account');
  return d.vehicles[0];
}

// ── Car controls ──────────────────────────────────────────────────────────────

app.get('/api/car/status', (_req, res) => res.json({ connected: !!store.vehicleToken }));

app.post('/api/car/unlock', async (_req, res) => {
  try {
    const token = await getToken();
    const id = await getVehicleId(token);
    const r = await fetch(`https://api.smartcar.com/v2.0/vehicles/${id}/security`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'UNLOCK' }),
    });
    res.json({ success: r.ok, status: r.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/car/lock', async (_req, res) => {
  try {
    const token = await getToken();
    const id = await getVehicleId(token);
    const r = await fetch(`https://api.smartcar.com/v2.0/vehicles/${id}/security`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'LOCK' }),
    });
    res.json({ success: r.ok, status: r.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/car/start', async (_req, res) => {
  try {
    const token = await getToken();
    const id = await getVehicleId(token);
    const r = await fetch(`https://api.smartcar.com/v2.0/vehicles/${id}/engine/start`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await r.json().catch(() => ({}));
    if (!r.ok) {
      const msg = body.message || 'Remote start not supported by this vehicle';
      return res.status(r.status).json({ error: msg });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Car Remote App → http://localhost:${PORT}`);
  if (!CLIENT_ID) console.warn('⚠  SMARTCAR_CLIENT_ID not set — car controls disabled until configured');
});
