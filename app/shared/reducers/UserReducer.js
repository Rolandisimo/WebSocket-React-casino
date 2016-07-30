function userReducer(state = {}, action) {
    switch (action.type) {
        case 'UPDATE_USER':
            return {userType: action.userType};
        default:
            return state;
    }
}

export default userReducer;
