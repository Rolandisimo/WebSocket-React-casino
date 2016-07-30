import React, { PropTypes, Component } from 'react'
import { hashHistory } from 'react-router'
import Table from './Table.jsx'
import AddTable from './AddTable.jsx'
import UpdateTable from './UpdateTable.jsx'
import Auth from '../Auth/Auth.jsx'
import Popup from './Popup.jsx'
import Title from './Title.jsx'
import { connect } from 'react-redux'
import {
    addTable,
    removeTable,
    updateTable,
    setTablesInitial,
    unsubscribeTables
} from '../shared/actions/TableActions'






class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            success: false,
            errorOnAction: false,
            userEditing: false,
            tableEditing: {}
        };


        const getTablesAction = {
            "$type": "subscribe_tables"
        };

        window.socket.send(JSON.stringify(getTablesAction));
        //Receive response
        window.socket.onmessage = event => {
            let data = JSON.parse(event.data);
            let updatedTables;

            console.log("EVENT", data);

            switch (data.$type) {
                case 'table_list':
                    const {tables} = data;
                    console.log("max: ", props.maxTables);
                    if (tables.length > props.maxTables) {
                        props.dispatch(setTablesInitial(tables.slice(0, props.maxTables)));
                    } else {
                        props.dispatch(setTablesInitial(tables));
                    }

                    break;
                case 'table_added':
                    if (props.tables.length < props.maxTables) {
                        props.dispatch(addTable(data));
                    } else {
                        alert("The maximum number of tables reached");
                    }
                    break;
                case 'table_removed':
                    props.dispatch(removeTable(data));
                    break;
                case 'table_updated':
                    props.dispatch(updateTable(data));
                    this.setState({
                        userEditing: false,
                        errorOnAction: false,
                        tableEditing: '',
                        success: true
                    }, () => {
                        setTimeout(() => {
                            this.setState({
                                success: false
                            })
                        }, this.props.dismissTime);
                    });

                    break;
                case 'removal_failed':
                    this.setState({
                        errorOnAction: true
                    });

                    break;
                case 'update_failed':
                    this.setState({
                        errorOnAction: true
                    });

                    break;
                case 'not_authorized':
                    hashHistory.push('/');

                    break;
            }
        };
    }


    deleteTable(index) {
        let removeTable = {
          "$type": "remove_table",
          "id": index
        };
        //Remove table
        window.socket.send(JSON.stringify(removeTable));
    }
    initUpdate(table) {
        this.setState({
            tableEditing: table
        }, () => {
            let editing;
            if (this.state.userEditing) {
                editing = false;
            } else {
                editing = true;
            }
            this.setState({
                userEditing: editing
            }, () => {
                const updateTableForm = this.refs.updateTable.refs.updateTableForm;
                let updateTableName = this.refs.updateTable.refs.tableName;
                updateTableName.value = table.name;
            })
        })
    }
    updateTable() {
        const updateTableName = this.refs.updateTable.refs.tableName.value.trim();
        if (updateTableName) {
            let name = updateTableName;

            let newTableObject = {
              "$type": "update_table",
              "table": {
                "id": this.state.tableEditing.id,
                "name": name,
                "participants": this.state.tableEditing.participants
              }
            }


            //Add table
            window.socket.send(JSON.stringify(newTableObject));

        } else {
            // show error
            this.setState({
                errorOnAction: true
            })
        }
    }
    cancelUpdate() {
        this.setState({
            userEditing: false
        })
    }
    dismissPopup(e) {
        let target = e.target.parentElement;
        target.style.opacity = 1;

        const fadePopupCb = () => {
            target.style.opacity -= .1;
            if (target.style.opacity > 0) {
                fadePopup();
            } else {
                this.setState({
                    errorOnAction: false
                });
            }
        }
        const fadePopup = () => {
            setTimeout(fadePopupCb, 50);
        };

        fadePopup();
    }
    addTable(e) {
        const addTableForm = this.refs.addTable.refs.addTableForm;
        const addTableValue = this.refs.addTable.refs.tableName.value.trim();
        if (addTableValue) {
            let name = addTableValue;

            let newTableObject = {
              "$type": "add_table",
              "after_id": 1,
              "table": {
                  "participants": 0,
                  "name": name
              }
            }

            //Add table
            window.socket.send(JSON.stringify(newTableObject));

            //Reset form fields
            let formLabels = Array.from(document.querySelectorAll('.label_custom'));
            formLabels.map(x => x.style.opacity = 1)
            addTableForm.reset();
        } else {
            this.setState({
                errorOnAction: true
            })
        }
    }
    componentWillUnmount() {
        this.props.dispatch(unsubscribeTables());
    }
    render() {
        return (
            <div className="flexParent flexColumn">
                {
                    this.state.errorOnAction || this.state.success
                    ?
                    <Popup dismissPopup={this.dismissPopup.bind(this)} success={this.state.success}/>
                    :
                    ''
                }

                <Title tableCount={this.props.tables.length} />
                <hr/>
                <div className="menu flexParent flexCenterX flexCenterY">
                    {
                        this.props.user.userType === 'admin'
                        ?
                        <AddTable ref="addTable" addTable={this.addTable.bind(this)} success={this.state.success}/>
                        :
                        ''
                    }
                    <a className="btn btn-default" href="/#/" style={{width:100, marginLeft: 20}}>Sign In</a>
                </div>

                {
                    this.state.userEditing
                    ?
                    <div className="row" style={{marginTop: 50}}>
                        <div className="col-xs-6 col-xs-offset-3 col-sm-6 col-sm-offset-3 col-md-6 col-md-offset-3">
                            <UpdateTable
                                ref="updateTable"
                                updateTable={this.updateTable.bind(this)}
                                initUpdate={this.initUpdate.bind(this)}
                                cancelUpdate={this.cancelUpdate.bind(this)}
                                success={this.state.success}/>
                        </div>
                    </div>
                    :
                    ''
                }
                <div id="tables_wrapper" className="container flexParent flexCenterY" style={{flex: 1}}>
                    {
                        this.props.tables.length
                        ?
                        this.props.tables.map(table =>
                            <Table
                                key={"table_" + table.id + "_" + table.participants}
                                id={"table_" + table.id}
                                table={table}
                                deleteTable={this.deleteTable.bind(this, table.id)}
                                updateTable={this.updateTable.bind(this, table)}
                                initUpdate={this.initUpdate.bind(this, table)}
                                userEditing={this.state.userEditing}
                                userLevel={this.props.user.userType}
                                />
                        )
                        :
                        <div className="jumbotron flexParent flexCenterY">
                            <h3 className="text-warning">Sorry, no tables at the moment.</h3>
                        </div>
                    }
                </div>
            </div>
        )
    };
}


const mapStateToProps = (state, ownProps) => {
  return {
      tables: state.tableReducer,
      user: state.userReducer,
      dismissTime: 2000,
      maxTables: 100,
      success: false,
      errorOnAction: false,
      userEditing: false,
      tableEditing: {}

  }
}





export default connect(mapStateToProps)(Main);
