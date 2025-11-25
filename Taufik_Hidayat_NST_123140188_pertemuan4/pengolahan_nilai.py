import os
from tabulate import tabulate

# --- DATA AWAL ---
# List berisi dictionary data mahasiswa (Minimal 5 data sesuai soal)
data_mahasiswa = [
    {"nama": "Andi Saputra", "nim": "123140001", "uts": 85, "uas": 90, "tugas": 88},
    {"nama": "Budi Santoso", "nim": "123140002", "uts": 60, "uas": 55, "tugas": 70},
    {"nama": "Citra Lestari", "nim": "123140003", "uts": 95, "uas": 92, "tugas": 96},
    {"nama": "Dewi Anggraini", "nim": "123140004", "uts": 45, "uas": 50, "tugas": 60},
    {"nama": "Eko Pratama", "nim": "123140005", "uts": 75, "uas": 78, "tugas": 80},
]

# --- FUNGSI LOGIKA ---

def hitung_nilai_akhir(uts, uas, tugas):
    """Menghitung nilai akhir sesuai bobot: 30% UTS + 40% UAS + 30% Tugas"""
    return (0.3 * uts) + (0.4 * uas) + (0.3 * tugas)

def tentukan_grade(nilai_akhir):
    """Menentukan grade huruf berdasarkan nilai akhir"""
    if nilai_akhir >= 80:
        return 'A'
    elif nilai_akhir >= 70:
        return 'B'
    elif nilai_akhir >= 60:
        return 'C'
    elif nilai_akhir >= 50:
        return 'D'
    else:
        return 'E'

def input_validasi_angka(pesan, min_val=0, max_val=100):
    """
    Fungsi helper untuk validasi input angka.
    Memastikan input adalah angka dan berada dalam range tertentu.
    """
    while True:
        try:
            nilai = float(input(pesan))
            if min_val <= nilai <= max_val:
                return nilai
            else:
                print(f"⚠️  Error: Masukkan angka antara {min_val} sampai {max_val}!")
        except ValueError:
            print("⚠️  Error: Input harus berupa angka! Jangan masukkan huruf.")

# --- FUNGSI FITUR UTAMA ---

def tampilkan_data():
    """Menampilkan data dalam bentuk tabel menggunakan library tabulate"""
    if not data_mahasiswa:
        print("\n⚠️  Data mahasiswa kosong.")
        return

    table_data = []
    for mhs in data_mahasiswa:
        na = hitung_nilai_akhir(mhs['uts'], mhs['uas'], mhs['tugas'])
        grade = tentukan_grade(na)
        table_data.append([
            mhs['nama'], 
            mhs['nim'], 
            mhs['uts'], 
            mhs['uas'], 
            mhs['tugas'], 
            f"{na:.2f}", 
            grade
        ])

    headers = ["Nama", "NIM", "UTS", "UAS", "Tugas", "Nilai Akhir", "Grade"]
    print("\n=== DAFTAR NILAI MAHASISWA ===")
    print(tabulate(table_data, headers=headers, tablefmt="fancy_grid"))

def tambah_mahasiswa():
    """Menambahkan data mahasiswa baru dengan input interaktif"""
    print("\n--- Input Data Mahasiswa Baru ---")
    nama = input("Masukkan Nama: ").strip()
    while not nama: # Validasi nama tidak boleh kosong
        print("⚠️  Nama tidak boleh kosong.")
        nama = input("Masukkan Nama: ").strip()
        
    nim = input("Masukkan NIM : ").strip()
    
    # Validasi input nilai agar tidak crash
    uts = input_validasi_angka("Nilai UTS (0-100)  : ")
    uas = input_validasi_angka("Nilai UAS (0-100)  : ")
    tugas = input_validasi_angka("Nilai Tugas (0-100): ")

    mahasiswa_baru = {
        "nama": nama,
        "nim": nim,
        "uts": uts,
        "uas": uas,
        "tugas": tugas
    }
    data_mahasiswa.append(mahasiswa_baru)
    print("✅ Data berhasil ditambahkan!")

def cari_tertinggi_terendah():
    """Mencari mahasiswa dengan nilai akhir tertinggi dan terendah"""
    if not data_mahasiswa:
        print("\n⚠️  Data masih kosong.")
        return

    # Proses pencarian
    tertinggi = None
    terendah = None
    max_val = -1
    min_val = 101

    for mhs in data_mahasiswa:
        na = hitung_nilai_akhir(mhs['uts'], mhs['uas'], mhs['tugas'])
        
        if na > max_val:
            max_val = na
            tertinggi = mhs
        
        if na < min_val:
            min_val = na
            terendah = mhs

    print("\n=== HASIL ANALISIS NILAI ===")
    print(f"🏆 Nilai Tertinggi : {max_val:.2f} oleh {tertinggi['nama']} ({tertinggi['nim']})")
    print(f"📉 Nilai Terendah  : {min_val:.2f} oleh {terendah['nama']} ({terendah['nim']})")

def filter_grade():
    """Menampilkan mahasiswa berdasarkan filter Grade tertentu"""
    target_grade = input("\nMasukkan Grade yang dicari (A/B/C/D/E): ").upper()
    valid_grades = ['A', 'B', 'C', 'D', 'E']
    
    if target_grade not in valid_grades:
        print("⚠️  Grade tidak valid.")
        return

    hasil_filter = []
    for mhs in data_mahasiswa:
        na = hitung_nilai_akhir(mhs['uts'], mhs['uas'], mhs['tugas'])
        if tentukan_grade(na) == target_grade:
            mhs_copy = mhs.copy()
            mhs_copy['na'] = na # Simpan NA untuk ditampilkan
            hasil_filter.append(mhs_copy)

    if hasil_filter:
        table_data = [[m['nama'], m['nim'], f"{m['na']:.2f}"] for m in hasil_filter]
        print(f"\n=== MAHASISWA DENGAN GRADE {target_grade} ===")
        print(tabulate(table_data, headers=["Nama", "NIM", "Nilai Akhir"], tablefmt="simple"))
    else:
        print(f"\n⚠️  Tidak ada mahasiswa dengan grade {target_grade}.")

def hitung_rata_rata_kelas():
    """Menghitung rata-rata nilai akhir seluruh kelas"""
    if not data_mahasiswa:
        print("\n⚠️  Data kosong.")
        return

    total_nilai = 0
    for mhs in data_mahasiswa:
        total_nilai += hitung_nilai_akhir(mhs['uts'], mhs['uas'], mhs['tugas'])
    
    rata_rata = total_nilai / len(data_mahasiswa)
    print(f"\n📊 Rata-rata Nilai Kelas: {rata_rata:.2f}")

# --- MENU UTAMA ---

def main():
    while True:
        print("\n" + "="*40)
        print("   SISTEM PENGELOLAAN NILAI MAHASISWA")
        print("="*40)
        print("1. Tampilkan Semua Data")
        print("2. Tambah Mahasiswa Baru")
        print("3. Cari Nilai Tertinggi & Terendah")
        print("4. Filter Berdasarkan Grade")
        print("5. Hitung Rata-rata Kelas")
        print("6. Keluar")
        
        pilihan = input("\nPilih menu (1-6): ")

        if pilihan == '1':
            tampilkan_data()
        elif pilihan == '2':
            tambah_mahasiswa()
        elif pilihan == '3':
            cari_tertinggi_terendah()
        elif pilihan == '4':
            filter_grade()
        elif pilihan == '5':
            hitung_rata_rata_kelas()
        elif pilihan == '6':
            print("Terima kasih! Program selesai.")
            break
        else:
            print("⚠️  Pilihan tidak valid, silakan coba lagi.")

if __name__ == "__main__":
    # Bersihkan layar terminal saat pertama kali jalan (opsional, biar rapi)
    os.system('cls' if os.name == 'nt' else 'clear')
    main()