export function addTable(tableData) {
    return {
        type: 'ADD_TABLE',
        tableData
    };
}
export function removeTable(tableData) {
    return {
        type: 'REMOVE_TABLE',
        tableData
    };
}
export function updateTable(tableData) {
    return {
        type: 'UPDATE_TABLE',
        tableData
    };
}
export function setTablesInitial(tables) {
    return {
        type: 'SET_TABLES',
        tables
    };
}
export function unsubscribeTables() {
    return {
        type: 'UNSUBSCRIBE_TABLES'
    };
}
