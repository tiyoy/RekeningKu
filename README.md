# RekeningKu — Next.js Fullstack + Firebase Spark + Cloudinary

RekeningKu adalah direktori pembayaran digital untuk menampilkan rekening bank, e-wallet, dan QRIS. Proyek ini menggunakan Next.js fullstack, Cloud Firestore sebagai database, dan Cloudinary untuk gambar QRIS. **Firebase Storage tidak digunakan**, sehingga proyek tetap dapat memakai Firebase Spark Plan.

Desain publik, CSS asli, dashboard admin, dan alur fungsi dari proyek sebelumnya dipertahankan.

## Teknologi

| Bagian | Teknologi |
|---|---|
| Fullstack framework | Next.js App Router |
| UI | React + TypeScript |
| Styling | CSS asli RekeningKu |
| Database | Firebase Cloud Firestore (Spark) |
| File QRIS | Cloudinary |
| Server integration | Firebase Admin SDK + Cloudinary REST API |
| Password admin | bcryptjs |
| Admin session | Signed JWT, cookie HttpOnly + SameSite Strict |
| Hosting | Vercel atau Node.js server |

## Fitur yang dipertahankan

### Halaman publik
- Kartu rekening bergaya kartu ATM dengan enam tema gradien.
- Filter Bank, E-Wallet, QRIS, dan Semua.
- Salin nomor rekening ke clipboard tanpa reload.
- Modal QRIS, zoom gambar, salin NMID, dan unduh barcode.
- Hanya rekening berstatus aktif yang ditampilkan.

### Dashboard admin
- Login admin melalui `/admin`.
- Ringkasan total rekening, rekening aktif, dan nonaktif.
- Tambah, edit, dan hapus rekening.
- Kategori rekening bank, e-wallet, dan QRIS.
- Upload gambar QRIS ke Cloudinary (maksimal 5 MB; JPG, PNG, WebP).
- Hapus gambar QRIS lama saat gambar diganti, dihapus, atau rekening dihapus.
- Live preview kartu dan pemilihan tema.
- Ubah status tampil/sembunyi.
- Atur urutan dengan tombol naik/turun.
- Ganti password administrator.
- Tampilan tabel desktop dan daftar kartu mobile.

## 1. Persiapan Firebase Spark

1. Buat project di [Firebase Console](https://console.firebase.google.com/).
2. Aktifkan **Cloud Firestore** dalam Native mode pada Spark Plan.
3. Buka **Project settings → Service accounts → Generate new private key**.
4. Ambil `project_id`, `client_email`, dan `private_key` dari file JSON service account.
5. Jangan mengaktifkan Firebase Storage. Aplikasi ini tidak membutuhkan bucket Firebase Storage.
6. Deploy `firestore.rules` bila Anda mengelola rules melalui Firebase CLI. Semua akses aplikasi ke Firestore dilakukan dari server melalui Firebase Admin SDK.

Service account hanya digunakan server untuk Firestore. Jangan commit file JSON service account atau private key ke GitHub.

## 2. Persiapan Cloudinary

1. Buat akun di [Cloudinary](https://cloudinary.com/).
2. Buka **Dashboard** Cloudinary.
3. Salin nilai **Cloud name**, **API Key**, dan **API Secret**.
4. Simpan ketiganya sebagai environment variable server-side. Jangan pernah menambahkan prefix `NEXT_PUBLIC_` pada API Secret.

Cloudinary dipakai untuk upload, penyimpanan, CDN, dan penghapusan gambar QRIS. Aplikasi menggunakan signed upload dari API Next.js, jadi kredensial rahasia tidak dikirim ke browser. Periksa batas penggunaan dan kuota pada dashboard Cloudinary sesuai paket akun Anda.

## 3. Instalasi lokal

Gunakan Node.js 20.9+ (Node.js 22 direkomendasikan).

```bash
npm install
cp .env.example .env.local
```

Isi `.env.local`:

```env
# Firebase Admin SDK — Cloud Firestore saja
FIREBASE_PROJECT_ID=project-id-anda
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@project-id-anda.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nISI_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"

# Cloudinary — penyimpanan QRIS
CLOUDINARY_CLOUD_NAME=nama-cloud-anda
CLOUDINARY_API_KEY=api-key-anda
CLOUDINARY_API_SECRET=api-secret-anda

# Minimal 32 karakter acak
ADMIN_SESSION_SECRET=buat-random-secret-minimal-32-karakter

# Digunakan hanya bila tidak ada admin lama yang bisa diimpor
ADMIN_INITIAL_USERNAME=admin
ADMIN_INITIAL_PASSWORD=admin123
```

`FIREBASE_PRIVATE_KEY` harus berasal dari service account Firebase. Line break dapat disimpan sebagai `\n` dalam satu baris environment variable. Simpan `.env.local` secara lokal dan jangan commit ke repository.

## 4. Migrasi data SQLite lama

Data 8 rekening dari database SQLite proyek sebelumnya sudah diekspor ke `migration/legacy-accounts.json`. Hash bcrypt administrator lama tersedia sementara di `migration/legacy-admins.json` (tanpa password teks biasa). Kedua file migrasi dikecualikan dari Git melalui `.gitignore`.

Pastikan `.env.local` sudah berisi kredensial Firestore dan Cloudinary, lalu jalankan:

```bash
npm run migrate:firebase
```

Script akan:
- Membuat atau memperbarui dokumen Firestore pada koleksi `accounts` menggunakan ID lama.
- Mempertahankan nama bank, nomor rekening, pemilik, kategori, label, tema, catatan, urutan, dan status aktif.
- Mengunggah gambar QRIS lama yang tersedia di `public/assets/images/qris/` ke Cloudinary.
- Menyimpan `qrisImageUrl` dan `qrisPublicId` pada dokumen Firestore.
- Mengosongkan field lokasi Firebase Storage lama bila ada.

Script dapat dijalankan ulang. ID rekening dan public ID gambar legacy dibuat stabil sehingga impor tidak membuat rekening duplikat. Setelah memeriksa hasil migrasi, hapus `migration/legacy-accounts.json` dan `migration/legacy-admins.json` dari komputer lokal.

## 5. Buat akun admin

```bash
npm run seed:admin
```

Script akan lebih dulu mengimpor hash bcrypt akun administrator PHP lama. Username dan password lama tetap digunakan. Hash PHP `$2y$` dinormalisasi ke varian bcrypt yang kompatibel; password tidak disimpan dalam bentuk teks biasa.

Bila file migrasi admin tidak tersedia atau tidak berisi akun, script membuat akun awal dari `ADMIN_INITIAL_USERNAME` dan `ADMIN_INITIAL_PASSWORD`. Ganti password awal dari menu **Setting** setelah login.

## 6. Jalankan aplikasi

```bash
npm run dev
```

- Halaman publik: `http://localhost:3000/`
- Login admin: `http://localhost:3000/admin`
- Dashboard: `http://localhost:3000/admin/dashboard`

Validasi kode:

```bash
npm run typecheck
npm run lint
npm run build
```

## 7. Deploy ke Vercel

1. Push project ke repository GitHub.
2. Import repository ke Vercel.
3. Tambahkan seluruh variable berikut pada **Project Settings → Environment Variables** untuk environment yang dipakai:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `ADMIN_SESSION_SECRET`
   - `ADMIN_INITIAL_USERNAME` dan `ADMIN_INITIAL_PASSWORD` hanya sebagai fallback awal.
4. Deploy aplikasi.
5. Jalankan `npm run migrate:firebase` dan `npm run seed:admin` sekali dari komputer lokal atau environment administrasi tepercaya yang memiliki `.env.local` dengan project Firebase dan Cloudinary yang benar.
6. Buka `/admin`, login, lalu ganti password awal bila menggunakan akun fallback.

**Tidak ada environment variable `FIREBASE_STORAGE_BUCKET` dan tidak perlu mengaktifkan Firebase Storage.** Jangan upload `.env.local`, private key, Cloudinary API Secret, atau service-account JSON ke GitHub.

## Struktur proyek

```text
app/
  admin/
    page.tsx                    # Login admin
    dashboard/page.tsx          # Ringkasan admin
    rekening/page.tsx           # Pengelolaan rekening
    tambah/page.tsx             # Tambah rekening
    rekening/[id]/edit/page.tsx # Edit rekening
    settings/page.tsx           # Ganti password
  api/admin/                    # Route handlers dashboard admin
  api/qris/[id]/download/       # Endpoint unduh barcode QRIS
  page.tsx                      # Landing page publik
  layout.tsx
  styles/                       # CSS asli proyek
components/                     # Komponen UI dan interaksi
lib/                            # Firebase, Cloudinary, session, helpers
migration/                      # Data ekspor SQLite untuk migrasi satu kali
public/assets/images/qris/      # Aset gambar QRIS lama
scripts/                        # Seed admin dan migrasi data
firestore.rules
```

## Struktur data Firestore

**`accounts/{accountId}`**

`bankName`, `accountNumber`, `accountName`, `category`, `qrisImageUrl`, `qrisPublicId`, `label`, `icon`, `cardTheme`, `notes`, `sortOrder`, `isActive`, `createdAt`, `updatedAt`.

**`admins/{adminId}`**

`username`, `passwordHash`, `createdAt`, `updatedAt`.

Password disimpan menggunakan bcrypt. Session admin berada di cookie `HttpOnly`, `Secure` pada production, dan `SameSite=Strict`. Route admin memvalidasi session sebelum perubahan data.

## Catatan keamanan dan operasional

- Firebase Admin SDK berjalan di server; tidak ada akses Firestore privileged langsung dari browser.
- Seluruh upload dan penghapusan QRIS dilakukan melalui API Next.js setelah verifikasi sesi admin.
- Cloudinary API Secret dan Firebase private key tidak boleh menggunakan variable `NEXT_PUBLIC_`.
- Ukuran gambar dibatasi 5 MB dan tipe file yang diterima hanya JPG, PNG, atau WebP.
- Endpoint unduh QRIS memvalidasi domain Cloudinary sebelum mengambil gambar.
- CSS halaman publik dan admin dari proyek lama dipertahankan; aplikasi tidak dirancang ulang.
- SQLite hanya menjadi sumber migrasi awal dan tidak digunakan saat aplikasi berjalan.
