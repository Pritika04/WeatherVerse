import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "universal-cookie";
import '../styles/login.css';

export default function Login() {
    const navigate = useNavigate();
    const cookies = new Cookies();

    const [formData, setFormData] = React.useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json(); 

            if (response.ok) {
                console.log("Login successful!"); 
                cookies.set("TOKEN", data.token, {
                    path: "/",
                    maxAge: 86400,
                });
                navigate('/Dashboard');
              } else {
                if (response.status === 404) {
                    alert("User not found. Please register.");
                    navigate('/');
                } else if (response.status === 400) {
                    alert("Incorrect password. Please try again.");
                } else {
                    alert("Login failed. Please try again later.");
                    console.log(data.message);
                }
            }

        } catch (err) {
            alert("An error occurred. Please try again.");
            console.error(err);
        }
    }

    return (
        <div className="login-card">
            <h2>Welcome to WeatherVerse!</h2>

            <form onSubmit={handleSubmit}> 
                <input 
                    type="email" 
                    placeholder="email*"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />

                <input 
                    type="password" 
                    placeholder="password*" 
                    name="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />

                <button type="submit">Sign In!</button>
            </form>
        </div>
    );
}