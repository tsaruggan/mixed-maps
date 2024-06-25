import React, { Component } from 'react';
import RouteBuildingBlock from './RouteBuildingBlock';
import styles from "@/styles/Home.module.css";

class RouteBuilder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            routes: [
                { startingAddress: '', destinationAddress: '' },
            ]
        };
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
    }

    handleAddressChange(index, addressType, value) {
        const newRoutes = [...this.state.routes];
        newRoutes[index][addressType] = value;

        // Propagate changes to subsequent blocks if updating destination address
        if (addressType === 'destinationAddress' && index < newRoutes.length - 1) {
            newRoutes[index + 1].startingAddress = value;
        }

        this.setState({ routes: newRoutes });
    }

    handleAdd() {
        const lastRoute = this.state.routes.at(-1);
        const newRoute = { startingAddress: lastRoute.destinationAddress, destinationAddress: '' }
        const newRoutes = [...this.state.routes];
        newRoutes.push(newRoute);
        this.setState({ routes: newRoutes });
    }

    render() {
        const addDisabled = this.state.routes.at(-1).startingAddress == '' || this.state.routes.at(-1).destinationAddress == '';
        return (
            <div className={styles.routeBuilder}>
                {this.state.routes.map((route, index) => (
                    <RouteBuildingBlock
                        key={index}
                        index={index}
                        startingAddress={route.startingAddress}
                        destinationAddress={route.destinationAddress}
                        onAddressChange={this.handleAddressChange}
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
