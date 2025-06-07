import React, { useState } from 'react';
import { X, Search } from "lucide-react";
import Cookies from "universal-cookie";
import '../styles/search-popup.css';

export default function SearchPopup({ onClose, currentUser }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(false); 

    const cookies = new Cookies();
    const token = cookies.get("TOKEN");

    React.useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (query.trim() === '') {
                setResults([]);
                setLoading(false);
                return;
            }

            setLoading(true);

            const fetchUsers = async () => {
                try {
                    const res = await fetch(`${process.env.REACT_APP_API_URL}/users/search?query=${query}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const data = await res.json();  
                    setResults(data.users || []);
                    setTimeout(() => setLoading(false), 0); // hacky - works very briefly but not good
                } catch(error) {
                    console.error('Search failed:', error);
                    setResults([]);
                    setLoading(false);
                } 
                // finally {
                //     setLoading(false);
                // }
            };

            fetchUsers(); 
        }, 1000); // 1 second = 1000 milliseconds

        return () => clearTimeout(delayDebounce);
    }, [query]);

    const toggleUser = (user) => {
        if (selectedUsers.some((u) => u._id === user._id)) {
            setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
        } else {
            const input = prompt(`Rename contact "${user.name}"? Leave blank to keep original name:`);
            const newName = input?.trim() || null;

            setSelectedUsers([...selectedUsers, {
                user,
                nickname: newName
            }]);
        }
    }

    const handleAddAll = async () => {
        try {
            const friendsToSend = selectedUsers.map(({ user, nickname }) => ({
                friendId: user._id,
                customName: nickname || user.name 
            }));

            const res = await fetch(`${process.env.REACT_APP_API_URL}/users/friends`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ friends: friendsToSend })
            });

            if (!res.ok) {
                throw new Error('Failed to update friends');
            }

            const data = await res.json();

            alert("Added!");
            setSelectedUsers([]);
            onClose(); 
        } catch(error) {
            console.error('Search failed:', error);
            alert('Error adding friends'); 
        } 
    }

    return (
        <div className="popup-overlay">
            <div className="popup">
                <button className="close-button" onClick={onClose}>
                    <X color="red" size={25} strokeWidth={3} />
                </button>

                <div className="search-wrapper">
                    <input
                        className="search-input"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value.trim().toLowerCase())}
                        placeholder="Search users by name or email"
                    />
                    <Search className="search-icon" />
                </div>


                <ul className="search-results">
                    {query.trim() === '' ? null : loading? (
                        <li className="no-results">Loading...</li>
                    ) : !loading && results.filter(user => user._id !== currentUser._id).length === 0 ? (
                        <li className="no-results">no users found :/</li>
                    ) : (
                        results
                            .filter(user => user._id !== currentUser._id)
                            .map((user) => {
                                return (
                                    <li
                                        key={user._id}
                                        onClick={() => toggleUser(user)}
                                        className={selectedUsers.some((u) => u._id === user._id) ? "selected" : ""}
                                    >
                                        <img
                                            src={`/avatars/${user.avatar}`} 
                                            alt={`${user.name}'s avatar`} 
                                            style={{ width: 40, height: 30, borderRadius: '50%', marginRight: 8 }}
                                        />
                                        {user.name}
                                    </li>
                                );
                            })
                        )
                    }
                </ul>

                {selectedUsers.length > 0 && (
                    <div className="selected-users">
                        <div className="user-tags">
                            {selectedUsers.map(({ user, nickname }) => (
                                <span key={user._id} className="user-tag">
                                    <img
                                        src={`/avatars/${user.avatar}`} 
                                        alt={`${user.name}'s avatar`} 
                                        style={{ width: 40, height: 30, borderRadius: '50%', marginRight: 8 }}
                                    />
                                    {user.name} ({nickname})
                                    <button className="remove-btn" onClick={() => toggleUser(user)}>×</button>
                                </span>
                            ))}
                        </div>
                        <button className="add-btn" onClick={handleAddAll}>Add All to My List</button>
                    </div>

                )}
            </div>
        </div>
    );

} 