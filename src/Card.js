const NoteCard = ({ title, author, content, date, onDelete, onUpdate }) => {
    return (
      <div style={{
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        padding: '20px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        position: 'relative'
      }}>
        {/* 1. Title */}
        <h3 style={{ margin: '0', color: '#1a1a1a', fontSize: '1.2rem' }}>{title}</h3>

        {/* 2. Author */}
        <span style={{
          fontSize: '0.85rem',
          color: '#666',
          fontStyle: 'italic'
        }}>
          Oleh: {author}
        </span>

        {/* 3. Content */}
        <p style={{
          margin: '10px 0',
          color: '#444',
          lineHeight: '1.5',
          fontSize: '0.95rem'
        }}>
          {content}
        </p>

        {/* 4. Tanggal & Button */}
        <div style={{
          marginTop: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #eee',
          paddingTop: '10px'
        }}>
          <small style={{ color: '#999' }}>{date}</small>

          <button
            onClick={onDelete}
            style={{
              backgroundColor: '#ff4d4f',
              color: 'white',
              border: 'none',
              padding: '5px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            Hapus
          </button>

          <button
            onClick={onUpdate}
            style={{
              backgroundColor: '#009926',
              color: 'white',
              border: 'none',
              padding: '5px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            Update
          </button>

        </div>
      </div>
    );
  };
export default NoteCard;
