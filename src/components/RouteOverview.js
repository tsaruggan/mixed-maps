import React, { Component, useState } from 'react';
import styles from "@/styles/Home.module.css";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

const travelModes = [
    { name: "driving", color: "rgba(38, 70, 83, 0.25)" },
    { name: "transit", color: "rgba(42, 157, 143, 0.25)" },
    { name: "bicycling", color: "rgba(233, 196, 106, 0.25)" },
    { name: "walking", color: "rgba(244, 162, 97, 0.25)" }
]

const walkingIconSrc = "//maps.gstatic.com/mapfiles/transit/iw2/svg/walk.svg";

class RouteOverview extends Component {
    render() {
        return (
            <div className={styles.routeOverviewContainer}>
                <div className={styles.routeDetailsContainer}>
                    <div className={styles.routeDetailsTitleContainer}>
                        <p>ETA 3:58 PM – Jun 23, 2024</p>
                        <p>1 hr 58 min commute</p>
                    </div>

                    {this.props.directions.map((direction, index) => (
                        <RouteDirectionsBlock
                            key={index}
                            index={index}
                            travelMode={direction.travelMode}
                            title={direction.title}
                            eta={direction.eta.text}
                            duration={direction.duration.text}
                            distance={direction.distance.text}
                            color={travelModes.find(mode => mode.name === direction.travelMode).color}
                            instructions={direction.instructions}
                            startAddress={direction.startAddress}
                            endAddress={direction.endAddress}
                        />
                    ))}
                </div>
            </div>
        );
    }
}

export default RouteOverview;

function RouteDirectionsBlock({ index, travelMode, title, eta, duration, distance, color, instructions, startAddress, endAddress }) {
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

function DetailedInstructions({ travelMode, instructions, startAddress, endAddress }) {

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