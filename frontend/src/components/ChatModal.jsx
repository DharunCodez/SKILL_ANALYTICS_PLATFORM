import { useState, useEffect, useRef } from 'react';
import * as api from '../services/api';

const ChatModal = ({ isOpen, onClose, otherUser, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (isOpen && otherUser) {
            fetchMessages();
            // In a real app, use WebSockets here for live updates. Using polling for simplicity based on the current stack.
            const interval = setInterval(fetchMessages, 3000);
            return () => clearInterval(interval);
        }
    }, [isOpen, otherUser]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const { data } = await api.getMessages(otherUser._id);
            setMessages(data);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setLoading(true);
        try {
            const { data } = await api.sendMessage(otherUser._id, newMessage);
            setMessages([...messages, data]);
            setNewMessage('');
        } catch (err) {
            console.error("Failed to send message", err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !otherUser) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col h-[500px] overflow-hidden">
                
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/80">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                            {otherUser.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-sm">{otherUser.name}</h3>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{otherUser.role}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors bg-slate-700/30 hover:bg-slate-700 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0a0a]">
                    {messages.length === 0 ? (
                         <div className="h-full flex items-center justify-center text-slate-500 text-sm font-medium">
                             Start a conversation!
                         </div>
                    ) : (
                        messages.map((msg, idx) => {
                            // Backend populate returns sender as string ID initially, then object from populate.
                            const isMe = msg.sender._id ? msg.sender._id === currentUser._id : msg.sender === currentUser._id;
                            
                            return (
                                <div key={msg._id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] px-4 py-2 text-sm shadow-md ${isMe ? 'bg-cyan-600 text-white rounded-2xl rounded-br-sm' : 'bg-slate-800 text-slate-200 rounded-2xl rounded-bl-sm border border-slate-700'}`}>
                                        <p className="leading-relaxed">{msg.text}</p>
                                        <span className={`text-[9px] block mt-1 ${isMe ? 'text-cyan-200 text-right' : 'text-slate-400'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            )
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input form */}
                <form onSubmit={handleSend} className="p-4 border-t border-slate-700/50 bg-slate-800/80 flex gap-2">
                    <input 
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm shadow-inner"
                    />
                    <button 
                        type="submit" 
                        disabled={!newMessage.trim() || loading}
                        className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:opacity-50 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-cyan-500/20"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatModal;
