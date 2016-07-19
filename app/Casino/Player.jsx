import React, { PropTypes, Component } from 'react'
import shallowCompare from 'react-addons-shallow-compare';





class Player extends Component {
    constructor(props) {
        super(props)
    }
    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }
    render() {
        return (
            <div className={this.props.status + " player"}>
                <i className="fa fa-user" aria-hidden="true"></i>
            </div>
        )
    }
}




export default Player
