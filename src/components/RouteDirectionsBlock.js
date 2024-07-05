import React, { Component, useState } from 'react';
import styles from "@/styles/Home.module.css";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
const walkingIconSrc = "//maps.gstatic.com/mapfiles/transit/iw2/svg/walk.svg";

import DetailedInstructions from './DetailedInstructions';

export default function RouteDirectionsBlock({ index, travelMode, title, eta, duration, distance, color, instructions, startAddress, endAddress }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const renderTransitCommuteIconPreview = () => {
        const walkingThresholdDuration = 300;
        return (
            <span className={styles.transitCommuteIconPreview}>
                {instructions.map((instruction, index) => {
                    if (instruction.mode === 'walking' && instruction.duration.value < walkingThresholdDuration) {
                        return null;
                    }

                    return (
                        <React.Fragment key={index}>
                            {instruction.mode === 'walking' ? (
                                <img src={walkingIconSrc} className={styles.transitCommuteIcon} />
                            ) : (
                                <>
                                    <img src={instruction.transitDetails.vehicle.localIcon} className={styles.transitCommuteIcon} />
                                    <img src={instruction.transitDetails.vehicle.icon} className={styles.transitCommuteIcon} />
                                </>
                            )}
                            {index < instructions.length - 1 && (
                                <>
                                    {index === instructions.length - 2 && instructions[index + 1].mode === 'walking' && instructions[index + 1].duration.value < walkingThresholdDuration ? (
                                        <></>
                                    ) : (
                                        <span style={{ height: '100%', width: 'auto', display: 'flex', alignItems: 'center' }}>{">"}</span>
                                    )}
                                </>
                            )}

                        </React.Fragment>
                    );
                })}
            </span>
        );
    };

    return (
        <div className={styles.routeDirectionsBlock} style={{ backgroundColor: color }} >
            <div className={styles.routeDirectionsBlockTitle} onClick={toggleExpand}>
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <NumberedChevron number={index+1} expanded={isExpanded}/>
                    <div>
                        <p style={{ fontWeight: '700' }}>{title}</p>
                        <p>ETA {eta}</p>
                    </div>
                </div>

                <div style={{ textAlign: 'end', height: '16px' }}>
                    <p style={{ fontWeight: '700' }}>{duration}</p>
                    {travelMode == 'transit' ? renderTransitCommuteIconPreview(instructions) : <p>{distance}</p>}

                </div>
            </div>
            {isExpanded && (
                <DetailedInstructions
                    travelMode={travelMode}
                    instructions={instructions}
                    startAddress={startAddress}
                    endAddress={endAddress}
                />
            )}
        </div>
    );
}

const NumberedChevron = ({ number, expanded }) => {
    const containerStyle = {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        width: '16px',
        height: '32px',
        marginRight: '8px',
        gap: '3px'
    };

    const numberContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '16px',
        height: '16px',
    };

    const numberStyle = {
        width: '16px', // Reduced width
        height: '16px', // Reduced height
        borderRadius: '50%',
        border: '2px solid black',
        color: 'black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px', // Adjusted font size
        fontWeight: '600',
        backgroundColor: 'transparent',
    };

    const iconContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '12px',
        height: '12px',
    };

    const iconStyle = {
        fontSize: '12px',
        color: 'black',
    };

    return (
        <div style={containerStyle}>
            <div style={numberContainerStyle}>
                <div style={numberStyle}>{number}</div>
            </div>
            <div style={iconContainerStyle}>
                {expanded ? <FaChevronDown style={iconStyle} /> : <FaChevronRight style={iconStyle} />}
            </div>
        </div>
    );
};