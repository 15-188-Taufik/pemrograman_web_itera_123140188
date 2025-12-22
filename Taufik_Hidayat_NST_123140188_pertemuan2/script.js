document.addEventListener('DOMContentLoaded', () => {

    // --- CLASS TUGAS DIPERBARUI ---
    class Tugas {
        constructor(text, deadline) { // Diperbarui
            this.id = Date.now(); 
            this.text = text;
            this.deadline = deadline; // Baru
            this.completed = false;
        }
    }
    class Jadwal {
        constructor(matkul, hari, waktu) {
            this.id = Date.now();
            this.matkul = matkul;
            this.hari = hari;     
            this.waktu = waktu;   
        }
    }
    class Catatan {
        constructor(judul, isi) {
            this.id = Date.now();
            this.judul = judul;
            this.isi = isi;
        }
    }

    // =================== DOM SELECTORS ===================
    const clockElement = document.getElementById('clock');
    const weatherElement = document.getElementById('weather-info');
    
    // --- SELECTOR TUGAS DIPERBARUI ---
    const formTugas = document.getElementById('form-tugas');
    const inputTugas = document.getElementById('input-tugas');
    const inputTugasDeadline = document.getElementById('input-tugas-deadline'); // Baru
    const listTugas = document.getElementById('list-tugas');
    
    const formJadwal = document.getElementById('form-jadwal');
    const inputMatkul = document.getElementById('input-matkul');
    const inputHari = document.getElementById('input-hari');
    const inputWaktu = document.getElementById('input-waktu');
    const jadwalBody = document.getElementById('jadwal-body');
    
    const formCatatan = document.getElementById('form-catatan');
    const inputCatatanJudul = document.getElementById('input-catatan-judul');
    const inputCatatanIsi = document.getElementById('input-catatan-isi');
    const listCatatan = document.getElementById('list-catatan');
    
    const notificationElement = document.getElementById('notification');

    // =================== DATA & LOCAL STORAGE ===================
    let dataTugas = JSON.parse(localStorage.getItem('tugasData')) || [];
    let dataJadwal = JSON.parse(localStorage.getItem('jadwalData')) || [];
    let dataCatatan = JSON.parse(localStorage.getItem('catatanData')) || [];
    
    const simpanTugas = () => localStorage.setItem('tugasData', JSON.stringify(dataTugas));
    const simpanJadwal = () => localStorage.setItem('jadwalData', JSON.stringify(dataJadwal));
    const simpanCatatan = () => localStorage.setItem('catatanData', JSON.stringify(dataCatatan));

    // =================== FITUR NOTIFIKASI ===================
    const showNotification = (message, type = 'success') => {
        notificationElement.textContent = message;
        if (type === 'error') {
            notificationElement.classList.add('error');
        } else {
            notificationElement.classList.remove('error');
        }
        notificationElement.classList.add('show');
        setTimeout(() => {
            notificationElement.classList.remove('show');
        }, 3000);
    };

    // =================== FITUR BUKA/TUTUP CARD ===================
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('open');
        });
    });

    document.querySelectorAll('.card-content').forEach(content => {
        content.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    // =================== FITUR REAL-TIME & ASYNC ===================
    
    // 1. Fitur Jam
    const updateClock = () => {
        const now = new Date();
        const jam = `${String(now.getHours()).padStart(2, '0')}`;
        const menit = `${String(now.getMinutes()).padStart(2, '0')}`;
        const detik = `${String(now.getSeconds()).padStart(2, '0')}`;
        clockElement.textContent = `${jam}:${menit}:${detik}`;
    };

    // 2. Fitur Cuaca
    const getWeather = async () => {
        try {
            const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-6.21&longitude=106.85&current=temperature_2m,relative_humidity_2m,wind_speed_10m,visibility,uv_index&timezone=auto');
            if (!response.ok) throw new Error('Gagal mengambil data cuaca');
            const data = await response.json();
            const current = data.current;
            const units = data.current_units;
            const temp = current.temperature_2m;
            const humidity = current.relative_humidity_2m;
            const wind = current.wind_speed_10m;
            const visibility = (current.visibility / 1000).toFixed(1);
            const uv = current.uv_index;

            weatherElement.innerHTML = `
                <div class="weather-detail"><span>🌡️</span><div><strong>Suhu</strong><p>${temp}${units.temperature_2m}</p></div></div>
                <div class="weather-detail"><span>💧</span><div><strong>Kelembaban</strong><p>${humidity}${units.relative_humidity_2m}</p></div></div>
                <div class="weather-detail"><span>💨</span><div><strong>Angin</strong><p>${wind} ${units.wind_speed_10m}</p></div></div>
                <div class="weather-detail"><span>👁️</span><div><strong>Jarak Pandang</strong><p>${visibility} km</p></div></div>
                <div class="weather-detail"><span>☀️</span><div><strong>Index UV</strong><p>${uv}</p></div></div>
            `;
        } catch (error) {
            console.error(error);
            weatherElement.innerHTML = '<p style="text-align: center;">Gagal memuat cuaca.</p>';
        }
    };

    // =================== FUNGSI RENDER ===================
    
    // --- FUNGSI RENDER TUGAS (DIPERBARUI DENGAN SORTING) ---
    const renderTugas = () => { 
        listTugas.innerHTML = ''; 

        // 1. SORTING: Urutkan dataTugas berdasarkan deadline terdekat
        dataTugas.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        
        // 2. RENDER: Tampilkan data yang sudah di-sorting
        dataTugas.forEach(tugas => {
            const li = document.createElement('li');
            li.className = `task-item ${tugas.completed ? 'completed' : ''}`;
            li.dataset.id = tugas.id; 

            // Format tanggal deadline (cth: 30 Okt 2025)
            // Tambahkan T00:00:00 untuk menghindari masalah timezone saat parsing
            const deadlineDate = new Date(tugas.deadline + 'T00:00:00');
            const formattedDeadline = deadlineDate.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });
            
            li.innerHTML = `
                <div class="list-item-content">
                    <span class="task-text">${tugas.text}</span>
                    <p class="tugas-deadline">📅 ${formattedDeadline}</p>
                </div>
                <div class="list-item-controls">
                    <button class="action-btn edit-btn">Edit</button>
                    <button class="action-btn delete-btn">Hapus</button>
                </div>
            `;
            listTugas.appendChild(li);
        });
    };
    
    const renderJadwal = () => {
        const dayIdMapping = [
            'jadwal-minggu-content', 'jadwal-senin-content', 'jadwal-selasa-content', 
            'jadwal-rabu-content', 'jadwal-kamis-content', 'jadwal-jumat-content', 
            'jadwal-sabtu-content'
        ];

        dayIdMapping.forEach(id => {
            const cell = document.getElementById(id);
            if(cell) cell.innerHTML = '';
        });

        dataJadwal.forEach(jadwal => {
            const dayIndex = Number(jadwal.hari); 
            const targetCellId = dayIdMapping[dayIndex];
            const targetCell = document.getElementById(targetCellId);
            const formattedTime = jadwal.waktu; 

            const itemDiv = document.createElement('div');
            itemDiv.className = 'jadwal-item';
            itemDiv.dataset.id = jadwal.id;
            itemDiv.innerHTML = `
                <div class="jadwal-item-content">
                    <span class="jadwal-waktu">${formattedTime}</span>
                    <strong class="jadwal-matkul">${jadwal.matkul}</strong>
                </div>
                <div class="list-item-controls">
                    <button class="action-btn edit-btn">Edit</button>
                    <button class="action-btn delete-btn">Hapus</button>
                </div>
            `;
            if(targetCell) {
                targetCell.appendChild(itemDiv);
            }
        });
    };

    const renderCatatan = () => { 
        listCatatan.innerHTML = '';
        dataCatatan.forEach(catatan => {
            const li = document.createElement('li');
            li.className = 'note-item';
            li.dataset.id = catatan.id;
            li.innerHTML = `
                <div class="list-item-content">
                    <strong class="catatan-judul">${catatan.judul}</strong>
                    <p class="catatan-isi">${catatan.isi}</p>
                </div>
                <div class="list-item-controls">
                    <button class="action-btn edit-btn">Edit</button>
                    <button class="action-btn delete-btn">Hapus</button>
                </div>
            `;
            listCatatan.appendChild(li);
        });
    };

    // =================== EVENT HANDLERS (Form Submit) ===================
    
    // --- HANDLER FORM TUGAS DIPERBARUI ---
    formTugas.addEventListener('submit', (e) => {
        e.preventDefault();
        const textTugas = inputTugas.value.trim();
        const deadlineTugas = inputTugasDeadline.value; // Ambil value deadline

        if (textTugas && deadlineTugas) { // Validasi keduanya
            const tugasBaru = new Tugas(textTugas, deadlineTugas); // Kirim ke constructor
            dataTugas.push(tugasBaru);
            simpanTugas();
            renderTugas(); // Render ulang (sudah otomatis sort)
            inputTugas.value = '';
            inputTugasDeadline.value = ''; // Reset input deadline
            showNotification("Tugas berhasil ditambahkan");
        }
    });
    
    formJadwal.addEventListener('submit', (e) => {
        e.preventDefault();
        const matkul = inputMatkul.value.trim();
        const hari = inputHari.value; 
        const waktu = inputWaktu.value;   

        if (matkul && hari !== "" && waktu) { 
            const jadwalBaru = new Jadwal(matkul, hari, waktu); 
            dataJadwal.push(jadwalBaru);
            simpanJadwal();
            renderJadwal(); 
            inputMatkul.value = '';
            inputHari.value = ''; 
            inputWaktu.value = '';
            showNotification("Jadwal berhasil ditambahkan");
        }
    });

    formCatatan.addEventListener('submit', (e) => {
        e.preventDefault();
        const judul = inputCatatanJudul.value.trim();
        const isi = inputCatatanIsi.value.trim();
        if (judul && isi) {
            const catatanBaru = new Catatan(judul, isi); 
            dataCatatan.push(catatanBaru);
            simpanCatatan();
            renderCatatan();
            inputCatatanJudul.value = '';
            inputCatatanIsi.value = '';
            showNotification("Catatan berhasil ditambahkan");
        }
    });

    // =================== EVENT HANDLERS (List Clicks) ===================
    
    jadwalBody.addEventListener('click', (e) => {
        const target = e.target;
        const item = target.closest('.jadwal-item');
        if (!item) return;
        const id = Number(item.dataset.id);

        if (target.classList.contains('delete-btn')) {
            dataJadwal = dataJadwal.filter(jadwal => jadwal.id !== id);
            simpanJadwal();
            renderJadwal(); 
            showNotification("Jadwal dihapus", "error");
        
        } else if (target.classList.contains('edit-btn')) {
            toggleEditJadwal(item, id, target);
        }
    });

    listTugas.addEventListener('click', (e) => {
        const target = e.target;
        const li = target.closest('li');
        if (!li) return;
        const id = Number(li.dataset.id);

        if (target.classList.contains('delete-btn')) {
            dataTugas = dataTugas.filter(tugas => tugas.id !== id);
            simpanTugas();
            renderTugas();
            showNotification("Tugas dihapus", "error");
        } else if (target.classList.contains('edit-btn')) {
            toggleEditTugas(li, id, target);
        } else if (target.tagName === 'SPAN' || target.tagName === 'LI') {
            const tugas = dataTugas.find(tugas => tugas.id === id);
            // Cek agar tidak toggle saat sedang edit
            if (tugas && !li.querySelector('.task-text').isContentEditable) { 
                tugas.completed = !tugas.completed;
                simpanTugas();
                renderTugas();
            }
        }
    });

    listCatatan.addEventListener('click', (e) => {
        const target = e.target;
        const li = target.closest('li');
        if (!li) return;
        const id = Number(li.dataset.id);

        if (target.classList.contains('delete-btn')) {
            dataCatatan = dataCatatan.filter(catatan => catatan.id !== id);
            simpanCatatan();
            renderCatatan();
            showNotification("Catatan dihapus", "error");
        } else if (target.classList.contains('edit-btn')) {
            toggleEditCatatan(li, id, target);
        }
    });

    // =================== FUNGSI Edit In-Place ===================

    function toggleEditJadwal(item, id, btn) {
        const matkulElem = item.querySelector('.jadwal-matkul');
        const waktuElem = item.querySelector('.jadwal-waktu');
        const isEditing = btn.textContent === 'Simpan';

        if (isEditing) {
            matkulElem.contentEditable = false;
            waktuElem.contentEditable = false;
            btn.textContent = 'Edit';
            btn.classList.remove('save-btn');

            const jadwal = dataJadwal.find(j => j.id === id);
            jadwal.matkul = matkulElem.innerText.trim();
            jadwal.waktu = waktuElem.innerText.trim(); 
            simpanJadwal();
            renderJadwal(); 
            showNotification("Jadwal diperbarui");
        } else {
            matkulElem.contentEditable = true;
            waktuElem.contentEditable = true;
            matkulElem.focus();
            btn.textContent = 'Simpan';
            btn.classList.add('save-btn');
        }
    }

    // Edit tugas (hanya mengedit teks, tidak mengedit deadline)
    function toggleEditTugas(li, id, btn) {
        const textSpan = li.querySelector('.task-text');
        const isEditing = btn.textContent === 'Simpan';

        if (isEditing) {
            textSpan.contentEditable = false;
            btn.textContent = 'Edit';
            btn.classList.remove('save-btn');
            
            const tugas = dataTugas.find(t => t.id === id);
            tugas.text = textSpan.innerText.trim();
            simpanTugas();
            showNotification("Tugas diperbarui");
        } else {
            textSpan.contentEditable = true;
            textSpan.focus(); 
            btn.textContent = 'Simpan';
            btn.classList.add('save-btn');
        }
    }

    function toggleEditCatatan(li, id, btn) {
        const judulElem = li.querySelector('.catatan-judul');
        const isiElem = li.querySelector('.catatan-isi');
        const isEditing = btn.textContent === 'Simpan';

        if (isEditing) {
            judulElem.contentEditable = false;
            isiElem.contentEditable = false;
            btn.textContent = 'Edit';
            btn.classList.remove('save-btn');

            const catatan = dataCatatan.find(c => c.id === id);
            catatan.judul = judulElem.innerText.trim();
            catatan.isi = isiElem.innerText.trim();
            simpanCatatan();
            showNotification("Catatan diperbarui");
        } else {
            judulElem.contentEditable = true;
            isiElem.contentEditable = true;
            judulElem.focus();
            btn.textContent = 'Simpan';
            btn.classList.add('save-btn');
        }
    }

    // =================== INISIALISASI APLIKASI ===================
    updateClock(); 
    setInterval(updateClock, 1000); 
    getWeather(); 

    renderTugas();
    renderJadwal();
    renderCatatan();

});