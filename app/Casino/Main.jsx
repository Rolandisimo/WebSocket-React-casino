import React, {PropTypes} from 'react';
import { hashHistory } from 'react-router';
import Table from './Table.jsx';
import AddTable from './AddTable.jsx';
import UpdateTable from './UpdateTable.jsx';
import Auth from '../Auth/Auth.jsx';
import Popup from './Popup.jsx';





class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tables: [],
            success: false,
            maxTables: 100,
            errorOnAction: false,
            userLevel: props.location.query.userType,
            userEditing: false,
            tableEditing: {},
            dismissTime: 2000
        };

        const getTablesAction = {
            "$type": "subscribe_tables"
        };

        window.socket.send(JSON.stringify(getTablesAction));
        //Receive response
        window.socket.onmessage = (event) => {
            let data = JSON.parse(event.data);
            let updatedTables;

            console.log("EVENT", data);

            switch (data.$type) {
                case 'table_list':
                    if (data.tables.length > this.state.maxTables) {
                        let tables = data.tables.slice(0, this.state.maxTables);

                        this.setState({tables});
                    } else {
                        this.setState({
                            tables: data.tables
                        });
                    }

                    break;
                case 'table_added':

                    //Update state
                    let newTablesState;
                    if (data.after_id === -1) {
                        newTablesState = [data.table, ...this.state.tables];
                    } else {
                        newTablesState = [...this.state.tables, data.table];
                    }

                    this.setState({
                        tables: newTablesState,
                        errorOnAction: false,
                        success: true
                    }, () => {
                        setTimeout(() => {
                            this.setState({
                                success: false
                            })
                        }, this.state.dismissTime);
                    });

                    break;
                case 'table_removed':

                    updatedTables = this.state.tables
                        .filter(t => {
                            if (t.id !== data.id) {
                                return t;
                            }
                        });

                    //Update state
                    if (updatedTables.length !== this.state.tables.length) {
                        this.setState({
                            tables: updatedTables,
                            errorOnAction: false
                        });
                    }

                    break;
                case 'table_updated':

                    this.state.tables
                        .map(t => {
                            if (t.id === data.table.id) {
                                console.log("table up", t);
                                t.name = data.table.name;
                                return t;
                            }
                        });

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
                        }, this.state.dismissTime);
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
                    console.log("Not auth");
                    hashHistory.push('/');

                    break;
            }
        };


    }
    deleteTable(index) {
        let removeTable = {
          "$type": "remove_table",
          "id": index
        }
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
                let form = document.forms['updateTableForm'];
                form['tableName'].value = table.name;
            })
        })
    }
    updateTable() {
        let form = document.forms['updateTableForm'];

        if (form['tableName'].value) {
            let name = form['tableName'].value.trim();

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
        let form = document.forms['addTableForm'];

        if (form['tableName'].value) {
            let name = form['tableName'].value.trim();

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
            let formLabels = document.querySelectorAll('.label_custom')
            formLabels = [].slice.call(formLabels);

            formLabels.map(x => x.style.opacity = 1)
            form.reset();
        } else {
            this.setState({
                errorOnAction: true
            })
        }
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
                <h1 className="text-center">Active Tables: {this.state.tables.length}</h1>
                <hr/>
                <div className="menu flexParent flexCenterX flexCenterY">
                    {
                        this.state.userLevel === 'admin'
                        ?
                        <AddTable addTable={this.addTable.bind(this)} success={this.state.success}/>
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
                        this.state.tables.length
                        ?
                        this.state.tables.map(table =>
                            <Table
                                key={"table_" + table.id + "_" + table.participants}
                                id={"table_" + table.id} table={table}
                                deleteTable={this.deleteTable.bind(this, table.id)}
                                updateTable={this.updateTable.bind(this, table)}
                                initUpdate={this.initUpdate.bind(this, table)}
                                userEditing={this.state.userEditing}
                                userLevel={this.state.userLevel}
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

export default Main;
