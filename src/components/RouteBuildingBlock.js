import React, { Component } from 'react';

class RouteBuildingBlock extends Component {
    render() {
        return (
            <div style={styles.routeBuildingBlock}>
                <div style={{height: '84px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                    <AddressTextField name="starting" placeholder="Choose starting point..." />
                    <AddressTextField name="destination" placeholder="Choose destination..." />
                </div>
                <div style={{width: '400px', display: 'flex', justifyContent: 'space-between', paddingTop: '16px'}}>
                    <TransportOptionButton text="Driving" rgb="38, 70, 83" isActive={true}/>
                    <TransportOptionButton text="Transit" rgb="42, 157, 143" isActive={false}/>
                    <TransportOptionButton text="Biking" rgb="233, 196, 106" isActive={false}/>
                    <TransportOptionButton text="Walking" rgb="244, 162, 97" isActive={false}/>
                </div>
            </div>
        );
    }
}

export default RouteBuildingBlock;


function AddressTextField({ name, placeholder }) {
    return (
        <input 
            type="text" 
            style={styles.addressTextField} 
            name={name}
            placeholder={placeholder}
        />
    );
}

function TransportOptionButton({ text, rgb, isActive }) {
    const alpha = isActive ? 0.6 : 0.2;
    const backgroundColor = `rgba(${rgb}, ${alpha})` 
    const buttonStyle = {
        ...styles.transportOptionButton,
        backgroundColor: backgroundColor, 
    };
    if (isActive) {
        Object.assign(buttonStyle, styles.active); 
    }
    return (
        <button style={buttonStyle}> {text}</button>
    );
}

const styles = {
    routeBuildingBlock: {
      backgroundColor: 'rgba(38, 70, 83, 0.25)',
      width: '468px',
      height: '166px',
      borderRadius: '4px',
      padding: '16px'
    },
    addressTextField: {
      width: '400px',
      height: '36px',
      borderRadius: '4px',
      boxSizing: 'border-box',
      background: '#FFFFFF',
      border: '1px solid #000000',
      padding: '14px'
    },
    addressTextFieldFocus: {
      outline: 'none'
    },
    transportOptionButton: {
      width: '88px',
      height: '36px',
      border: '1.5px solid rgba(0, 0, 0, 0.5)',
      borderRadius: '36px',
      fontWeight: '500',
      color: 'rgba(0, 0, 0, 0.5)'
    },
    active: {
      border: '2px solid #000000',
      fontWeight: '600',
      color: '#000000'
    }
  };
  