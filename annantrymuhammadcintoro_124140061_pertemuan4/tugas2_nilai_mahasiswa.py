# ===================================================
# Berkas: tugas2_nilai_mahasiswa.py
# Deskripsi: Program pengelolaan data nilai mahasiswa (UTS, UAS, Tugas)
#            beserta perhitungan nilai akhir dan penentuan grade.
# ===================================================


def hitung_nilai_akhir(uts: float, uas: float, tugas: float) -> float:
    """
    Menghitung nilai akhir mahasiswa berdasarkan bobot persentase.

    Parameter:
        uts (float): nilai ujian tengah semester.
        uas (float): nilai ujian akhir semester.
        tugas (float): nilai tugas.

    Return:
        float: nilai akhir (30% UTS + 40% UAS + 30% Tugas).
    """
    return 0.3 * uts + 0.4 * uas + 0.3 * tugas


def tentukan_grade(nilai_akhir: float) -> str:
    """
    Menentukan grade huruf berdasarkan nilai akhir mahasiswa.

    Parameter:
        nilai_akhir (float): nilai akhir hasil perhitungan.

    Return:
        str: grade huruf ("A", "B", "C", "D", atau "E").
    """
    if nilai_akhir >= 80:
        return "A"
    elif nilai_akhir >= 70:
        return "B"
    elif nilai_akhir >= 60:
        return "C"
    elif nilai_akhir >= 50:
        return "D"
    else:
        return "E"


def main():
    """Mengelola, menampilkan, dan menganalisis data nilai mahasiswa."""
    daftar_mahasiswa = [
        {"nama": "Ahmad Fadhilah", "nim": "124140001", "nilai_uts": 85, "nilai_uas": 90, "nilai_tugas": 88},
        {"nama": "Budi Santoso", "nim": "124140002", "nilai_uts": 70, "nilai_uas": 65, "nilai_tugas": 75},
        {"nama": "Siti Aminah", "nim": "124140003", "nilai_uts": 55, "nilai_uas": 60, "nilai_tugas": 58},
        {"nama": "Dewi Lestari", "nim": "124140004", "nilai_uts": 95, "nilai_uas": 92, "nilai_tugas": 97},
        {"nama": "Andi Wijaya", "nim": "124140005", "nilai_uts": 40, "nilai_uas": 35, "nilai_tugas": 45},
    ]

    # Menghitung nilai akhir dan grade untuk setiap mahasiswa
    for mhs in daftar_mahasiswa:
        nilai_akhir = hitung_nilai_akhir(
            mhs["nilai_uts"], mhs["nilai_uas"], mhs["nilai_tugas"]
        )
        mhs["nilai_akhir"] = nilai_akhir
        mhs["grade"] = tentukan_grade(nilai_akhir)

    # Menampilkan data dalam format tabel rapi
    print("=== DATA NILAI AKHIR MAHASISWA ===\n")
    header = f"{'NIM':<12} {'Nama':<20} {'Nilai Akhir':>12} {'Grade':>6}"
    print(header)
    print("-" * len(header))
    for mhs in daftar_mahasiswa:
        print(
            f"{mhs['nim']:<12} {mhs['nama']:<20} "
            f"{mhs['nilai_akhir']:>12.2f} {mhs['grade']:>6}"
        )

    # Mencari mahasiswa dengan nilai akhir tertinggi dan terendah
    mahasiswa_tertinggi = max(daftar_mahasiswa, key=lambda m: m["nilai_akhir"])
    mahasiswa_terendah = min(daftar_mahasiswa, key=lambda m: m["nilai_akhir"])

    print("\n--- NILAI TERTINGGI ---")
    print(f"Nama  : {mahasiswa_tertinggi['nama']}")
    print(f"NIM   : {mahasiswa_tertinggi['nim']}")
    print(f"Nilai : {mahasiswa_tertinggi['nilai_akhir']:.2f} (Grade {mahasiswa_tertinggi['grade']})")

    print("\n--- NILAI TERENDAH ---")
    print(f"Nama  : {mahasiswa_terendah['nama']}")
    print(f"NIM   : {mahasiswa_terendah['nim']}")
    print(f"Nilai : {mahasiswa_terendah['nilai_akhir']:.2f} (Grade {mahasiswa_terendah['grade']})")


if __name__ == "__main__":
    main()
