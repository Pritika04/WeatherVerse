import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from "lucide-react";
import { useLocation } from "react-router-dom";
import SearchPopup from './SearchPopup'; 
import '../styles/dashboard.css';

export default function Dashboard() {
    const location = useLocation();
    const user = location.state.user;

    const [showPopup, setShowPopup] = useState(false);

    return (
        <div className="dashboard">
            <div className="left-column">
                <div className="map-placeholder">World Map Placeholder</div>
            </div>

            <div className="right-column">
                <div className="welcome">
                    <p>Welcome, {user.name || "Guest"}</p>
                    <img 
                        className="profile-image"
                        src={`/avatars/${user.avatar}` || "/avatars/avatar1.png"} 
                        alt="Profile" 
                    />
                </div>

                <div className="add-contact">
                    <button className="add-button" onClick={() => setShowPopup(true)}>
                        <Plus size={20} />
                    </button>
                    <div>
                        {showPopup && (
                            <SearchPopup
                                onClose={() => setShowPopup(false)}
                                currentUser={user}
                            />
                        )}
                    </div>
                    <p>Add contact</p>
                </div>
            </div>
        </div>
    );
}