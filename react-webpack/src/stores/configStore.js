import {createStore, applyMiddleware} from 'redux';
import rootReducer from '../reducers/index.js';
import thunk from 'redux-thunk';

const configStore = () => {
    const store = createStore(rootReducer, applyMiddleware(thunk));

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers/index');
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
};
export default configStore;
