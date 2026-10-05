# Ngo Duy-Trang (sitingfake) - Portfolio

Static one-page portfolio built with plain HTML, CSS and JavaScript.
It uses GSAP, ScrollTrigger and Lenis, which are already bundled in `js/vendor/`. There is no build step.

## Project structure

```
portfolio/
├── index.html
├── css/        base, components, hero, education, awards, contact
├── js/         main, cursor, hero, awards, contact (+ vendor/)
└── assets/images/   avatar.jpg, avatar-640.jpg
```

## Run locally

Open `index.html` in a browser. For a closer match to production, serve the folder:

```powershell
cd C:\portfolio
python -m http.server 8000
```

Then open http://localhost:8000.

## Deploy to the internet

All options below are free for static sites. The site root is the `portfolio` folder, and no build command is needed.

### Option 1: GitHub Pages

1. Create a GitHub repository, for example `sitingfake.github.io` (a user site) or `portfolio`.
2. Push the code:
   ```powershell
   cd C:\portfolio
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages → Build and deployment**.
   Set Source to **Deploy from a branch**, Branch to `main`, and Folder to `/ (root)`.
4. After about a minute, the site is live at `https://<username>.github.io/<repo>/`.
   A repo named `<username>.github.io` is served at `https://<username>.github.io/`.

### Option 2: Netlify (easiest, drag and drop)

1. Go to https://app.netlify.com/drop.
2. Drag the whole `C:\portfolio` folder onto the page.
3. You get a URL like `https://random-name.netlify.app`. Rename it in **Site settings → Change site name**.
4. To auto-deploy, connect a GitHub repo instead. Leave the build command empty and set the publish directory to `/`.

### Option 3: Vercel

1. Push the code to GitHub (see Option 1).
2. At https://vercel.com/new, import the repo.
3. Set Framework Preset to **Other**. Leave the build command and output directory empty. Click **Deploy**.

### Option 4: Cloudflare Pages

1. Push the code to GitHub.
2. In Cloudflare, go to **Workers & Pages → Create → Pages → Connect to Git**.
3. Leave the build command empty and set the output directory to `/`. Then deploy.

## Custom domain (optional)

1. Buy a domain (Namecheap, Cloudflare, GoDaddy...).
2. Add the domain in your host's settings (GitHub Pages, Netlify, Vercel or Cloudflare).
3. Create the DNS records that the host shows you, usually an `A`/`CNAME` record.
4. Wait for DNS to propagate. HTTPS is enabled automatically.
   On GitHub Pages, tick **Enforce HTTPS**.

## Checklist before going live

- [ ] Check all links: Facebook, personal email, university email.
- [ ] Update the AI Challenge HCM result when it is announced (`index.html`, Awards section).
- [ ] Test on a phone, or use Chrome DevTools device mode (Ctrl+Shift+M).
- [ ] Add a `<meta property="og:image">` pointing to the absolute URL of your avatar, so link previews show an image after you know your domain.
- [ ] After deploy, hard refresh (Ctrl+F5) if you do not see your latest changes.

## Updating content

- Text and awards: edit `index.html`. Each award is an `<article class="card award" data-award>`.
- Colors and fonts: CSS variables at the top of `css/base.css`.
- Avatar: replace `assets/images/avatar.jpg` (1200px wide) and `avatar-640.jpg` (640px wide).

After any change, commit and push, and the host redeploys automatically. On Netlify drag-and-drop, upload the folder again.
