import React, { Component, useState } from 'react';
import styles from "@/styles/Home.module.css";

export default function DetailedInstructions({ travelMode, instructions, startAddress, endAddress }) {

    const renderGeneralInstruction = (instruction, index) => {
        return (
            <div key={index}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div
                        className={styles.instructionText}
                        dangerouslySetInnerHTML={{ __html: instruction.description }}
                        style={{ maxWidth: '288px' }}
                    />
                    <div className={styles.durationDistance}>
                        <span>{instruction.duration.text}</span>
                        <span style={{ marginLeft: '2px' }}>{`(${instruction.distance.text})`}</span>
                    </div>

                </div>
            </div>
        );
    }

    const renderInstructions = () => {
        return (
            <div className={styles.routeDirectionsInstructionsContainer}>
                <div style={{ fontWeight: '700', marginBottom: '6px' }}>
                    {startAddress}
                </div>

                {instructions.map((instruction, index) => (
                    renderGeneralInstruction(instruction, index)
                ))}

                <div style={{ fontWeight: '700', marginTop: '4px' }}>
                    {endAddress}
                </div>
            </div>
        );
    };

    const renderShortName = (shortName, color) => {
        if (shortName) {
            return (
                <div style={{
                    backgroundColor: `${color ? color : 'rgba(166, 166, 166, 0.15)'}`,
                    color: 'black',
                    paddingLeft: '3px',
                    paddingRight: '3px',
                    borderRadius: '2px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    {shortName}
                </div>
            );
        } else {
            return (<></>);
        }
    }

    const renderIcon = (icon) => {
        if (icon) {
            return (
                <img src={icon} style={{ height: '100%', width: 'auto' }} />
            );
        } else {
            return (<></>);
        }
    }


    const renderTransitInstructions = () => {
        return (
            <div className={styles.routeDirectionsInstructionsContainer} >
                <div style={{ fontWeight: '700', marginBottom: '6px' }}>
                    {startAddress}
                </div>

                {instructions.map((instruction, index) => {

                    if (instruction.mode === 'transit') {
                        return (
                            <div key={index} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', lineHeight: '16px', marginTop: '16px', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', textAlign: 'left', maxWidth: '248px' }}>
                                        <div>{`${instruction.departureStop} → ${instruction.arrivalStop} ${instruction.transitDetails.numStops ? `(${instruction.transitDetails.numStops} stops)` : ''}`}</div>
                                        <span style={{ display: 'flex', justifyContent: 'flex-start', height: '16px', gap: '4px' }}>
                                            {renderIcon(instruction.transitDetails.vehicle.localIcon)}
                                            {renderIcon(instruction.transitDetails.vehicle.icon)}
                                            {renderShortName(instruction.transitDetails.shortName, instruction.transitDetails.color)}
                                            <div>
                                                {instruction.description}
                                            </div>
                                        </span>
                                    </div>


                                    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                                        <span>{`${timeFormat(instruction.departureTime.text)} - ${timeFormat(instruction.arrivalTime.text)}`}</span>
                                        <span>{`${instruction.duration.text}`}</span>
                                    </div>
                                </div >
                            </div>



                        );
                    } else {
                        return renderGeneralInstruction(instruction, index);
                    }
                })}

                <div style={{ fontWeight: '700', marginTop: '4px' }}>
                    {endAddress}
                </div>
            </div >
        );
    };

    if (travelMode === 'transit') {
        return renderTransitInstructions();
    } else {
        return renderInstructions();
    }
}


function timeFormat(time) {
    return time.replace('a.m.', 'AM').replace('p.m.', 'PM');
}