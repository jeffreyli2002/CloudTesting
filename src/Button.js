import React from "react";
import PropTypes from "prop-types";

export default class Button extends React.Component{
    static propTypes = {
        name: PropTypes.string,
        clickHandler: PropTypes.func,
    };

    render(){
        const className = [
            "component-button"
        ];

        return(
            <div className={className.join(" ").trim()}>
                <button onClick={this.handleClick}>{this.props.name}</button>
            </div>
        );
    }
}