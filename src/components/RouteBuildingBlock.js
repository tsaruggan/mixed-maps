import React, { Component } from 'react';
import styles from "@/styles/Home.module.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import AddressTextField from './AddressTextField';

const modes = [
    { name: "driving", color: "38, 70, 83", title: "Driving" },
    { name: "transit", color: "42, 157, 143", title: "Transit" },
    { name: "bicycling", color: "233, 196, 106", title: "Biking" },
    { name: "walking", color: "244, 162, 97", title: "Walking" }
];

class RouteBuildingBlock extends Component {
    constructor(props) {
        super(props);
    }

    handleAddressTextFieldChange(addressType, value) {
        this.props.onAddressChange(this.props.index, addressType, value);
    }

    handleModeOptionChange(mode) {
        this.props.onModeChange(this.props.index, mode);
    }

    renderDeleteButton(backgroundColor, deletable) {
        const buttonClass = `${styles.routeBuildingBlockGarbageButtonContainer} ${!deletable ? styles.disabled : ""}`;
        const buttonStyle = {
            backgroundColor: deletable ? backgroundColor : 'transparent'
        };
    
        return (
            <button disabled={!deletable} className={buttonClass} style={buttonStyle} onClick={this.props.onDelete}>
                <FaTrashAlt style={{ width: '16px', height: '16px', visibility: deletable ? 'visible' : 'hidden' }} />
            </button>
        );
    }    

    render() {
        const backgroundColor = `rgba(${modes.find(option => option.name === this.props.mode).color}, 0.25)`;
        return (
            <div className={styles.routeBuildingBlock} style={{ backgroundColor }}>
                <div className={styles.routeBuildingBlockForm}>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <NumberedMarker number={this.props.index + 1} />
                        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <AddressTextField
                                name="starting"
                                placeholder="Choose starting point..."
                                value={this.props.startingAddress}
                                onChange={(newValue) => this.handleAddressTextFieldChange('starting', newValue)}
                                disabled={this.props.index !== 0}
                            />
                            <AddressTextField
                                name="destination"
                                placeholder="Choose destination..."
                                value={this.props.destinationAddress}
                                onChange={(newValue) => this.handleAddressTextFieldChange('destination', newValue)}
                                disabled={false}
                            />
                        </div>
                    </div>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', paddingTop: '16px' }}>
                        {modes.map((option) => (
                            <ModeOptionButton
                                key={option.name}
                                mode={option}
                                isActive={option.name === this.props.mode}
                                handleOnClick={() => this.handleModeOptionChange(option.name)}
                            />
                        ))}
                    </div>
                </div>
                {this.renderDeleteButton(backgroundColor, this.props.deletable)}
            </div>
        );
    }
}

export default RouteBuildingBlock;

function ModeOptionButton({ mode, isActive, handleOnClick }) {
    const alpha = isActive ? 0.6 : 0.2;
    const backgroundColor = `rgba(${mode.color}, ${alpha})`;
    return (
        <button
            className={`${styles.modeOptionButton} ${isActive ? styles.active : ''}`}
            style={{ backgroundColor }}
            onClick={handleOnClick}>
            {mode.title}
        </button>
    );
}

const NumberedMarker = ({ number }) => {
    const containerStyle = {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        width: '24px',
        height: '84px',
        paddingTop: '10px',
        paddingBottom: '8px',
        marginRight: '8px',
    };

    const numberContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
    };

    const numberStyle = {
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        border: '2px solid black',
        color: 'black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: 'transparent',
    };

    const dottedLineStyle = {
        borderLeft: '3px dotted black',
        flexGrow: 1,
        margin: '1px 0',
    };

    const iconContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
    };

    const iconStyle = {
        fontSize: '16px',
        color: 'black',
    };

    return (
        <div style={containerStyle}>
            <div style={numberContainerStyle}>
                <div style={numberStyle}>{number}</div>
            </div>
            <div style={dottedLineStyle}></div>
            <div style={iconContainerStyle}>
                <FaMapMarkerAlt style={iconStyle} />
            </div>
        </div>
    );
};
