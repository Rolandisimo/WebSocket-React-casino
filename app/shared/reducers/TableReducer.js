// import Immutable from 'immutable';

// const defaultState = new Immutable.List();

function tableReducer(state = [], action) {
    switch (action.type) {
        case 'ADD_TABLE':
            if (action.tableData.after_id === -1) {
                return [action.tableData.table, ...state];
            } else {
                return [...state, action.tableData.table];
            }
            return;
        case 'REMOVE_TABLE':
            return state.filter(table => table.id !== action.tableData.id);

        case 'UPDATE_TABLE':
            let tableToUpdateIndex;
            state.some((t,i) => t.id === action.tableData.table.id ? tableToUpdateIndex = i : null);

            return [
                ...state.slice(0, tableToUpdateIndex),
                action.tableData.table,
                ...state.slice(tableToUpdateIndex+1)
            ];
        case 'SET_TABLES':
            return state.concat(action.tables);
        case 'UNSUBSCRIBE_TABLES':

            return [];
        default:
            return state;
    }
}

export default tableReducer;
