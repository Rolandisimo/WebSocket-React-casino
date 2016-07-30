import React, { PropTypes, Component } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin';




const hideLabel = (e) => {
    let label = e.target.nextSibling;

    if (e.target.value) {
        label.style.opacity = '0';
    } else {
        label.style.opacity = '1';
    }
};



class AddTable extends Component {
    constructor(props) {
        super(props)

        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    render() {
        return (
            <form ref="addTableForm" name="addTableForm" onSubmit={e => e.preventDefault()} className="form-inline">
                <div className="form-group field_custom_wrapper">
                    <input ref="tableName" type="text" onChange={hideLabel} name="tableName" className="form-control field_custom"/>
                    <label htmlFor="tableName" className="label_custom">Table Name</label>
                </div>
                <button type="button" onClick={this.props.addTable} className="btn btn-success" style={{marginLeft: 10}}>
                    Add Table
                </button>
            </form>
        )
    }
}





export default AddTable
