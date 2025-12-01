import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Загружаем заметки из localStorage сразу при инициализации состояния
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  
  const [newNote, setNewNote] = useState('');
  const [editNoteId, setEditNoteId] = useState(null);
  const [editText, setEditText] = useState('');

  // Только сохранение в localStorage при изменении notes
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  // Остальные функции остаются без изменений...
  const addNote = () => {
    if (newNote.trim() === '') return;
    
    const newNoteObj = {
      id: Date.now(),
      text: newNote,
      date: new Date().toLocaleString()
    };
    
    setNotes(prevNotes => [newNoteObj, ...prevNotes]);
    setNewNote('');
  };

  const deleteNote = (id) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    if (editNoteId === id) {
      setEditNoteId(null);
    }
  };

  const startEdit = (note) => {
    setEditNoteId(note.id);
    setEditText(note.text);
  };

  const saveEdit = () => {
    if (editText.trim() === '') return;
    
    setNotes(prevNotes => prevNotes.map(note => 
      note.id === editNoteId 
        ? { ...note, text: editText, date: new Date().toLocaleString() }
        : note
    ));
    
    setEditNoteId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditNoteId(null);
    setEditText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (editNoteId) {
        saveEdit();
      } else {
        addNote();
      }
    }
  };

  const clearAllNotes = () => {
    if (window.confirm('Вы уверены, что хотите удалить все заметки?')) {
      setNotes([]);
      setEditNoteId(null);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1 className="app-title">📝 Мой список заметок</h1>
        
        <div className="note-input">
          <div className="input-group">
            <textarea
              className="note-textarea"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Введите новую заметку..."
              rows="3"
            />
            <button 
              className="add-btn" 
              onClick={addNote}
              disabled={newNote.trim() === ''}
            >
              Добавить заметку
            </button>
          </div>
          <p className="hint">Нажмите Enter для быстрого добавления</p>
        </div>

        {notes.length > 0 && (
          <div className="notes-info">
            <span className="notes-count">Всего заметок: {notes.length}</span>
            <button 
              className="clear-all-btn"
              onClick={clearAllNotes}
            >
              Очистить все
            </button>
          </div>
        )}

        <div className="notes-list">
          {notes.length === 0 ? (
            <div className="empty-state">
              <p>У вас пока нет заметок</p>
              <p>Добавьте первую заметку выше 👆</p>
            </div>
          ) : (
            notes.map(note => (
              <div key={note.id} className="note-card">
                {editNoteId === note.id ? (
                  // Режим редактирования
                  <div className="edit-mode">
                    <textarea
                      className="edit-textarea"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      rows="3"
                      autoFocus
                    />
                    <div className="edit-actions">
                      <button 
                        className="save-btn"
                        onClick={saveEdit}
                        disabled={editText.trim() === ''}
                      >
                        Сохранить
                      </button>
                      <button 
                        className="cancel-btn"
                        onClick={cancelEdit}
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                ) : (
                  // Режим просмотра
                  <>
                    <div className="note-content">
                      <p className="note-text">{note.text}</p>
                      <p className="note-date">{note.date}</p>
                    </div>
                    <div className="note-actions">
                      <button 
                        className="edit-btn"
                        onClick={() => startEdit(note)}
                      >
                        ✏️ Редактировать
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => deleteNote(note.id)}
                      >
                        🗑️ Удалить
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {notes.length > 0 && (
          <div className="storage-info">
            <p>📁 Заметки сохранены в LocalStorage</p>
            <p className="storage-hint">Они не пропадут после перезагрузки страницы</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;