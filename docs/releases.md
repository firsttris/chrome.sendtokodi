---
description: How SendToKodi extension releases work. Version bump workflow, vX.Y.Z tags, the GitHub release with both packages, automatic uploads to the Chrome Web Store, Mozilla Add-ons and Microsoft Edge Add-ons, required secrets.
---

# Releases

A release is a tag `vX.Y.Z`, as in the other projects of [firsttris/workflows](https://github.com/firsttris/workflows).
Everything after the tag is automated: checks, builds, the GitHub release and the uploads to the three stores.

## Continuous integration

**Check Build** (`.github/workflows/check_build.yml`) runs on every push to `master` and every pull request:

1. `npm run check` (Biome lint and format), `npm run typecheck`, `npm test`
2. The Chrome build and the Firefox build, each packaged as `sendToKodi-<browser>-<version>.zip`
3. `web-ext lint` on the Firefox build, which is what Mozilla's review runs

The packages are attached to the run as the `extension` artifact, so a pull request can be tested by loading its
build. Draft pull requests don't build; marking them *Ready for review* does. Documentation-only changes (`*.md`,
`docs/`) don't trigger it. **Docs** (`.github/workflows/docs.yml`) builds this documentation for pull requests that
touch it and publishes it on `master`.

## Making a release

1. *Actions → Bump version → Run workflow* and choose `patch`, `minor` or `major`. The workflow raises the version in
   `package.json`, commits it as `Release vX.Y.Z`, tags the commit and pushes both. On a checkout, `npm run
   release:patch` (or `:minor`, `:major`) does the same.
2. The tag starts **Release** (`.github/workflows/release.yml`): the checks and both builds from *Check Build*, then
   a GitHub release with generated notes and both packages, then the store uploads in parallel.
3. The **Chrome Web Store** package is uploaded as a draft and has to be submitted for review in the developer
   dashboard. **Mozilla Add-ons** receives the package and the source archive of the tagged commit for its review
   and publishes after approval. **Microsoft Edge Add-ons** receives the package and publishes after its review.

To submit an existing version again, for example to one store only, run **Release** by hand on its tag and untick the
other stores:

```bash
gh workflow run bump.yml -f bump=minor                        # new release, all stores
gh workflow run release.yml --ref v0.0.51 -f edge=false      # existing release, again without Edge
```

The shared workflows `github-release.yml` and `browser-extension-stores.yml` live in
[firsttris/workflows](https://github.com/firsttris/workflows).

## Secrets

The store uploads need these repository secrets:

| Store | Secrets | Where to get them |
|---|---|---|
| Chrome Web Store | `CHROME_EXTENSION_ID`, `CHROME_CLIENT_ID`, `CHROME_CLIENT_SECRET`, `CHROME_REFRESH_TOKEN` | [chrome-webstore-upload-keys](https://github.com/fregante/chrome-webstore-upload-keys). The publisher ID is not secret and is set in the workflow; it is part of the developer dashboard URL. |
| Mozilla Add-ons | `AMO_JWT_ISSUER`, `AMO_JWT_SECRET` | [API keys](https://addons.mozilla.org/developers/addon/api/key/) |
| Microsoft Edge Add-ons | `EDGE_PRODUCT_ID`, `EDGE_CLIENT_ID`, `EDGE_API_KEY` | [Publish API](https://partner.microsoft.com/dashboard/microsoftedge/publishapi) |

## Store listings

The texts and images for the listings are in `store-assets/`: the description (`webstore-description.txt`), the
banners in the sizes the Chrome Web Store asks for, and the screenshots. The privacy policy linked from the listings
is [PRIVACY.md](https://github.com/firsttris/chrome.sendtokodi/blob/master/PRIVACY.md).
