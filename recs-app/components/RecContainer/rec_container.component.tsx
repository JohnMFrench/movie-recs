import React, { useEffect, useState } from "react";
import styles from "./rec_container.module.css";

interface RecContainerProps {
    type: string;
    user1_id: string;
    user2_id: string;
    visible: boolean;
}

function RecContainer(props: RecContainerProps) {
    return (
        <>
            {props.visible && (
                <div className={styles.RecContainer}>{props.type + " recommendation"}</div>
            )}
        </>
    );
}

export default RecContainer;
