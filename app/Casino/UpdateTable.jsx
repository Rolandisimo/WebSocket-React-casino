import React, { PropTypes, Component } from 'react'





const hideLabel = (e) => {
    let label = e.target.nextSibling;

    if (e.target.value) {
        label.style.opacity = '0';
    } else {
        label.style.opacity = '1';
    }
};

class UpdateTable extends Component {
    constructor(props) {
        super(props)
    }
    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }
    render() {
        return (
            <form name="updateTableForm" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group field_custom_wrapper">
                    <input type="text" onChange={hideLabel} name="tableName" className="form-control field_custom"/>
                    <label htmlFor="tableName" className="label_custom" style={{opacity:0}}>Edit Table Name</label>
                </div>
                <button type="button" onClick={this.props.updateTable} className="btn btn-default" style={{marginLeft: 10}}>
                    Update Table
                </button>
                <button type="button" onClick={this.props.cancelUpdate} className="btn btn-primary" style={{marginLeft: 10}}>
                    Cancel
                </button>
            </form>
        )
    }
}





export default UpdateTable
