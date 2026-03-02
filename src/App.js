import { useState, useEffect } from 'react';
import NoteCard from './Card.js';
import axios from 'axios';

export default function CrudApp() {
  const [items, setItems] = useState([]);
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null); // Untuk menyimpan ID yang sedang diedit
  const TABS = {
    NOTES: { name: "Maretha", url: 'https://www.myid.web.id/notes/' },
    TASKS: { name: "Ghalda", url: 'https://www.ghaldazhra.my.id/notes' } // Contoh database kedua
  };
  const [currTab, setCurrTab] = useState("Notes");
  // Helper untuk mendapatkan URL yang sedang aktif
  const getActiveUrl = () => {
    return currTab === TABS.NOTES.name ? TABS.NOTES.url : TABS.TASKS.url;
  };


  // Fetch data dari API saat komponen pertama kali dimuat
  const fetchNotes = async () => {
    try {
      const targetUrl = currTab === "Notes" ? TABS.NOTES.url : TABS.TASKS.url;
      const response = await axios.get(targetUrl);
      setItems(response.data);
      // const response = await axios.get('http://www.myid.web.id/notes/');
      console.log("Fetched notes:", response.data); // Debugging log
      // setItems(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [currTab]);


  // 2. Fungsi Tambah ke Database (POST)
  const handleSubmit = async () => {
    // Validasi sederhana agar tidak kirim data kosong
    if (!title || !author || !content) {
      alert("Tolong isi semua kolom ya!");
      return;
    }
    const payload = { title, author, content }
    try {
      if (editId) {
        // --- FUNGSI UPDATE (PUT) ---
        // Mengirim perubahan ke endpoint spesifik ID
        await axios.put(`https://www.myid.web.id/notes/${editId}`, payload);
        alert("Data berhasil diperbarui di database!");
      } else {
        // --- FUNGSI CREATE (POST) ---
        await axios.post('https://www.myid.web.id/notes/', payload);
        alert("Data baru berhasil disimpan!");
      }
      // Bersihkan form dan sinkronkan ulang dengan database
      setTitle(""); setAuthor(""); setContent(""); setEditId(null);
      fetchNotes();
    } catch (error) {
      console.error("Gagal menyimpan:", error);
      alert("Terjadi kesalahan pada koneksi API.");
    }
  }


  //   console.log("Berhasil simpan ke database:", response.data);

  //   // Opsi A: Langsung update state dengan data dari database
  //   setItems([...items, response.data]);

  //   // Reset form
  //   setTitle("");
  //   setAuthor("");
  //   setContent("");

  //   alert("Data berhasil masuk ke database!");
  // } catch (error) {   
  //   console.error("Gagal koneksi ke database:", error);
  //   alert("Error: Gagal menyimpan data ke website.");
  // }

  // DELETE
  const deleteItem = async (id) => {
    console.log("Mencoba menghapus item dengan ID:", id); // Debugging log
    if (window.confirm("Yakin ingin menghapus data ini dari database?")) {
      try {
        await axios.delete(`https://www.myid.web.id/notes/${id}`);
        setItems(items.filter(item => item.id !== id)); // Hapus dari tampilan
        alert("Data berhasil dihapus!");
      } catch (error) {
        console.error("Gagal menghapus:", error);
      }
    }
  };

  // 4. Siapkan data untuk Edit
  const startEdit = (item) => {
    setEditId(item._id);
    setTitle(item.title);
    setAuthor(item.author);
    setContent(item.content);
    window.scrollTo(0, 0); // Scroll ke atas biar gampang editnya
  };


  return (
    <div style={{ padding: '20px' }}>
      {/* Navigasi Tab */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {Object.values(TABS).map((tab) => (
          <button
            key={tab.name}
            onClick={() => {
              setCurrTab(tab.name);
              setEditId(null); // Reset form saat pindah tab
            }}
            style={{
              padding: '10px 20px',
              cursor: 'pointer',
              backgroundColor: currTab === tab.name ? '#007bff' : '#eee',
              color: currTab === tab.name ? 'white' : 'black',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <h2>CRUD React 19</h2>

      {/* <h4>Tambah Catatan Baru</h4>
    <input
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Judul..."
      style={{ padding: '8px' }}
    />
    <input
      value={author}
      onChange={(e) => setAuthor(e.target.value)}
      placeholder="Nama Penulis..."
      style={{ padding: '8px' }}
    />
    <textarea
      value={content}
      onChange={(e) => setContent(e.target.value)}
      placeholder="Isi konten..."
      style={{ padding: '8px', minHeight: '80px' }}
    />
    <button
      onClick={addItem}
      style={{
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}
    >Tambah</button> */}

      {/* Bagian Form Input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: editId ? '#f9f9f9' : '#fff' }}>
        <h4>{editId ? "📝 Edit Catatan" : "➕ Tambah Catatan Baru"}</h4>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul..." style={{ padding: '8px' }} />
        <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Penulis..." style={{ padding: '8px' }} />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Isi konten..." style={{ padding: '8px', minHeight: '80px' }} />

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleSubmit} style={{ flex: 1, padding: '10px', backgroundColor: editId ? '#28a745' : '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            {editId ? "Simpan Perubahan ke Database" : "Tambah ke Database"}
          </button>
          {editId && (
            <button onClick={() => { setEditId(null); setTitle(""); setAuthor(""); setContent(""); }} style={{ padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px' }}>
              Batal
            </button>
          )}
        </div>
      </div>
      {/* MENAMPILKAN CARD DATABASE */}
      <div>
        {items.map((item) => (
          <NoteCard
            key={item.id}
            title={item.title || "Untitled"}
            author={item.author || "Anonim"}
            content={item.content}
            idd={item._id}
            // Format tanggal dari API (asumsi field bernama createdAt atau date)
            date={item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID') : "Baru saja"}
            onDelete={() => deleteItem(item._id)}
            onUpdate={() => startEdit(item)}
          />
        ))}
      </div>
    </div>
  );
};
