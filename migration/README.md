# Data migrasi

- `legacy-accounts.json` berisi delapan data rekening hasil ekspor SQLite proyek sebelumnya.
- `legacy-admins.json` berisi hash bcrypt akun administrator lama agar kredensial dapat dipertahankan saat dipindahkan ke Firestore. File ini tidak berisi password teks biasa.

Jalankan `npm run migrate:firebase` untuk data rekening, lalu `npm run seed:admin` untuk akun admin.
