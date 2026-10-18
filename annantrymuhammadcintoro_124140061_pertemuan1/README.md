# Mini POS - Kasir & Keranjang Belanja Sederhana

Aplikasi web sederhana untuk simulasi kasir kantin/toko kampus. Dibuat menggunakan **HTML, CSS, dan JavaScript murni (vanilla)** tanpa framework, dengan penyimpanan data keranjang belanja menggunakan **localStorage**.

## Identitas

- **Nama**: Annan Try Muhammad Cintoro
- **NIM**: 124140061
- **Mata Praktikum**: Pemrograman Website
- **Kelas Praktikum**: RA

## Deskripsi Aplikasi

Mini POS adalah aplikasi kasir sederhana untuk membantu simulasi transaksi kantin atau toko kampus. Aplikasi ini dibuat sebagai latihan membangun aplikasi web interaktif menggunakan HTML, CSS, dan JavaScript, termasuk validasi input, perhitungan transaksi, dan penyimpanan data di browser.

Pengguna dapat memasukkan barang ke keranjang, melihat subtotal dan total belanja, menerapkan diskon, lalu menghitung kembalian berdasarkan uang yang dibayarkan.

## Struktur Proyek

```
annantrymuhammadcintoro_124140061_pertemuan1/
├── index.html       # Struktur halaman (form, tabel keranjang, ringkasan)
├── css/
│   └── style.css    # Styling tampilan & layout responsif
├── js/
│   └── app.js       # Seluruh logika aplikasi (validasi, kalkulator, localStorage)
└── README.md
```

## Fitur Utama

Checklist fitur yang sudah diimplementasikan:

- [x] Validasi nama barang wajib diisi dan minimal 3 karakter.
- [x] Validasi harga berupa angka minimal Rp 500 dan jumlah berupa bilangan bulat minimal 1.
- [x] Menampilkan pesan error pada input yang tidak valid; barang hanya ditambahkan jika form valid.
- [x] Menampilkan barang di tabel keranjang, menghitung subtotal per barang, serta menghapus barang dan memperbarui perhitungan.
- [x] Menghitung total belanja dan memberi diskon otomatis 10% jika total mencapai Rp 50.000.
- [x] Menerapkan kode promo `HEMAT10` untuk diskon 10%.
- [x] Menghitung total akhir, kembalian, dan menampilkan kekurangan jika uang bayar belum mencukupi.
- [x] Menyimpan keranjang ke `localStorage` dengan `JSON.stringify()` dan memuatnya kembali dengan `JSON.parse()` saat aplikasi dibuka.
- [x] Mengosongkan keranjang dan data tersimpan melalui tombol **Transaksi Baru / Reset**.

## Tangkapan Layar

### Form input utama

![Tampilan form input utama](Form%20input.png)

### Validasi error

![Tampilan pesan validasi error](Form%20error.png)

### Keranjang dan hasil perhitungan

![Tampilan keranjang, diskon, dan hasil perhitungan pembayaran](Form%20eksekusi.png)

## Cara Menjalankan

Tidak memerlukan instalasi dependency atau server backend.

### Menggunakan browser lokal

1. Buka folder proyek ini.
2. Buka file `index.html` dengan klik dua kali atau pilih browser melalui **Open with**.

### Menggunakan Live Server di VS Code

1. Buka folder proyek ini di VS Code.
2. Pasang ekstensi **Live Server** jika belum tersedia.
3. Buka `index.html`, lalu klik **Go Live** pada status bar atau klik kanan file dan pilih **Open with Live Server**.
4. Aplikasi akan terbuka di browser. Perubahan file dapat dilihat dengan memuat ulang halaman.

## Teknologi

- HTML5 (semantik, form native validation attributes sebagai pelengkap)
- CSS3 (Flexbox & CSS Grid untuk layout responsif)
- JavaScript ES6+ (vanilla, tanpa dependency eksternal)
- Web Storage API (`localStorage`)

## Catatan Implementasi

- Fungsi-fungsi di `js/app.js` dikelompokkan menjadi beberapa bagian dengan komentar penanda: **State & Konstanta**, **Referensi DOM**, **Util/Helper**, **Validasi Form**, **Manajemen Keranjang**, **Kalkulator**, dan **Event Listeners & Inisialisasi** — agar mudah dibaca dan dikembangkan lebih lanjut.
- Nama barang di-escape (`escapeHtml`) sebelum dirender ke tabel untuk mencegah masalah injeksi HTML sederhana.
- Tampilan sudah responsif: pada layar lebar, form/tabel/ringkasan ditampilkan berdampingan (3 kolom); pada layar sempit (mobile), otomatis bertumpuk menjadi 1 kolom.

## Penjelasan Teknis Singkat

- **Validasi input:** saat form dikirim, `handleAddItem()` mengambil nilai input dan memanggil `validateItemForm()`. Fungsi tersebut memeriksa nama, harga, dan jumlah lalu mengembalikan status validasi beserta pesan error. Jika tidak valid, pesan ditampilkan di bawah input yang bermasalah; jika valid, barang dimasukkan ke state keranjang dan tabel dirender ulang.
- **Kalkulator keuangan:** `calculateCartSubtotal()` menjumlahkan hasil perkalian harga dan jumlah setiap barang. `updateCalculations()` menentukan diskon 10% jika total minimal Rp 50.000 atau kode promo `HEMAT10` aktif, kemudian menghitung total akhir. `updatePaymentCalculation()` membandingkan uang bayar dengan total akhir untuk menampilkan kembalian atau nominal kekurangan.
- **LocalStorage:** setelah barang ditambah atau dihapus, `saveCartToStorage()` mengubah state keranjang menjadi string JSON dengan `JSON.stringify()` dan menyimpannya pada key `miniPos_cart`. Saat aplikasi dimulai, `loadCartFromStorage()` membaca key tersebut, mengubahnya kembali menjadi data JavaScript dengan `JSON.parse()`, lalu keranjang dirender. Reset transaksi menghapus key tersebut.
