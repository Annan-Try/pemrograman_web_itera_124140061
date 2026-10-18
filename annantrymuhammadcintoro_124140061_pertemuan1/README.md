# Mini POS - Kasir & Keranjang Belanja Sederhana

Aplikasi web sederhana untuk simulasi kasir kantin/toko kampus. Dibuat menggunakan **HTML, CSS, dan JavaScript murni (vanilla)** tanpa framework, dengan penyimpanan data keranjang belanja menggunakan **localStorage**.

## Struktur Proyek

```
Praktikum PAW/
├── index.html        # Struktur halaman (form, tabel keranjang, ringkasan)
├── css/
│   └── style.css     # Styling tampilan & layout responsif
├── js/
│   └── app.js         # Seluruh logika aplikasi (validasi, kalkulator, localStorage)
└── README.md
```

## Fitur Utama

### 1. Validasi Form Input Barang
- **Nama Barang**: wajib diisi, minimal 3 karakter.
- **Harga Satuan**: wajib angka positif, minimal Rp 500.
- **Jumlah/Qty**: wajib angka bulat, minimal 1.
- Pesan error ditampilkan berwarna merah tepat di bawah input yang salah.
- Jika semua input valid, barang ditambahkan ke keranjang dan form otomatis di-reset.

### 2. Kalkulator & Perhitungan Otomatis
- **Subtotal per item** = Harga Satuan × Qty, dihitung otomatis setiap baris.
- **Total Belanja** = akumulasi seluruh subtotal pada keranjang.
- **Diskon otomatis 10%** diberikan jika total belanja mencapai minimal Rp 50.000.
- **Kode promo** `HEMAT10` juga dapat dimasukkan secara manual untuk mendapatkan diskon 10% (berguna jika total belanja belum mencapai batas otomatis).
- **Total Akhir** = Total Belanja − Diskon.
- **Kalkulator Pembayaran**: input "Uang Bayar" akan otomatis menghitung kembalian (`Kembalian = Uang Bayar − Total Akhir`). Jika uang yang dibayarkan kurang, sistem menampilkan keterangan nominal kekurangannya.

### 3. Manajemen Keranjang & LocalStorage
- Barang yang ditambahkan langsung tampil pada tabel keranjang (No, Nama Barang, Harga Satuan, Qty, Subtotal, Aksi).
- Tombol **Hapus** pada setiap baris akan menghapus item tersebut, lalu total & diskon dihitung ulang secara otomatis.
- Data keranjang disimpan ke `localStorage` menggunakan `JSON.stringify()` setiap kali terjadi perubahan (tambah/hapus), dan dimuat kembali menggunakan `JSON.parse()` saat halaman dibuka/di-refresh — sehingga isi keranjang tidak hilang.
- Tombol **Transaksi Baru / Reset** akan mengosongkan seluruh keranjang beserta `localStorage`, serta mereset kolom promo dan pembayaran.

## Cara Menjalankan

Tidak memerlukan instalasi atau server khusus:

1. Buka file `index.html` langsung di browser (double click), **atau**
2. Jalankan melalui Live Server (ekstensi VS Code) untuk pengalaman reload otomatis saat development.

## Teknologi

- HTML5 (semantik, form native validation attributes sebagai pelengkap)
- CSS3 (Flexbox & CSS Grid untuk layout responsif)
- JavaScript ES6+ (vanilla, tanpa dependency eksternal)
- Web Storage API (`localStorage`)

## Catatan Implementasi

- Fungsi-fungsi di `js/app.js` dikelompokkan menjadi beberapa bagian dengan komentar penanda: **State & Konstanta**, **Referensi DOM**, **Util/Helper**, **Validasi Form**, **Manajemen Keranjang**, **Kalkulator**, dan **Event Listeners & Inisialisasi** — agar mudah dibaca dan dikembangkan lebih lanjut.
- Nama barang di-escape (`escapeHtml`) sebelum dirender ke tabel untuk mencegah masalah injeksi HTML sederhana.
- Tampilan sudah responsif: pada layar lebar, form/tabel/ringkasan ditampilkan berdampingan (3 kolom); pada layar sempit (mobile), otomatis bertumpuk menjadi 1 kolom.
