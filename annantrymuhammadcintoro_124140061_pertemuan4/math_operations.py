# ===================================================
# Berkas: math_operations.py
# Deskripsi: Modul kustom berisi fungsi-fungsi perhitungan geometri
#            (persegi, persegi panjang, lingkaran) dan konversi suhu.
# ===================================================

# Konstanta nilai PI yang digunakan pada perhitungan lingkaran
PI = 3.14159


def luas_persegi(sisi: float) -> float:
    """
    Menghitung luas persegi.

    Parameter:
        sisi (float): panjang sisi persegi.

    Return:
        float: luas persegi (sisi^2).
    """
    return sisi ** 2


def keliling_persegi(sisi: float) -> float:
    """
    Menghitung keliling persegi.

    Parameter:
        sisi (float): panjang sisi persegi.

    Return:
        float: keliling persegi (4 * sisi).
    """
    return 4 * sisi


def luas_persegi_panjang(panjang: float, lebar: float) -> float:
    """
    Menghitung luas persegi panjang.

    Parameter:
        panjang (float): panjang sisi persegi panjang.
        lebar (float): lebar sisi persegi panjang.

    Return:
        float: luas persegi panjang (panjang * lebar).
    """
    return panjang * lebar


def keliling_persegi_panjang(panjang: float, lebar: float) -> float:
    """
    Menghitung keliling persegi panjang.

    Parameter:
        panjang (float): panjang sisi persegi panjang.
        lebar (float): lebar sisi persegi panjang.

    Return:
        float: keliling persegi panjang (2 * (panjang + lebar)).
    """
    return 2 * (panjang + lebar)


def luas_lingkaran(jari_jari: float) -> float:
    """
    Menghitung luas lingkaran.

    Parameter:
        jari_jari (float): panjang jari-jari lingkaran.

    Return:
        float: luas lingkaran (PI * jari_jari^2).
    """
    return PI * jari_jari ** 2


def keliling_lingkaran(jari_jari: float) -> float:
    """
    Menghitung keliling lingkaran.

    Parameter:
        jari_jari (float): panjang jari-jari lingkaran.

    Return:
        float: keliling lingkaran (2 * PI * jari_jari).
    """
    return 2 * PI * jari_jari


def celsius_ke_fahrenheit(celsius: float) -> float:
    """
    Mengonversi suhu dari derajat Celsius ke Fahrenheit.

    Parameter:
        celsius (float): suhu dalam derajat Celsius.

    Return:
        float: suhu dalam derajat Fahrenheit.
    """
    return celsius * 9 / 5 + 32


def celsius_ke_kelvin(celsius: float) -> float:
    """
    Mengonversi suhu dari derajat Celsius ke Kelvin.

    Parameter:
        celsius (float): suhu dalam derajat Celsius.

    Return:
        float: suhu dalam Kelvin.
    """
    return celsius + 273.15


# Blok idiom sakti untuk testing mandiri modul tanpa mengganggu program
# yang mengimpor modul ini
if __name__ == "__main__":
    print("[TEST MODUL] Menjalankan uji coba internal math_operations:")
    print("Luas persegi sisi 5         :", luas_persegi(5))
    print("Luas lingkaran jari-jari 7  :", luas_lingkaran(7))
    print("30 C ke Fahrenheit          :", celsius_ke_fahrenheit(30))
