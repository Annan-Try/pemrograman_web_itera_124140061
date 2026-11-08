# ===================================================
# Berkas: main.py
# Deskripsi: Program utama untuk menguji seluruh fungsi pada modul
#            math_operations.py menggunakan dua cara impor berbeda.
# ===================================================

# Cara 1: Mengimpor seluruh modul
import math_operations

# Cara 2: Mengimpor fungsi dan konstanta spesifik langsung ke namespace
from math_operations import celsius_ke_fahrenheit, celsius_ke_kelvin, PI


def main():
    """Menjalankan serangkaian pengujian terhadap modul math_operations."""
    print("=== PENGUJIAN MODUL MATH_OPERATIONS ===\n")
    print(f"Konstanta PI yang digunakan: {PI}\n")

    print("--- 1. PERSEGI ---")
    sisi = 6
    print(f"Sisi             : {sisi}")
    print(f"Luas             : {math_operations.luas_persegi(sisi):.2f}")
    print(f"Keliling         : {math_operations.keliling_persegi(sisi):.2f}")

    print("\n--- 2. PERSEGI PANJANG ---")
    panjang, lebar = 10, 4
    print(f"Panjang x Lebar  : {panjang} x {lebar}")
    print(f"Luas             : {math_operations.luas_persegi_panjang(panjang, lebar):.2f}")
    print(f"Keliling         : {math_operations.keliling_persegi_panjang(panjang, lebar):.2f}")

    print("\n--- 3. LINGKARAN ---")
    jari_jari = 7
    print(f"Jari-jari        : {jari_jari}")
    print(f"Luas             : {math_operations.luas_lingkaran(jari_jari):.2f}")
    print(f"Keliling         : {math_operations.keliling_lingkaran(jari_jari):.2f}")

    print("\n--- 4. KONVERSI SUHU ---")
    daftar_suhu_celsius = [0, 25, 37, 100]
    for suhu in daftar_suhu_celsius:
        fahrenheit = celsius_ke_fahrenheit(suhu)
        kelvin = celsius_ke_kelvin(suhu)
        print(f"{suhu:>3} C  ->  {fahrenheit:>7.2f} F  |  {kelvin:>7.2f} K")


if __name__ == "__main__":
    main()
