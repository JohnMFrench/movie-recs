import React from 'react';

function Navbar() {
    return (
        <div className="navbar">
            <div className="dropdown">
                <button className="dropbtn">❓</button>
                <div className="dropdown-content">
                    <a href="#">I need help</a>
                </div>
            </div>
        </div>
    );
}

export default Navbar;