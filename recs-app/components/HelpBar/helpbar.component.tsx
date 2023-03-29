import React from 'react';

function HelpBar() {
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

export default HelpBar;