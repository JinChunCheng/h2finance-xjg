import {combineReducers} from 'redux';
// Updates an entity cache in response to any action with response.entities.
const getDataReducer = (state = {}, action) => {
  const actionType = action.type;
  switch (actionType) {
    case 'GET_DATA_START':
      return {...state, ...{inputVal: action.btnVal, btnVal: action.btnVal}};
    case 'GET_DATA_SUCCESS':
      return {...state, ...{inputVal: action.btnVal, btnVal: action.btnVal}};
    case 'GET_DATA_FAILED':
      return {...state, ...{inputVal: action.btnVal, btnVal: action.btnVal}};
    case 'REQUEST_POST':
      return {...state, ...{inputVal: action.btnVal, btnVal: action.btnVal,loading:action.loading}};
    case 'RECEIVED_POST':
      return {
        ...state,
        ...{
          inputVal: action.btnVal,
          btnVal: action.btnVal,
          name: action.name,
          age: action.age,
          loading:action.loading
        }
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  getDataReducer
});

export default rootReducer;
