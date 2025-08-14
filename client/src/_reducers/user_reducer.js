import {LOGIN_USER} from '../_actions/types';

const initialState = {loginSuccess: false, userId: null};
export default function user(state = initialState, action) {
    switch (action.type) {
        case LOGIN_USER:
            return {
                ...state, ...action.payload
            };
        default:
            return state;
    }
}