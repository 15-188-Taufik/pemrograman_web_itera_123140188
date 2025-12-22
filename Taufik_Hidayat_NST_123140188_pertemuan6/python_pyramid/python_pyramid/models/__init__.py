from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import configure_mappers
import zope.sqlalchemy

# Import Base dan Model yang baru saja kita buat
from .meta import Base
from .course import Course  # Pastikan Course di-import di sini!

# Konfigurasi mapper relasi (jika ada)
configure_mappers()

def get_engine(settings, prefix='sqlalchemy.'):
    return engine_from_config(settings, prefix)

def get_session_factory(engine):
    factory = sessionmaker()
    factory.configure(bind=engine)
    return factory

def get_tm_session(session_factory, transaction_manager):
    """
    Mengambil session database yang terikat dengan transaction manager Pyramid.
    """
    dbsession = session_factory()
    zope.sqlalchemy.register(dbsession, transaction_manager=transaction_manager)
    return dbsession

def includeme(config):
    """
    Fungsi ini dipanggil saat aplikasi start untuk setup database.
    """
    settings = config.get_settings()
    settings['tm.manager_hook'] = 'pyramid_tm.explicit_manager'

    # Gunakan pyramid_tm untuk mengatur transaksi
    config.include('pyramid_tm')

    dbsession_factory = get_session_factory(
        get_engine(settings)
    )

    config.registry['dbsession_factory'] = dbsession_factory

    # Membuat request.dbsession bisa diakses di setiap View
    config.add_request_method(
        # r.tm adalah transaction manager dari pyramid_tm
        lambda r: get_tm_session(dbsession_factory, r.tm),
        'dbsession',
        reify=True
    )