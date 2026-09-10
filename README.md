# 🕌 Album Darul Hidayah — `album.mdh.or.id`

Portal galeri visual dan dokumentasi resmi kegiatan **Masjid & Yayasan Darul Hidayah** (Titik Nol Tanah Merah, Kabupaten Boven Digoel, Papua Selatan).

---

## 🏛️ Arsitektur Sistem

Aplikasi ini adalah portal publik **Read-Only** (tanpa fitur upload / tanpa autentikasi admin) yang terhubung langsung ke basis data utama **Media Vault**:

- **Database Katalog:** Supabase (Read-Only via Publishable Key `sb_publishable_...` dengan filter `organization_id = 'darul-hidayah'`).
- **Penyimpanan Foto Fisik:** Google Blogger Core CDN (`lh3.googleusercontent.com`).
- **Pengelolaan & Upload:** Dikelola dari dashboard pusat **Media Vault** (`boven-image.vercel.app`).
- **Domain Publik:** `https://album.mdh.or.id`

---

## 🚀 Fitur Unggulan

1. **Ecosystem Navigation:** Terhubung ke ekosistem situs `mdh.or.id`, `news.mdh.or.id`, dan rekening donasi resmi.
2. **Tab Filter Program Dinamis:** Filter instan per kegiatan (*Santunan Anak Yatim*, *TPQ*, *PHBI*, *Pembangunan*, dll).
3. **Pencarian Live:** Cari foto berdasarkan nama file, judul, lokasi, atau tahun.
4. **Bandwidth-Efficient:** Menampilkan thumbnail kartu teroptimasi (`w480-h360`) dan resolusi tinggi saat foto dibuka.
5. **Lightbox Interaktif:** Pratinjau detail, tombol unduh resolusi asli `s0`, dan tombol bagikan langsung ke WhatsApp.
6. **Paginasi Halus:** Memuat 24 foto pertama dengan tombol *Muat Lebih Banyak*.

---

## ⚙️ Menjalankan Lokal

```bash
# 1. Masuk direktori
cd D:\01.APPS\album-mdh

# 2. Install dependensi
npm install

# 3. Jalankan server lokal
npm run dev
```

Buka `http://localhost:3000` di browser Anda.

---

## ☁️ Deployment Vercel (`album.mdh.or.id`)

1. Import repositori `https://github.com/darulhidayah/album.git` ke Vercel.
2. Tambahkan Environment Variable di Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://ruxmomhgycsbhxjpkenv.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: `sb_publishable_jARIHPCX8F2iqjyR-uLfcg_Neqf8_kI`
   - `NEXT_PUBLIC_ORG_ID`: `darul-hidayah`
3. Di tab **Settings ➔ Domains**, hubungkan domain `album.mdh.or.id` (buat CNAME ke `cname.vercel-dns.com` pada DNS manager `mdh.or.id`).
