import configStore from '../stores/configStore.js';
import axios from 'axios';
const store=configStore();
const GET_DATA_START = 'GET_DATA_START';
const GET_DATA_SUCCESS = 'GET_DATA_SUCCESS';
const GET_DATA_FAILED = 'GET_DATA_FAILED';
const REQUEST_POST = 'REQUEST_POST';

const RECEIVED_POST = 'RECEIVED_POST';
export function getDataStart(text) {
    return {
        type: GET_DATA_START,
        ...text
    };
}
export function getDataSuccess(text) {
    return {
        type: GET_DATA_SUCCESS,
        ...text
    };
}
export function getDataFailed(text) {
    return {
        type: GET_DATA_FAILED,
        ...text
    };
}

export function requestPosts(text) {
    return {
        type: REQUEST_POST,
        ...text
    };
}
export function receivedPosts(text, res) {
    return {
        type: RECEIVED_POST,
        btnVal:text,
        ...res
    };
}
export function fetchPosts(postTitle) {
    return (dispatch, getState) => {
        store.dispatch(requestPosts(postTitle));
        setTimeout(
            () => axios.get('../../data/success.json').then(response => {
            	if(response.data.code==200){
                dispatch(receivedPosts(response.data.successMsg, response.data.data));
                return;
            }
            dispatch(receivedPosts(response.data.errorMsg, {loading:false}))
            }),
            2000
        );
    };
}
