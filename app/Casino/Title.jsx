import React, { PropTypes, Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';





class Title extends Component {
    constructor(props) {
        super(props);

        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    render() {
        return (
            <h1 className="text-center">Active Tables: {this.props.tableCount}</h1>
        );
    }
}





export default Title;
