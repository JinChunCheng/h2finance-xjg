import 'core-js/fn/object/assign';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, IndexRoute, browserHistory, Link} from 'react-router';
import 'styles/App.css';
import configStore from './stores/configStore.js';
import {Layout, Breadcrumb} from 'antd';
const {Header, Content, Footer} = Layout;
const store=configStore();
//components
import Main, {ChangeState, RefsAttr, GetData} from './components/dashbord/Main';
export class IndexApp extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Layout style={{height: '100%'}}>
                <Header
                    style={{
                        margin: '15px 10px 0',
                        padding: 10,
                        background: '#222',
                        minHeight: 50,
                        overflowY: 'scroll',
                        overflowX: 'hidden'
                    }}
                >
                    <Breadcrumb>
                        <Breadcrumb.Item
                            style={{color: '#fff', margin: '0 0 0 10px'}}
                        >
                            <Link style={{color: 'white'}} to="/ChangeState">
                                To ChangeState
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item
                            style={{color: '#fff', margin: '0 0 0 10px'}}
                        >
                            <Link style={{color: 'white'}} to="/Main">
                                To Main
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item
                            style={{color: '#fff', margin: '0 0 0 10px'}}
                        >
                            <Link style={{color: 'white'}} to="/Main/RefsAttr">
                                To RefsAttr
                            </Link>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
                <Content
                    style={{
                        margin: '15px 10px 0',
                        padding: 10,
                        background: '#ccc',
                        minHeight: 380,
                        overflowY: 'scroll',
                        overflowX: 'hidden'
                    }}
                >

                    {this.props.children}
                </Content>

                <Footer />
            </Layout>
        );
    }
}
// Render the main component into the dom
ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={IndexApp}>
                <IndexRoute component={Main} />
                <Route path="Main" component={Main}>
                    <Route path="RefsAttr" component={RefsAttr} />
                </Route>
                <Route path="ChangeState" component={ChangeState} />
                <Route path="GetData" component={GetData} />

            </Route>
        </Router>
    </Provider>,
    document.getElementById('app')
);
