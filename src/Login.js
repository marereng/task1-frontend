import { useState } from 'react';
import axios from 'axios';

export default function AuthPage({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Sesuaikan URL ini! Jika di backend: app.use('/auth', router) 
    // Maka tambahkan /auth di URL-nya.
    const url = `http://localhost:5000/auth/register`; 
    const loginUrl = `http://localhost:5000/auth/login`;
    const targetUrl = isRegister ? url : loginUrl;

    try {
      const res = await axios.post(targetUrl, form);
      
      if (isRegister) {
        alert(res.data.message); // "User berhasil dibuat"
        setIsRegister(false);
      } else {
        // Logika Login: Backend kamu kirim { success, message, user }
        if (res.data.success) {
          alert("Login Berhasil!");
          onLoginSuccess(res.data.user.username); 
        }
      }
    } catch (err) {
      // Ambil pesan error dari backend kamu
      const errorMsg = err.response?.data?.message || "Koneksi ke server gagal!";
      alert(errorMsg);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center' }}>{isRegister ? "Register" : "Login"}</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          placeholder="Username" 
          value={form.username}
          onChange={e => setForm({...form, username: e.target.value})} 
          style={inputStyle} 
          required 
        />
        
        {isRegister && (
          <input 
            type="email"
            placeholder="Email" 
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})} 
            style={inputStyle} 
            required
          />
        )}

        <input 
          type="password" 
          placeholder="Password" 
          value={form.password}
          onChange={e => setForm({...form, password: e.target.value})} 
          style={inputStyle} 
          required 
        />

        <button type="submit" style={buttonStyle}>
          {isRegister ? "Daftar" : "Masuk"}
        </button>
      </form>

      <p onClick={() => setIsRegister(!isRegister)} style={toggleTextStyle}>
        {isRegister ? "Sudah punya akun? Login" : "Belum punya akun? Daftar"}
      </p>
    </div>
  );
}

// Styling simpel agar enak dilihat
const containerStyle = { maxWidth: '300px', margin: '80px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'Arial' };
const inputStyle = { padding: '10px', borderRadius: '4px', border: '1px solid #ccc' };
const buttonStyle = { padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const toggleTextStyle = { textAlign: 'center', fontSize: '13px', color: 'blue', cursor: 'pointer', marginTop: '15px' };