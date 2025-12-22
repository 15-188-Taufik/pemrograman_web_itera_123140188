def includeme(config):
    # Folder static untuk CSS/JS/Images
    config.add_static_view('static', 'static', cache_max_age=3600)
    
    # Route untuk Halaman Utama (List Data)
    config.add_route('home', '/')
    
    # Route untuk Tambah Data
    config.add_route('add_course', '/course/add')
    
    # Route untuk Edit Data (menangkap ID matakuliah)
    config.add_route('edit_course', '/course/{id}/edit')
    
    # Route untuk Hapus Data
    config.add_route('delete_course', '/course/{id}/delete')