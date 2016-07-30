import React, { PropTypes, Component } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin';





class Player extends Component {
    constructor(props) {
        super(props);

        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
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
