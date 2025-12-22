from pyramid.view import view_config
from pyramid.httpexceptions import HTTPFound, HTTPNotFound
from pyramid.response import Response

from ..models import Course

# --- 1. READ: Menampilkan Daftar Matakuliah ---
@view_config(route_name='home', renderer='python_pyramid:templates/mytemplate.jinja2')
def my_view(request):
    # Mengambil semua data matakuliah dari database, diurutkan berdasarkan ID
    courses = request.dbsession.query(Course).order_by(Course.id).all()
    return {'courses': courses, 'project': 'Manajemen Matakuliah'}

# --- 2. CREATE: Menambah Matakuliah Baru ---
@view_config(route_name='add_course', renderer='python_pyramid:templates/add_course.jinja2')
def add_course_view(request):
    # Jika tombol submit ditekan (Method POST)
    if request.method == 'POST':
        kode = request.params['kode']
        nama = request.params['nama']
        sks = int(request.params['sks'])
        deskripsi = request.params['deskripsi']

        # Simpan ke database
        new_course = Course(kode=kode, nama=nama, sks=sks, deskripsi=deskripsi)
        request.dbsession.add(new_course)
        
        # Redirect kembali ke halaman home
        return HTTPFound(location=request.route_url('home'))
    
    # Jika hanya membuka halaman (Method GET), tampilkan form kosong
    return {}

# --- 3. UPDATE: Edit Matakuliah ---
@view_config(route_name='edit_course', renderer='python_pyramid:templates/edit_course.jinja2')
def edit_course_view(request):
    # Ambil ID dari URL
    course_id = int(request.matchdict['id'])
    
    # Cari data di database
    course = request.dbsession.query(Course).filter_by(id=course_id).first()
    
    if not course:
        return HTTPNotFound()

    # Jika tombol submit ditekan (Method POST)
    if request.method == 'POST':
        course.kode = request.params['kode']
        course.nama = request.params['nama']
        course.sks = int(request.params['sks'])
        course.deskripsi = request.params['deskripsi']
        
        # Tidak perlu dbsession.add(), karena objek sudah terikat session (SQLAlchemy magic)
        return HTTPFound(location=request.route_url('home'))

    # Tampilkan form dengan data lama
    return {'course': course}

# --- 4. DELETE: Hapus Matakuliah ---
@view_config(route_name='delete_course')
def delete_course_view(request):
    course_id = int(request.matchdict['id'])
    course = request.dbsession.query(Course).filter_by(id=course_id).first()
    
    if course:
        request.dbsession.delete(course)
    
    return HTTPFound(location=request.route_url('home'))