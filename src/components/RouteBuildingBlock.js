import React, { Component } from 'react';
import styles from "@/styles/Home.module.css";

const transportOptions = [
    { name: "Driving", color: "38, 70, 83" },
    { name: "Transit", color: "42, 157, 143" },
    { name: "Biking", color: "233, 196, 106" },
    { name: "Walking", color: "244, 162, 97" }
]

class RouteBuildingBlock extends Component {

    constructor(props) {
        super(props);
        this.state = {
          selectedTransportOption: "Driving"
        };
    }

    handleAddressTextFieldChange(addressType, event){
        this.props.onAddressChange(this.props.index, addressType, event.target.value);
    };

    render() {
        const backgroundColor = `rgba(${transportOptions.find(option => option.name == this.state.selectedTransportOption).color}, 0.25)`;
        return (
            <div className={styles.routeBuildingBlock} style={{backgroundColor: backgroundColor}}>
                <div style={{height: '84px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                    <AddressTextField 
                        name="starting" 
                        placeholder="Choose starting point..."
                        value={this.props.startingAddress}
                        onChange={(e) => this.handleAddressTextFieldChange('startingAddress', e)}
                        disabled={this.props.index != 0}
                    />
                    <AddressTextField 
                        name="destination" 
                        placeholder="Choose destination..."
                        value={this.props.destinationAddress}
                        onChange={(e) => this.handleAddressTextFieldChange('destinationAddress', e)} 
                        disabled={false}
                    />
                </div>
                <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', paddingTop: '16px'}}>
                    {transportOptions.map((option) => (
                        <TransportOptionButton 
                            key={option.name}
                            transportOption={option} 
                            isActive={option.name == this.state.selectedTransportOption}
                            handleOnClick={(e) => this.setState({selectedTransportOption: option.name})}
                        />
                    ))}
                </div>
            </div>
        );
    }
}

export default RouteBuildingBlock;


function AddressTextField({ name, placeholder, value, onChange, disabled }) {
    return (
        <input 
            type="text" 
            className={styles.addressTextField} 
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
        />
    );
}

function TransportOptionButton({ transportOption, isActive, handleOnClick }) {
    const alpha = isActive ? 0.6 : 0.2;
    const backgroundColor = `rgba(${transportOption.color}, ${alpha})` 
    const buttonStyle = {
        backgroundColor: backgroundColor, 
    };
    return (
        <button 
            className={`${styles.transportOptionButton} ${isActive ? styles.active : ''}`} 
            style={buttonStyle} 
            onClick={handleOnClick}> 
            {transportOption.name}
        </button>
    );
}
