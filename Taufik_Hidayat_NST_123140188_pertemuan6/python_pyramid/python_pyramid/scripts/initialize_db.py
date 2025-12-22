import argparse
import sys

from pyramid.paster import bootstrap, setup_logging
from sqlalchemy.exc import OperationalError

from ..models import Base, Course, get_engine, get_session_factory

def setup_models(dbsession):
    """
    Fungsi ini menambahkan data awal (Seed Data) ke database.
    """
    # Cek apakah tabel kosong? Jika ya, tambahkan data dummy.
    # Ini untuk mencegah error "Unique Constraint" jika script dijalankan 2x.
    if dbsession.query(Course).count() == 0:
        model1 = Course(
            kode="IF3001", 
            nama="Pemrograman Web", 
            sks=3, 
            deskripsi="Matakuliah Pengembangan Web Lanjut dengan Pyramid"
        )
        model2 = Course(
            kode="IF3002", 
            nama="Basis Data", 
            sks=4, 
            deskripsi="Perancangan dan Implementasi Database PostgreSQL"
        )
        dbsession.add(model1)
        dbsession.add(model2)
        print("Data awal (Seeding) berhasil ditambahkan.")
    else:
        print("Data sudah ada, skip seeding.")

def parse_args(argv):
    parser = argparse.ArgumentParser()
    parser.add_argument(
        'config_uri',
        help='Configuration file, e.g., development.ini',
    )
    return parser.parse_args(argv[1:])

def main(argv=sys.argv):
    args = parse_args(argv)
    setup_logging(args.config_uri)
    
    # Load environment Pyramid
    env = bootstrap(args.config_uri)

    try:
        with env['request'].tm:
            dbsession = env['request'].dbsession
            engine = dbsession.bind
            
            # STEP PENTING: Membuat tabel berdasarkan Class Model
            print("Sedang membuat tabel di database NeonDB...")
            Base.metadata.create_all(engine)
            
            # Masukkan data awal
            setup_models(dbsession)
            
            print("Sukses! Database berhasil diinisialisasi.")
            
    except OperationalError as e:
        print("ERROR: Gagal terhubung ke database. Cek koneksi internet atau URL database di development.ini")
        print(e)
    except Exception as e:
        print(f"Terjadi kesalahan: {e}")

if __name__ == '__main__':
    main()