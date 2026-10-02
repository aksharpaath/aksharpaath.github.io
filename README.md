# अक्षरपाठ: setup

The site is plain static files (no build step). Any free static host works. Supabase (free plan) provides sign-in and the database.

## 1. Database (about 10 minutes)
1. Create a free project at supabase.com.
2. SQL Editor > New query > paste all of `schema.sql` > Run.
3. Authentication > URL Configuration: set **Site URL** to your final site address (step 3 below). Add the same address under Redirect URLs.
4. Project Settings > API: copy the **Project URL** and the **anon public key** into `config.js`. Also put your real UPI ID there.

## 2. Try it locally
Open `index.html` through any local web server (for example `python3 -m http.server`). With empty keys in `config.js` it runs in demo mode with sample issues.

## 3. Free address (GitHub Pages)
1. Create a GitHub account or organization named `aksharpaath` (if the name is free).
2. Create a public repository named `aksharpaath.github.io` and upload these files (`index.html`, `app.js`, `config.js`).
3. Settings > Pages > Deploy from branch `main`, folder `/ (root)`.
4. The site appears at `https://aksharpaath.github.io` within a few minutes.

Cloudflare Pages or Netlify work the same way: connect the repository or drag the folder in, and you get `yourname.pages.dev` or `yourname.netlify.app`.

## 4. Make yourself editor
Open the site, go to "रचना भेजें", sign in with your email, then run the last statement in `schema.sql` (the commented one) with your email. Reload: you will see "संपादक पटल".

## 5. Publish the first issue
In "संपादक पटल": create the issue (volume, ank, month, theme), open a submission, choose the issue and press "प्रकाशित करें", then press "जारी करें" on the issue. It appears on the public pages, with PDF download.

## How the rules work
- Anyone can read live issues. Nobody but the editor can see contact details or payment numbers.
- Authors sign in by email link, submit, and edit only while the piece is in review.
- The database refuses author edits once a piece is published. Only editors can edit or withdraw it.
- Payment: authors pay by UPI and enter the 12-digit transaction number. The editor checks it in the bank app before publishing. Automatic verification needs a payment gateway account (for example Razorpay) and a small server function; add it later.

## Before real launch
- Supabase's built-in email sender has a low hourly limit. For real traffic, add your own SMTP (Authentication > SMTP).
- Free Supabase projects can pause when unused. Check the current plan terms.
- Decide your refund policy and add it to the submission page.

## Updating the site later
On GitHub open the repository, **Add file > Upload files**, drag in the new `index.html` and `app.js`, then **Commit changes**. Wait a minute and reload the site with Ctrl+F5.

## No word limit
Articles can be any length. Long articles continue over as many magazine pages as they need. If your database was created from an older `schema.sql`, run this once in the Supabase SQL Editor:

    alter table public.articles drop constraint if exists articles_body_check;
    alter table public.articles add constraint articles_body_len check (char_length(body) between 1 and 1000000);
