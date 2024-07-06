import React, { Component } from 'react';
import styles from "@/styles/Home.module.css";

export default function ActionButton({ text, handleOnClick, backgroundColor, disabled }) {
    return (
        <button 
            className={styles.actionButton} 
            style={{ backgroundColor: disabled ? "rgba(166, 166, 166, 0.25)" : backgroundColor }} 
            onClick={handleOnClick}
            disabled={disabled}
        > 
            {text}
        </button>
    );
}