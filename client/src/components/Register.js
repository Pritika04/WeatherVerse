import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/register.css';

const avatarList = [
    'avatar1.png', 'avatar2.png', 'avatar3.png', 'avatar4.png', 'avatar5.png', 'avatar6.png', 'avatar7.png',
    'avatar8.png', 'avatar9.png', 'avatar10.png', 'avatar11.png', 'avatar12.png', 'avatar13.png', 
    'avatar14.png', 'avatar15.png', 'avatar16.png'
];

export default function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: '',
        avatar: ''
    });

    const [errors, setErrors] = React.useState({}); 

    const handleAvatarClick = (avatar) => {
        setFormData({...formData, avatar: avatar});
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required!"; 
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required!"; 
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required!"; 
        } else if (formData.password.length < 5) {
            newErrors.password = "Password must be at least 6 characters long"; 
        }

        if (!formData.avatar) {
            newErrors.avatar = "An avatar must be selected!"; 
        }

        return newErrors; 
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate(); 

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return; 
        }

        setErrors({}); 

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json(); 

            if (response.ok) {
                console.log("Registration successful!"); 
                navigate('/Login');
              } else {
                alert("Registration failed.");
                console.log(data.message);
            }
        } catch (err) {
            alert("An error occurred. Please try again.");
            console.error(err);
        }
    }

    return (
        <div className="register-card">
            <h2>Welcome to WeatherVerse!</h2>

            <form onSubmit={handleSubmit}> 
                <span className="error-text">{errors.name}</span>
                <input 
                    type="text" 
                    placeholder="name*" 
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />

                <span className="error-text">{errors.email}</span>
                <input 
                    type="email" 
                    placeholder="email*"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                />

                <span className="error-text">{errors.password}</span>
                <input 
                    type="password" 
                    placeholder="password*" 
                    name="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                
                <div className="avatar-header">
                    <label className="avatar-label">Pick your avatar*:</label>
                    <span className="error-text">{errors.avatar}</span>
                </div>
                <div className="avatar-options">
                    {avatarList.map((avatar) => (
                        <img 
                            key={avatar}
                            src={`/avatars/${avatar}`}
                            alt={avatar}
                            className={`avatar-img ${formData.avatar === avatar ? 'selected' : ''}`}
                            onClick={() => handleAvatarClick(avatar)}
                        />
                    ))}
                </div>

                <button type="submit">Sign Up!</button>
            </form>

            <p className="login-link">
                <Link to="./Login">Or Sign In!</Link>
            </p>
        </div>
    );
}