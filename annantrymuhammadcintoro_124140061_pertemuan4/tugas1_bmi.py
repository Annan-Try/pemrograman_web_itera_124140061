# ===================================================
# Berkas: tugas1_bmi.py
# Deskripsi: Program penghitung BMI (Body Mass Index) sederhana.
# ===================================================


def hitung_bmi(berat: float, tinggi: float) -> float:
    """
    Menghitung nilai BMI berdasarkan berat dan tinggi badan.

    Parameter:
        berat (float): berat badan dalam kilogram (kg).
        tinggi (float): tinggi badan dalam meter (m).

    Return:
        float: nilai BMI hasil perhitungan (berat / tinggi^2).
    """
    return berat / (tinggi ** 2)


def kategori_bmi(bmi: float) -> str:
    """
    Menentukan kategori status berat badan berdasarkan nilai BMI.

    Parameter:
        bmi (float): nilai BMI yang telah dihitung.

    Return:
        str: kategori status berat badan
             ("Berat badan kurang", "Berat badan normal",
             "Berat badan berlebih", atau "Obesitas").
    """
    if bmi < 18.5:
        return "Berat badan kurang"
    elif bmi < 25:
        return "Berat badan normal"
    elif bmi < 30:
        return "Berat badan berlebih"
    else:
        return "Obesitas"


def main():
    """Menjalankan alur utama program penghitung BMI secara interaktif."""
    print("=== PROGRAM PENGHITUNG BMI (BODY MASS INDEX) ===\n")

    try:
        berat_badan = float(input("Masukkan berat badan (kg): "))
        tinggi_badan = float(input("Masukkan tinggi badan (m): "))
    except ValueError:
        print("\nInput tidak valid! Harap masukkan angka (contoh: 65 atau 1.7).")
        return

    if berat_badan <= 0 or tinggi_badan <= 0:
        print("\nBerat badan dan tinggi badan harus bernilai positif!")
        return

    bmi = hitung_bmi(berat_badan, tinggi_badan)
    status = kategori_bmi(bmi)

    print("\n--- HASIL PERHITUNGAN BMI ---")
    print(f"Berat Badan      : {berat_badan:.2f} kg")
    print(f"Tinggi Badan     : {tinggi_badan:.2f} m")
    print(f"Nilai BMI        : {bmi:.2f}")
    print(f"Kategori Status  : {status}")


if __name__ == "__main__":
    main()
