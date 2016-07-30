import React, { PropTypes, Component } from 'react';
import Player from './Player.jsx';
import PureRenderMixin from 'react-addons-pure-render-mixin';





class Table extends Component {
    constructor(props) {
        super(props);

        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    render () {
        var playerNodes = [];

        for (var i = 1; i <= 12; i++) {
            playerNodes[i] = <Player key={"player_" + i + "_" +this.props.id} status={this.props.table.participants >= i}/>
        }

        return (
            <div className="table_container flexParent flexColumn">
                {
                    this.props.userLevel === 'admin'
                    ?
                    <div>
                        <i className="fa fa-times tableIcon" aria-hidden="true" onClick={this.props.deleteTable}></i>
                        <i
                            style={{
                                right:35,
                                opacity: this.props.userEditing ? 0 : 1
                            }}
                            className="fa fa-pencil tableIcon"
                            onClick={this.props.initUpdate}
                            aria-hidden="true"
                            >
                        </i>
                    </div>
                    :
                    ''
                }
                <h5 className="text-center">{this.props.table.name}</h5>
                <div className="players_container flexParent flexRowWrap">
                    {
                        playerNodes
                    }
                </div>
            </div>
        );
    }
}

export default Table;
