// Keycloak Realm Provisioner — a REST-backed Codesphere Managed Service provider.
//
// On-site challenge starter (Module 7). See Course A, Module 7, article 7.5
// ("On-Site Challenge — Keycloak Realm Provisioner") in the Learning Hub.
//
// Each "service instance" Codesphere books against this backend = one Keycloak
// realm + one OIDC client in the Keycloak you already deployed in Module 6
// (the "keycloak" CI profile / Workspace). This is the same REST contract taught
// in article 7.2 — implement it against Keycloak's Admin REST API instead of a
// mail server:
//
//   POST   /            create a service instance -> 201, empty body
//   GET    /?id={id}    status poll -> { plan, config, details, ready }
//   PATCH  /{id}        update service configuration
//   DELETE /{id}        delete service instance
//
// Codesphere polls GET /?id=... after POST / until details.ready is true, then
// templates `details` into the consuming Landscape's ci.yml. See article 7.2 for
// the full contract, and article 7.3 for auth/security expectations on this
// backend (this starter does not implement the bearer-token check — see the TODO
// near the bottom, and treat that as part of the challenge, not optional).
//
// Uses Node's built-in fetch (Node 18+) — no HTTP client dependency needed.

const express = require('express');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const KEYCLOAK_ADMIN_URL = process.env.KEYCLOAK_ADMIN_URL; // e.g. http://<headless-target>:80
const KEYCLOAK_ADMIN_USER = process.env.KEYCLOAK_ADMIN_USER || 'admin';
const KEYCLOAK_ADMIN_PASSWORD = process.env.KEYCLOAK_ADMIN_PASSWORD;

// In-memory store: id -> { realm, clientId, plan, config, details }
// A restart loses all state — fine for the challenge, call it out as a known
// limitation in your submission notes if you don't get to fixing it.
const services = new Map();

// --- Keycloak Admin API helper --------------------------------------------
//
// Boilerplate provided so you can focus on the provider contract itself.
// Uses the Resource Owner Password Credentials grant against the `admin-cli`
// client in the `master` realm — the standard way to script the Keycloak Admin
// API. Token is short-lived; this refetches every call rather than caching,
// which is fine at this scale.
async function getAdminToken() {
  const resp = await fetch(
    `${KEYCLOAK_ADMIN_URL}/realms/master/protocol/openid-connect/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'password',
        client_id: 'admin-cli',
        username: KEYCLOAK_ADMIN_USER,
        password: KEYCLOAK_ADMIN_PASSWORD,
      }),
    }
  );
  if (!resp.ok) {
    throw new Error(`Failed to get admin token: HTTP ${resp.status}`);
  }
  const { access_token } = await resp.json();
  return access_token;
}

async function kcAdminRequest(token, method, path, body) {
  const resp = await fetch(`${KEYCLOAK_ADMIN_URL}/admin${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return resp;
}

// --- POST / — create service -----------------------------------------------
app.post('/', async (req, res) => {
  const { id, config } = req.body;

  // TODO: validate input — you need at least a REALM_NAME and a REDIRECT_URI
  // (Mealie's BASE_URL + /login is a good default) from `config`.

  // TODO:
  // 1. Get an admin token (getAdminToken() above).
  // 2. POST /admin/realms to create the realm (config.REALM_NAME).
  // 3. POST /admin/realms/{realm}/clients to create a confidential OIDC client
  //    with the given redirect URI. Keycloak generates the client secret for
  //    you — fetch it with GET /admin/realms/{realm}/clients/{clientUuid}/client-secret.
  // 4. Store { realm, clientId, plan, config, details } in `services` keyed by id.
  //    `details` should include at least: issuer (the realm's OIDC discovery
  //    URL), client_id, client_secret, ready: true — these are exactly the
  //    values Mealie's OIDC_* env vars need (see Module 6, article 6.6).
  // 5. Respond 201 with an empty body — per the contract, details are polled
  //    via GET, never returned here.

  res.status(501).json({ error: 'not implemented — see the TODOs above' });
});

// --- GET /?id={id} — status poll --------------------------------------------
app.get('/', (req, res) => {
  const { id } = req.query;

  if (!id) {
    // No id -> list known service ids (useful for your own debugging).
    return res.json(Array.from(services.keys()));
  }

  const svc = services.get(id);
  if (!svc) return res.status(404).json({ error: 'not found' });

  // TODO: once POST / actually populates `svc.details`, this just returns it.
  res.json({ plan: svc.plan, config: svc.config, details: svc.details });
});

// --- PATCH /{id} — update service -------------------------------------------
app.patch('/:id', async (req, res) => {
  const svc = services.get(req.params.id);
  if (!svc) return res.status(404).json({ error: 'not found' });

  // TODO: support at least updating the client's redirect URI via
  // PUT /admin/realms/{realm}/clients/{clientUuid}.

  res.status(501).json({ error: 'not implemented — see the TODO above' });
});

// --- DELETE /{id} — delete service ------------------------------------------
app.delete('/:id', async (req, res) => {
  const svc = services.get(req.params.id);
  if (!svc) return res.status(404).json({ error: 'not found' });

  // TODO: DELETE /admin/realms/{realm} removes the realm and everything in it
  // (clients, users) in one call.

  services.delete(req.params.id);
  res.status(501).json({ error: 'not implemented — see the TODO above' });
});

// TODO (article 7.3): reject any request that doesn't present the bearer token
// Codesphere is configured to send. For this challenge, protect the backend
// with a static shared-secret check via a `provider.yml`-declared header, or at
// minimum document in your submission how you'd wire this in a real install —
// don't skip this silently.

app.listen(PORT, () => {
  console.log(`keycloak-realm-provider listening on :${PORT}`);
});
