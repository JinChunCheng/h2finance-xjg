require('styles/App.css');

import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import {Link} from 'react-router';
import * as actions from '../../actions/index.js';
import configStore from '../../stores/configStore.js';
import axios from 'axios';
import { Button} from 'antd';
const store=configStore();
export default class Main extends Component {
    constructor(props) {
        super(props);
        this.timer();
    }
    timer() {
        setTimeout(() => console.log(store.getState().getDataReducer), 1000);
    }
    render() {
        return (
            <div className="index">
                This is Main
                <ShowList />
                <RefsAttr />
            </div>
        );
    }
}

export class ShowList extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <Link to="/GetData">to GetData</Link>
            </div>
        );
    }
}
export class ChangeState extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: 'ALT'
        };
        // this.timer
    }
    componentDidMount() {
        this.timer = setTimeout(
            () => {
                this.setState({name: 'ZZZ'});
            },
            2000
        );
    }
    componentWillUnmount() {
        // debugger
        clearTimeout(this.timer);
    }
    render() {
        return (
            <div>
                <p>name:{this.state.name}</p>
                This is ChangeState,
                <Link to="/Main">To Main</Link>
            </div>
        );
    }
}
export class RefsAttr extends Component {
    handleClick() {
        const user = ReactDOM.findDOMNode(this.refs.user);
        const name = ReactDOM.findDOMNode(this.refs.name);
        user.innerHTML = name.value;
    }

    render() {
        return (
            <div>
                <p ref="user">i am RefsAttr,in Main</p>
                <input ref="name" />
                <input
                    type="button"
                    onClick={() => this.handleClick()}
                    value="Click Me"
                />
            </div>
        );
    }
}
export class GetData extends Component {
    constructor(props) {
        super(props);
        this.state = {btnVal: 'Click Me To Invoke API'};
        this.storeDataChanged = () => {
            this.setState(store.getState().getDataReducer);
        };

        //     this.timer = setTimeout(
        //         () => {
        //             axios
        //                 .get('../../../data/success.json')
        //                 .then(res => {
        //                     if (res.data.code == 200) {
        //                         store.dispatch(
        //                             actions.getDataSuccess({
        //                                 inputVal: res.data.successMsg,
        //                                 btnVal: res.data.successMsg
        //                             })
        //                         );
        //                         this.setState(store.getState().getDataReducer);
        //                         return;
        //                     }
        //                     store.dispatch(
        //                         actions.getDataFailed({
        //                             inputVal: res.data.errorMsg,
        //                             btnVal: res.data.errorMsg
        //                         })
        //                     );
        //                     this.setState(store.getState().getDataReducer);
        //                 })
        //                 .catch(error => console.log(error));
        //         },
        //         2000
        //     );
    }

    componentDidMount() {
        this.unSubscribe = store.subscribe(this.storeDataChanged);
    }
    componentWillUnmount() {
        this.unSubscribe();
    }

    toGetData() {
        // store.dispatch(
        //     actions.getDataStart({inputVal: '即将发起请求！', btnVal: '即将发起请求！'})
        // );
        store.dispatch(actions.fetchPosts({btnVal: '正在发起请求！',loading:true}));
    }

    render() {
        return (
            <div>
                <p>{this.state.btnVal}</p>
                <p>name:{this.state.name}</p>
                <p>age:{this.state.age}</p>

                <Button loading={this.state.loading} onClick={() => this.toGetData()} type="danger">
                    {this.state.btnVal}
                </Button>

            </div>
        );
    }
}
