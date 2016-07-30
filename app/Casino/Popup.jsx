import React, { PropTypes, Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';




class Popup extends Component {
    constructor(props) {
        super(props);

        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    render() {
        return (
            <div>
                {
                    this.props.success
                    ?
                    <div className="alert alert-success alert-dismissible" role="alert">
                        <i
                            className="fa fa-times close"
                            aria-hidden="true"
                            onClick={this.props.dismissPopup} />
                        <strong>Succeeded to complete action!</strong>
                    </div>
                    :
                    <div className="alert alert-warning alert-dismissible" role="alert">
                        <i
                            className="fa fa-times close"
                            aria-hidden="true"
                            onClick={this.props.dismissPopup} />
                        <strong>Failed to complete action. Please try again later!</strong>
                    </div>

                }
            </div>
        )
    }
}





export default Popup
