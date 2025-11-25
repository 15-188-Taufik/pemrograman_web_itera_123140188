from abc import ABC, abstractmethod

# ==========================================
# 1. Abstract Class & Encapsulation
# ==========================================
class LibraryItem(ABC):
    """
    Abstract Base Class untuk semua item perpustakaan.
    Menerapkan Encapsulation pada atribut title dan item_id.
    """
    def __init__(self, title, item_id):
        # Protected attributes (Encapsulation)
        self._title = title
        self._item_id = item_id

    # Property Decorator (Getter) - Syarat Praktikum
    @property
    def title(self):
        return self._title

    @property
    def item_id(self):
        return self._item_id

    # Abstract Method - Harus diimplementasikan oleh subclass
    @abstractmethod
    def get_details(self):
        pass


# ==========================================
# 2. Inheritance & Polymorphism (Subclasses)
# ==========================================
class Book(LibraryItem):
    """
    Subclass Book mewarisi LibraryItem.
    Memiliki atribut spesifik: author, publisher, isbn.
    """
    def __init__(self, title, item_id, author, publisher, isbn):
        super().__init__(title, item_id)
        self.author = author
        self.publisher = publisher
        self.isbn = isbn

    # Method Overriding (Polymorphism)
    def get_details(self):
        return (f"[Buku] ID: {self.item_id} | Judul: {self.title} | "
                f"Penulis: {self.author} | Penerbit: {self.publisher} | ISBN: {self.isbn}")


class Magazine(LibraryItem):
    """
    Subclass Magazine mewarisi LibraryItem.
    Memiliki atribut spesifik: issue_number, publisher.
    """
    def __init__(self, title, item_id, issue_number, publisher):
        super().__init__(title, item_id)
        self.issue_number = issue_number
        self.publisher = publisher

    # Method Overriding (Polymorphism)
    def get_details(self):
        return (f"[Majalah] ID: {self.item_id} | Judul: {self.title} | "
                f"Edisi: {self.issue_number} | Penerbit: {self.publisher}")


# ==========================================
# 3. Class Management (Library)
# ==========================================
class Library:
    """
    Class untuk mengelola koleksi item perpustakaan.
    """
    def __init__(self):
        self.__items = []  # Private attribute untuk menyimpan list item

    def add_item(self, item: LibraryItem):
        self.__items.append(item)
        print(f"Sukses menambahkan: {item.title}")

    def display_items(self):
        print("\n=== Daftar Koleksi Perpustakaan ===")
        if not self.__items:
            print("Koleksi masih kosong.")
        else:
            for item in self.__items:
                # Polymorphism terjadi di sini:
                # method get_details() akan menyesuaikan apakah item itu Book atau Magazine
                print(item.get_details())

    def search_item(self, keyword):
        print(f"\n=== Hasil Pencarian: '{keyword}' ===")
        found = False
        for item in self.__items:
            # Mencari berdasarkan judul atau ID (case insensitive)
            if keyword.lower() in item.title.lower() or keyword.lower() in item.item_id.lower():
                print(item.get_details())
                found = True
        
        if not found:
            print("Item tidak ditemukan.")


# ==========================================
# 4. Main Program (CLI Interaktif)
# ==========================================
def main():
    library = Library()
    
    # Data dummy untuk testing awal (bisa dihapus jika ingin bersih)
    library.add_item(Book("Belajar Python OOP", "B001", "Taufik Hidayat", "ITERA Press", "978-1-2345"))
    library.add_item(Magazine("Tech Asia", "M001", "Vol. 5 Nov 2025", "Tech Media"))

    while True:
        print("\n" + "="*40)
        print(" SISTEM MANAJEMEN PERPUSTAKAAN SEDERHANA ")
        print("="*40)
        print("1. Tambah Buku")
        print("2. Tambah Majalah")
        print("3. Tampilkan Semua Item")
        print("4. Cari Item (Judul/ID)")
        print("5. Keluar")
        
        choice = input("Pilih menu (1-5): ")

        if choice == '1':
            print("\n--- Input Data Buku ---")
            title = input("Judul Buku: ")
            uid = input("ID Buku: ")
            author = input("Penulis: ")
            pub = input("Penerbit: ")
            isbn = input("ISBN: ")
            
            book = Book(title, uid, author, pub, isbn)
            library.add_item(book)

        elif choice == '2':
            print("\n--- Input Data Majalah ---")
            title = input("Judul Majalah: ")
            uid = input("ID Majalah: ")
            issue = input("Edisi/Volume: ")
            pub = input("Penerbit: ")
            
            mag = Magazine(title, uid, issue, pub)
            library.add_item(mag)

        elif choice == '3':
            library.display_items()

        elif choice == '4':
            keyword = input("\nMasukkan kata kunci pencarian: ")
            library.search_item(keyword)

        elif choice == '5':
            print("Terima kasih telah menggunakan sistem ini.")
            break
        else:
            print("Pilihan tidak valid, silakan coba lagi.")

if __name__ == "__main__":
    main()