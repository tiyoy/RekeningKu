# RekeningKu — Project Instructions

## Overview
RekeningKu is a public directory of bank accounts, e-wallet destinations, and QRIS payment methods with an admin dashboard.

## Current stack (authoritative)
- Next.js App Router + React + TypeScript
- Cloud Firestore for application records and admin records
- Cloudinary for QRIS images (signed server-side upload and deletion)
- Firebase Admin SDK for privileged server-side Firestore access only
- Original custom CSS preserved from the PHP version

Do not reintroduce PHP, SQLite, Firebase Storage, or browser-side privileged Firebase access.

## Functional requirements
- Public page: show only active accounts, ordered by `sortOrder`.
- Public interactions: category filtering, copy account number, QRIS modal, NMID copy, QRIS download and zoom.
- Admin: username/password login at `/admin`, dashboard summary, account CRUD, category selection, active/inactive toggle, ordering, QRIS upload, live card preview, and password change.
- Admin pages and API routes must require a valid signed admin session.
- Passwords must be hashed with bcrypt. Never store plaintext passwords.
- Firebase service credentials and Cloudinary API secret must stay server-side and must never use `NEXT_PUBLIC_` variables.
- Validate QRIS upload type and enforce a 5 MB maximum.

## Design constraints
- Preserve `app/styles/style.css` and `app/styles/admin.css` unless a small compatibility fix is needed.
- Reuse existing visual classes and responsive patterns.
- Do not redesign the public page or admin dashboard unless explicitly requested.
