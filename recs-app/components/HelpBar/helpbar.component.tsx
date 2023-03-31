import React, { useState } from 'react';
import styles from './helpbar.module.css';

function HelpBar() {
    const [algorithm, setAlgorithm] = useState('KNN'); // default to KNN algorithm

    function handleAlgorithmToggle(e: React.ChangeEvent<HTMLSelectElement>) {
        setAlgorithm(e.target.value);
    }

    return (
        <div className={styles.helpbar}>
            <div className={styles.dropdown}>
                <button className={styles.dropbtn}>❓</button>
                <div className={styles.dropdownContent}>
                    <a href="#">I need help</a>

                    <div className={"container"}>
                        <label>
                            Method:
                            <select value={algorithm} onChange={handleAlgorithmToggle}>
                                <option value="KNN">User-based KNN</option>
                                <option value="random">Random</option>
                            </select>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HelpBar;