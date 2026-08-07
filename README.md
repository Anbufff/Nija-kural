# NIJA KURAL — Video Screenshot PWA

Offline-ஆக வேலை செய்யும் Progressive Web App (PWA). Layout / Design முற்றிலும் மாற்றப்படவில்லை — PWA ஆதரவுக்கான files மட்டும் சேர்க்கப்பட்டுள்ளன.

## Files
```
index.html      → அசல் app (layout/UI மாற்றப்படவில்லை; manifest link + SW register மட்டும் சேர்க்கப்பட்டது)
manifest.json   → PWA manifest (name, icons, theme colors)
sw.js           → Service worker — app shell-ஐ cache செய்து offline வேலை செய்ய வைக்கிறது
icons/
  icon-192.png
  icon-512.png
```

## GitHub Pages-ல் Deploy செய்வது எப்படி

1. புதிய GitHub repository உருவாக்கவும் (எ.கா. `nija-kural`).
2. இந்த 5 files/folders-ஐ (`index.html`, `manifest.json`, `sw.js`, `icons/`) repo-வின் root-ல் upload செய்யவும்.
3. Repo → **Settings → Pages** க்குச் செல்லவும்.
4. "Build and deployment" கீழ் **Source: Deploy from a branch** தேர்வு செய்யவும்.
5. Branch: `main`, Folder: `/ (root)` → **Save**.
6. சில நிமிடங்களில் உங்கள் app இந்த முகவரியில் live ஆகிவிடும்:
   `https://<your-username>.github.io/nija-kural/`

## Offline / "Install App" எப்படி வேலை செய்கிறது

- முதல் முறை Chrome/Edge-ல் மேலே உள்ள URL-ஐ திறக்கும்போது, browser "Add to Home Screen" / install ஐகான் காட்டும் — அதை தட்டினால் app native app போல் ஹோம் ஸ்கிரீனில் install ஆகும்.
- ஒருமுறை திறந்த பிறகு, `sw.js` (service worker) app-shell முழுவதையும் (HTML, manifest, icons, fonts) cache செய்துவிடும்.
- அதன்பின் Internet இல்லாமலும் app திறந்து, வீடியோ தேர்வு செய்து screenshot எடுக்க முடியும் (வீடியோ கோப்புகள் உங்கள் device-லிருந்தே load ஆகும், Internet தேவையில்லை).
- புதிய version deploy செய்யும்போது `sw.js`-ல் உள்ள `CACHE_VERSION` (எ.கா. `nija-kural-v1` → `nija-kural-v2`) மாற்றினால், பழைய cache தானாக அழிந்து புதிய files load ஆகும்.

## முக்கிய குறிப்பு
- **App-ன் Layout, Design, UI structure எதுவும் மாற்றப்படவில்லை.** `index.html`-ல் `<head>`-ல் PWA meta/link tags-ம், `</body>`-க்கு முன் ஒரு தனி service-worker registration script-ம் மட்டுமே **சேர்க்கப்பட்டுள்ளது** — existing CSS/HTML/JS logic எதுவும் எடிட் செய்யப்படவில்லை.
- Icons (`icon-192.png`, `icon-512.png`) app-ன் branding நிறங்களில் (navy + gold) தயாரிக்கப்பட்ட simplified "NK" emblem. விரும்பினால் உங்கள் சொந்த லோகோ image-ஆல் replace செய்யலாம் (அதே பெயர்/அளவுகளில்).
