import { useState, useEffect, useCallback } from 'react';
import NoteCard from './Card.js';
import AuthPage from './Login.js';
import axios from 'axios';

const TABS = {
  MARE: { name: "Maretha", url: 'https://www.myid.web.id/notes/' },
  GHAL: { name: "Ghalda", url: 'https://www.ghaldazhra.my.id/notes/' }
};

export default function CrudApp() {
  const [items, setItems] = useState([]);
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [oldTitle, setOldTitle] = useState(""); // Tambahan untuk track title lama saat edit di Ghal

  const [currTab, setCurrTab] = useState(TABS.MARE.name);

  const fetchNotes = useCallback(async () => {
    try {
      const targetUrl = currTab === TABS.MARE.name ? TABS.MARE.url : TABS.GHAL.url;
      const response = await axios.get(targetUrl);
      setItems(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setItems([]);
    }
  }, [currTab]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const getActiveUrl = () => {
    const url = currTab === TABS.MARE.name ? TABS.MARE.url : TABS.GHAL.url;
    return url.endsWith('/') ? url : `${url}/`;
  };

  const handleSubmit = async () => {
    if (!title || !author || !content) return alert("Isi semua field!");

    const payload = { title, author, content };
    const baseUrl = getActiveUrl();

    try {
      if (editId) {
        // LOGIKA KHUSUS GHALDA (Update via Title)
        if (currTab === TABS.GHAL.name) {
          await axios.put(`${baseUrl}title/${encodeURIComponent(oldTitle)}`, payload);
        } else {
          // LOGIKA MARETHA (Update via ID)
          await axios.put(`${baseUrl}${editId}`, payload);
        }
        alert("Berhasil Update!");
      } else {
        await axios.post(baseUrl, payload);
        alert("Berhasil Tambah!");
      }

      // Reset Form
      setEditId(null); setTitle(""); setAuthor(""); setContent(""); setOldTitle("");
      fetchNotes();
    } catch (error) {
      console.error("Detail Error:", error.response || error);
      alert(`Gagal: ${error.response?.data?.message || "Koneksi API bermasalah"}`);
    }
  };

  const deleteItem = async (item) => {
    const idOrTitle = currTab === TABS.GHAL.name ? item.title : (item._id || item.id);
    const deletePath = currTab === TABS.GHAL.name ? `title/${encodeURIComponent(idOrTitle)}` : idOrTitle;

    if (window.confirm(`Yakin hapus catatan "${item.title}"?`)) {
      try {
        await axios.delete(`${getActiveUrl()}${deletePath}`);
        fetchNotes();
      } catch (error) {
        console.error("Gagal menghapus:", error);
        alert("Gagal menghapus data.");
      }
    }
  };

  const startEdit = (item) => {
    setEditId(item._id || item.id);
    setOldTitle(item.title); // Simpan title asli untuk key update Ghal
    setTitle(item.title);
    setAuthor(item.author);
    setContent(item.content);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <AuthPage onLoginSuccess={(username) => alert(`Selamat datang, ${username}!`)} />

      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        {/* Navigasi Tab */}
        <div style={{ display: 'flex', gap: '5px', marginBottom: '25px', backgroundColor: '#f0f0f0', padding: '5px', borderRadius: '12px' }}>
          {Object.values(TABS).map((tab) => (
            <button
              key={tab.name}
              onClick={() => {
                setCurrTab(tab.name);
                setEditId(null);
                setTitle(""); setAuthor(""); setContent(""); setOldTitle("");
              }}
              style={{
                flex: 1, padding: '12px', cursor: 'pointer', border: 'none', borderRadius: '8px',
                fontWeight: 'bold',
                backgroundColor: currTab === tab.name ? '#fff' : 'transparent',
                color: currTab === tab.name ? '#007bff' : '#666',
                boxShadow: currTab === tab.name ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.3s'
              }}
            >
              {tab.name}'s Page
            </button>
          ))}
        </div>

        <h2 style={{ textAlign: 'center' }}>Notes App - {currTab}</h2>

        {/* Form Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: editId ? '#f9faff' : '#fff', marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>{editId ? "📝 Edit Catatan" : "➕ Tambah Baru"}</h4>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul..." style={inputStyle} />
          <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Penulis..." style={inputStyle} />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Isi konten..." style={{ ...inputStyle, minHeight: '80px' }} />

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleSubmit} style={{ flex: 1, padding: '10px', backgroundColor: editId ? '#28a745' : '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
              {editId ? "Simpan Perubahan" : "Tambah ke Database"}
            </button>
            {editId && (
              <button onClick={() => { setEditId(null); setTitle(""); setAuthor(""); setContent(""); setOldTitle(""); }} style={{ padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Batal
              </button>
            )}
          </div>
        </div>

        {/* List Card */}
        <div style={{ display: 'grid', gap: '15px' }}>
          {items.length > 0 ? (
            items.map((item) => (
              <NoteCard
                key={item._id || item.id || item.title}
                title={item.title || "Untitled"}
                author={item.author || "Anonim"}
                content={item.content}
                idd={item._id || item.id}
                date={item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID') : "Baru saja"}
                onDelete={() => deleteItem(item)}
                onUpdate={() => startEdit(item)}
              />
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#999' }}>Database {currTab} kosong.</p>
          )}
        </div>
      </div>
    </>
  );

}

const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ccc', outlineColor: '#007bff' };