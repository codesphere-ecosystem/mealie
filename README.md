# csa-mealie-demo

Starter repository for the Certified Codesphere Application Developer on-site
challenge. Full instructions, hints, and checkpoints live in the Learning Hub —
Course A, Modules 3–7, in the "On-Site Challenge" article at the end of each
module. This README only covers how the repo is laid out.

## CI profiles

This one repo holds three CI profiles (see Course A, article 3.6, CI Profiles &
Headless Services). Deploy each from its own Workspace, all in the same Team, so
they run concurrently:

| Profile | File(s) | Workspace | Module |
| :--- | :--- | :--- | :--- |
| `mealie` | `ci.mealie.yml` | e.g. `mealie` | 3, 4, 5 |
| `keycloak` | `ci.keycloak.yml`, `values.yaml`, `values.prod.yaml` | e.g. `keycloak` | 6 |
| `realm-provider` | `ci.realm-provider.yml`, `realm-provider/` | own Workspace, or run alongside `keycloak` | 7 |

All three files are intentionally incomplete starters — the Learning Hub articles
walk through what to fill in and why.

## Reference material

- `tutorials/1_mealie-container-vcluster-runtime.md` in the main workspace —
  the original Mealie + Keycloak + OIDC tutorial this challenge is built on.
- `vcluster-keycloak/` (separate repo) — a complete, working Keycloak-in-vCluster
  reference implementation. Useful if you get stuck on Module 6, but the point of
  the challenge is to build `ci.keycloak.yml` yourself first.
- The `solution` branch of this repo has the previous, fully-working version of
  `ci.mealie.yml` (as `ci.postgres.yml`) — ask a facilitator if you want a peek.
