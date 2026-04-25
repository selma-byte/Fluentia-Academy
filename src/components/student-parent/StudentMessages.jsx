import React, { useState, useEffect, useRef } from 'react';

// ─────────────────────────────────────────────────────────────────
// SVG ICON SYSTEM
// ─────────────────────────────────────────────────────────────────
const Ico = ({ d, size = 16, color = 'currentColor', sw = 2, extra = null, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
    {extra}
  </svg>
);

const Icons = {
  Search:    (c = '#94a3b8') => <Ico d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0" color={c} />,
  Send:      (c = '#fff')    => <Ico d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" color={c} sw={2} />,
  Paperclip: (c = '#94a3b8') => <Ico d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" color={c} />,
  Image:     (c = '#94a3b8') => <Ico d={["M21 19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3l2-3h4l2 3h3a2 2 0 0 1 2 2z"]} color={c} extra={<circle cx="12" cy="13" r="4" fill="none" stroke={c} strokeWidth="2"/>} />,
  Smile:     (c = '#94a3b8') => <Ico d={["M8 14s1.5 2 4 2 4-2 4-2"]} color={c} extra={<><circle cx="12" cy="12" r="10" fill="none" stroke={c} strokeWidth="2"/><line x1="9" y1="9" x2="9.01" y2="9" stroke={c} strokeWidth="3" strokeLinecap="round"/><line x1="15" y1="9" x2="15.01" y2="9" stroke={c} strokeWidth="3" strokeLinecap="round"/></>} />,
  Phone:     (c = '#4318FF') => <Ico d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" color={c} />,
  Video:     (c = '#4318FF') => <Ico d={["M23 7l-7 5 7 5V7z","M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"]} color={c} />,
  Message:   (c = '#4318FF') => <Ico d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" color={c} />,
  Check2:    (c = '#94a3b8') => <Ico d="M18 6L7 17l-5-5" color={c} sw={2.5} />,
  File:      (c = '#4318FF') => <Ico d={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6"]} color={c} />,
  X:         (c = '#ef4444') => <Ico d={["M18 6L6 18","M6 6l12 12"]} color={c} sw={2.5} />,
};

// Avatar palette
const AV = [
  { bg: '#eef2ff', color: '#4318FF' },
  { bg: '#ecfdf5', color: '#059669' },
  { bg: '#fff7ed', color: '#f97316' },
  { bg: '#fef2f2', color: '#ef4444' },
  { bg: '#f5f3ff', color: '#7c3aed' },
];

const Avatar = ({ letter, idx = 0, size = 40, online = false }) => {
  const c = AV[idx % AV.length];
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: 10,
        background: c.bg, color: c.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.32, fontWeight: 800, textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>{letter}</div>
      <div style={{
        position: 'absolute', bottom: -2, right: -2,
        width: 10, height: 10, borderRadius: '50%',
        background: online ? '#22c55e' : '#cbd5e1',
        border: '2px solid #fff',
      }} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// EMOJI PICKER
// ─────────────────────────────────────────────────────────────────
const EMOJIS = ['😊','👋','✅','📚','📝','🎓','👍','🙏','❓','📎','💡','🗓️'];

// ─────────────────────────────────────────────────────────────────
// STATIC CONTACTS (unchanged data)
// ─────────────────────────────────────────────────────────────────
const CONTACTS = [
  { id: 1, name: 'Academic Office',  initial: 'AO', lastMsg: 'Your registration is confirmed.', time: '10 Min',     status: 'online',  idx: 0 },
  { id: 2, name: 'Mr. Adam Smith',   initial: 'AS', lastMsg: 'Please review the B2 syllabus.',  time: '12:36 PM',   status: 'offline', idx: 1 },
  { id: 3, name: 'Student Support',  initial: 'SS', lastMsg: 'The library is now open.',         time: 'Yesterday',  status: 'online',  idx: 2 },
  { id: 4, name: 'Dr. Johnson',      initial: 'DJ', lastMsg: 'Grade report is available.',       time: '2 days ago', status: 'offline', idx: 3 },
];

const INIT_MESSAGES = {
  1: [
    { id: 1, sender: 'them', text: 'Good morning. I have uploaded the feedback for your recent oral presentation.', time: '10:15 AM', type: 'text' },
    { id: 2, sender: 'them', text: 'Please let me know if you have any questions regarding the score.', time: '10:15 AM', type: 'text' },
    { id: 3, sender: 'me',   text: 'Thank you, Professor. I will review it immediately.', time: '10:20 AM', type: 'text' },
  ],
  2: [
    { id: 1, sender: 'them', text: 'Please review the B2 syllabus before next Tuesday.', time: '12:30 PM', type: 'text' },
  ],
  3: [
    { id: 1, sender: 'them', text: 'The library is now open from 8 AM to 8 PM.', time: 'Yesterday', type: 'text' },
  ],
  4: [
    { id: 1, sender: 'them', text: 'Your grade report is now available in the portal.', time: '2 days ago', type: 'text' },
  ],
};

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT — all original logic + state preserved
// ─────────────────────────────────────────────────────────────────
const StudentMessages = () => {
  const [activeChat, setActiveChat]     = useState(1);
  const [messageText, setMessageText]   = useState('');
  const [showEmoji, setShowEmoji]       = useState(false);
  const [searchQuery, setSearchQuery]   = useState('');
  const [allMessages, setAllMessages]   = useState(INIT_MESSAGES);
  const [filePreview, setFilePreview]   = useState(null); // { name, size, url, type }

  const scrollRef   = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const inputRef    = useRef(null);

  const activeContact = CONTACTS.find(c => c.id === activeChat);
  const messages = allMessages[activeChat] || [];

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeChat]);

  // Close emoji on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('#emoji-btn') && !e.target.closest('#emoji-picker')) {
        setShowEmoji(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const addMsg = (msg) => {
    setAllMessages(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), { id: Date.now() + Math.random(), ...msg }],
    }));
  };

  // ── Send text message ─────────────────────────────────────────────
  const handleSend = (e) => {
    e.preventDefault();
    const text = messageText.trim();

    // If there's a file preview staged, send it
    if (filePreview) {
      addMsg({
        sender: 'me',
        type: filePreview.type === 'image' ? 'image' : 'file',
        text: filePreview.name,
        url: filePreview.url,
        fileSize: filePreview.size,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      setFilePreview(null);
    }

    if (text) {
      addMsg({
        sender: 'me',
        type: 'text',
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      setMessageText('');
    }

    setShowEmoji(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // ── File / image pick ────────────────────────────────────────────
  const handleFilePick = (e, isImage = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFilePreview({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      url,
      type: isImage ? 'image' : 'file',
    });
    e.target.value = '';
  };

  const addEmoji = (emoji) => {
    setMessageText(prev => prev + emoji);
    inputRef.current?.focus();
  };

  const filteredContacts = CONTACTS.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ width: '100%', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1e293b' }}>Messages</h1>
        <p style={{ margin: '5px 0 0', fontSize: 13, color: '#94a3b8' }}>
          Communicate with your professors and support team.
        </p>
      </div>

      {/* Chat container */}
      <div style={{
        display: 'flex', background: '#fff',
        borderRadius: 16, border: '1px solid #f1f5f9',
        boxShadow: '0 1px 4px rgba(15,23,42,0.05)',
        overflow: 'hidden', height: 600,
      }}>

        {/* ══════════ LEFT: CONTACT LIST ══════════ */}
        <div style={{
          width: 280, borderRight: '1px solid #f1f5f9',
          display: 'flex', flexDirection: 'column', flexShrink: 0, background: '#fff',
        }}>
          {/* Header */}
          <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid #f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#1e293b' }}>Conversations</h2>
              <span style={{
                fontSize: 9, fontWeight: 800, color: '#4318FF',
                background: '#eef2ff', padding: '2px 8px', borderRadius: 20,
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>New</span>
            </div>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }}>
                {Icons.Search()}
              </span>
              <input type="text" placeholder="Search conversations..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', background: '#f8fafc', border: '1px solid #f1f5f9',
                  borderRadius: 10, padding: '9px 12px 9px 34px',
                  fontSize: 12, color: '#1e293b', outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
                onFocus={e => e.target.style.borderColor = '#4318FF'}
                onBlur={e => e.target.style.borderColor = '#f1f5f9'}
              />
            </div>
          </div>

          {/* Contacts */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredContacts.map(contact => {
              const isActive = activeChat === contact.id;
              return (
                <button key={contact.id} onClick={() => setActiveChat(contact.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 18px', border: 'none',
                    borderBottom: '1px solid #f8fafc',
                    background: isActive ? '#f5f3ff' : 'transparent',
                    cursor: 'pointer', textAlign: 'left', transition: 'background .15s',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#f8fafc'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <Avatar letter={contact.initial} idx={contact.idx} size={42} online={contact.status === 'online'} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
                      <p style={{
                        margin: 0, fontSize: 13,
                        fontWeight: isActive ? 700 : 600,
                        color: isActive ? '#4318FF' : '#1e293b',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{contact.name}</p>
                      <span style={{ fontSize: 10, color: '#94a3b8', flexShrink: 0, marginLeft: 8 }}>{contact.time}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {contact.lastMsg}
                    </p>
                  </div>
                  {isActive && (
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4318FF', flexShrink: 0 }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ══════════ RIGHT: CHAT ══════════ */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>

          {/* Chat header */}
          <div style={{
            height: 64, padding: '0 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: '1px solid #f1f5f9', flexShrink: 0, background: '#fff',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar letter={activeContact.initial} idx={activeContact.idx} size={38} online={activeContact.status === 'online'} />
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{activeContact.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: activeContact.status === 'online' ? '#22c55e' : '#cbd5e1' }} />
                  <span style={{ fontSize: 11, color: activeContact.status === 'online' ? '#22c55e' : '#94a3b8', fontWeight: 600 }}>
                    {activeContact.status === 'online' ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>

            {/* Header actions */}
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { icon: Icons.Phone('#4318FF'), label: 'Call' },
                { icon: Icons.Video('#4318FF'), label: 'Video' },
              ].map(({ icon, label }) => (
                <button key={label}
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    border: '1px solid #f1f5f9', background: '#f8fafc',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all .15s',
                  }}
                  title={label}
                  onMouseEnter={e => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.borderColor = '#e0e7ff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Messages thread */}
          <div ref={scrollRef} style={{
            flex: 1, overflowY: 'auto', padding: '20px 24px',
            display: 'flex', flexDirection: 'column', gap: 14,
            background: '#f8fafc',
          }}>
            {/* Date divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, height: 1, background: '#f1f5f9' }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8' }}>Today</span>
              <div style={{ flex: 1, height: 1, background: '#f1f5f9' }} />
            </div>

            {messages.map(msg => {
              const isMe = msg.sender === 'me';
              return (
                <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, maxWidth: '65%' }}>
                    {!isMe && <Avatar letter={activeContact.initial} idx={activeContact.idx} size={28} online={activeContact.status === 'online'} />}

                    <div>
                      {/* Image message */}
                      {msg.type === 'image' && (
                        <div style={{ borderRadius: 12, overflow: 'hidden', maxWidth: 240, marginBottom: 4 }}>
                          <img src={msg.url} alt={msg.text}
                            style={{ width: '100%', display: 'block', maxHeight: 200, objectFit: 'cover' }} />
                        </div>
                      )}

                      {/* File message */}
                      {msg.type === 'file' && (
                        <a href={msg.url} download={msg.text}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '12px 14px', borderRadius: 12,
                            background: isMe ? '#4318FF' : '#fff',
                            border: isMe ? 'none' : '1px solid #f1f5f9',
                            textDecoration: 'none', marginBottom: 4,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                          }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: isMe ? 'rgba(255,255,255,0.15)' : '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {Icons.File(isMe ? '#fff' : '#4318FF')}
                          </div>
                          <div>
                            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: isMe ? '#fff' : '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>{msg.text}</p>
                            {msg.fileSize && <p style={{ margin: '2px 0 0', fontSize: 10, color: isMe ? 'rgba(255,255,255,0.7)' : '#94a3b8' }}>{msg.fileSize}</p>}
                          </div>
                        </a>
                      )}

                      {/* Text message */}
                      {msg.type === 'text' && (
                        <div style={{
                          padding: '10px 15px', borderRadius: 14,
                          borderBottomRightRadius: isMe ? 4 : 14,
                          borderBottomLeftRadius: isMe ? 14 : 4,
                          background: isMe ? '#4318FF' : '#fff',
                          color: isMe ? '#fff' : '#1e293b',
                          fontSize: 13, lineHeight: 1.55,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                          border: isMe ? 'none' : '1px solid #f1f5f9',
                          wordBreak: 'break-word',
                        }}>
                          {msg.text}
                        </div>
                      )}

                      {/* Timestamp */}
                      {msg.time && (
                        <p style={{ margin: '4px 0 0', fontSize: 10, color: '#94a3b8', textAlign: isMe ? 'right' : 'left' }}>
                          {msg.time}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* File preview bar */}
          {filePreview && (
            <div style={{
              padding: '10px 20px', borderTop: '1px solid #f1f5f9',
              background: '#f8fafc', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
            }}>
              {filePreview.type === 'image' ? (
                <img src={filePreview.url} alt="preview"
                  style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', border: '1px solid #e2e8f0' }} />
              ) : (
                <div style={{ width: 40, height: 40, borderRadius: 8, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {Icons.File()}
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{filePreview.name}</p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94a3b8' }}>{filePreview.size}</p>
              </div>
              <button onClick={() => setFilePreview(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 4 }}>
                {Icons.X()}
              </button>
            </div>
          )}

          {/* Emoji picker */}
          {showEmoji && (
            <div id="emoji-picker" style={{
              position: 'absolute', bottom: 85, right: 20,
              background: '#fff', borderRadius: 14,
              border: '1px solid #f1f5f9',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              padding: '12px 14px', zIndex: 20,
              display: 'flex', flexWrap: 'wrap', gap: 6, width: 220,
            }}>
              {EMOJIS.map(e => (
                <button key={e} onClick={() => addEmoji(e)}
                  style={{
                    fontSize: 20, background: 'none', border: 'none', cursor: 'pointer',
                    padding: '4px', borderRadius: 8, transition: 'background .15s',
                    lineHeight: 1,
                  }}
                  onMouseEnter={el => el.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={el => el.currentTarget.style.background = 'none'}
                >{e}</button>
              ))}
            </div>
          )}

          {/* Input area */}
          <div style={{ padding: '14px 20px', borderTop: '1px solid #f1f5f9', background: '#fff', flexShrink: 0 }}>
            <form onSubmit={handleSend}>
              {/* Hidden inputs */}
              <input type="file" ref={fileInputRef}
                accept=".pdf,.doc,.docx,.txt,.xlsx,.pptx"
                onChange={e => handleFilePick(e, false)}
                style={{ display: 'none' }} />
              <input type="file" ref={imageInputRef}
                accept="image/*"
                onChange={e => handleFilePick(e, true)}
                style={{ display: 'none' }} />

              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#f8fafc', border: '1px solid #f1f5f9',
                borderRadius: 12, padding: '8px 12px',
                transition: 'border-color .15s',
              }}
                onFocus={e => e.currentTarget.style.borderColor = '#4318FF'}
                onBlur={e => e.currentTarget.style.borderColor = '#f1f5f9'}
              >
                {/* Paperclip */}
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  title="Attach file"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: '4px', borderRadius: 8, transition: 'background .15s', color: '#94a3b8', flexShrink: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.color = '#4318FF'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#94a3b8'; }}
                >
                  {Icons.Paperclip()}
                </button>

                {/* Image */}
                <button type="button" onClick={() => imageInputRef.current?.click()}
                  title="Send image"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: '4px', borderRadius: 8, transition: 'background .15s', color: '#94a3b8', flexShrink: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.color = '#4318FF'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#94a3b8'; }}
                >
                  {Icons.Image()}
                </button>

                {/* Text input */}
                <input ref={inputRef} type="text" value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  placeholder={`Message ${activeContact.name.split(' ')[0]}...`}
                  style={{
                    flex: 1, background: 'none', border: 'none', outline: 'none',
                    fontSize: 13, color: '#1e293b', fontFamily: 'inherit',
                  }}
                />

                {/* Emoji */}
                <button id="emoji-btn" type="button"
                  onClick={() => setShowEmoji(prev => !prev)}
                  title="Add emoji"
                  style={{
                    background: showEmoji ? '#eef2ff' : 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', padding: '4px', borderRadius: 8, transition: 'background .15s',
                    color: showEmoji ? '#4318FF' : '#94a3b8', flexShrink: 0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.color = '#4318FF'; }}
                  onMouseLeave={e => { if (!showEmoji) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#94a3b8'; } }}
                >
                  {Icons.Smile()}
                </button>

                {/* Send */}
                <button type="submit"
                  disabled={!messageText.trim() && !filePreview}
                  style={{
                    width: 34, height: 34, borderRadius: 8, border: 'none',
                    background: (messageText.trim() || filePreview) ? '#4318FF' : '#f1f5f9',
                    color: (messageText.trim() || filePreview) ? '#fff' : '#94a3b8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: (messageText.trim() || filePreview) ? 'pointer' : 'default',
                    transition: 'all .15s', flexShrink: 0,
                  }}
                  onMouseEnter={e => { if (messageText.trim() || filePreview) e.currentTarget.style.background = '#3730a3'; }}
                  onMouseLeave={e => { if (messageText.trim() || filePreview) e.currentTarget.style.background = '#4318FF'; }}
                >
                  {Icons.Send()}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>

      <style>{`* { box-sizing: border-box; }`}</style>
    </div>
  );
};

export default StudentMessages;