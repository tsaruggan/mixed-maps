import React, { Component } from 'react';
import RouteBuildingBlock from './RouteBuildingBlock';
import styles from "@/styles/Home.module.css";

const defaultMode = "transit"

class RouteBuilder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addresses: ["", ""],
            modes: [defaultMode]
        };
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.handleModeChange = this.handleModeChange.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleRoute = this.handleRoute.bind(this);
    }

    handleAddressChange(index, addressType, value) {
        const newAddresses = [...this.state.addresses];

        if (addressType == "starting") {
            newAddresses[index] = value;
        } else if (addressType == "destination") {
            newAddresses[index+1] = value;
        }
        this.setState({ addresses: newAddresses });
    }

    handleModeChange(index, value) {
        const newModes = [...this.state.modes];
        newModes[index] = value
        this.setState({ modes: newModes });
    }

    handleAdd() {
        const newAddresses = [...this.state.addresses];
        newAddresses.push("");

        const newModes = [...this.state.modes];
        newModes.push(defaultMode);

        this.setState({ addresses: newAddresses, modes: newModes });
    }

    handleRoute() {
        this.props.onRoute(this.state.addresses, this.state.modes);
    }

    render() {
        const addDisabled = this.state.addresses.at(-1) == "" || this.state.addresses.at(-2) == "";
        return (
            <div className={styles.routeBuilder}>
                {this.state.addresses.slice(0, -1).map((_, index) => (
                    <RouteBuildingBlock
                        key={index}
                        index={index}
                        startingAddress={this.state.addresses[index]}
                        destinationAddress={this.state.addresses[index+1]}
                        mode={this.state.modes[index]}
                        onAddressChange={this.handleAddressChange}
                        onModeChange={this.handleModeChange}
                    />
                ))}
                <div style={{display: 'flex', justifyContent: 'end', width: '100%'}}>
                    <ActionButton 
                        text={"Add +"} 
                        handleOnClick={this.handleAdd}
                        backgroundColor={"rgba(115, 200, 144, 1)"}
                        disabled={addDisabled}
                    />
                    <ActionButton 
                        text={"Route"} 
                        handleOnClick={this.handleRoute}
                        backgroundColor={"rgba(121, 196, 229, 1)"}
                        disabled={addDisabled}
                    />
                </div>
                
            </div>
        );
    }
}

export default RouteBuilder;


function ActionButton({ text, handleOnClick, backgroundColor, disabled }) {
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
