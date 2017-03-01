/**
* Created by gyr on 16/10/10.
*
* Des:项目投资组件
*
*/

<template>
    <div class="investCon">
        <div class="twoFloor">
            <div class="investMsg">
                <span>投资金额</span>
                <i>金额为{{items.stepAmount}}倍数，单笔最高{{items.unitMaxAmount}}</i>
            </div>
            <div class="amount">
                <span class="amountMinus" @click="minus()"></span>
                <input class="amountNum" type="number" v-model="items.showAmount" @blur="onBlur"/>
                <span class="amountAdd" @click="add()"></span>
            </div>
            <div class="investTit">
                <span class="earnings">预计收益 <i v-text="profit"></i><i>元</i></span>
                <span class="balance">可用余额 <i v-text="items.balance"></i><i>元</i></span>
            </div>
        </div>
        <div class="investBtn">
            <pb-button @click="go_Password('safety_check')">立即投资</pb-button>
            <div class="top">
                <span class="des">账户余额不足？</span>
                <span class="pay" @click="go('/my/recharge')">充值</span>
            </div>
        </div>
    </div>
</template>

<script>
import public_button from '../common/public_button';
import { MessageBox} from 'mint-ui';
import http_url from '../../http_url.js';

export default {
    props:['items'],
    data () {
        return {}
    },
    components: {
        "pb-button": public_button
    },
    methods: {
        go_Password: function (msg) {
            //如果账户余额不足
            if(parseFloat(this.items.showAmount)>parseFloat(this.items.balance)){
                MessageBox.alert('账户余额不足,请充值');
            }else{
                this.items.flag = false;
            }
        },
        go: function(url) {
            router.go(url);
        },
        minus: function() {
            if(this.items.showAmount <= this.items.amount){
                return;
            }else{
                this.items.showAmount = parseFloat(this.items.showAmount) - parseFloat(this.items.stepAmount);
                this.items.showAmount = this.items.showAmount.toFixed(2);
            }
        },
        add: function() {
            if(this.items.showAmount >= this.items.unitMaxAmount){
                return;
            }else{
                this.items.showAmount  = parseFloat(this.items.showAmount) + parseFloat(this.items.stepAmount);
                this.items.showAmount = this.items.showAmount.toFixed(2);
            }
        },
        onBlur: function() {
            if(this.items.showAmount >= this.items.unitMaxAmount){
                this.items.showAmount = this.items.unitMaxAmount;
            }
        }
    },
    computed: {
        profit:function () {

            var showAmount = this.items.showAmount;//投资金额
            var duration = this.items.duration;//投资期限
            var interestRate = this.items.interestRate;//投资利率
            var discountRate = this.items.discountRate;//优惠利率
            var rate = parseFloat(interestRate)+parseFloat(discountRate);//最终利率
            var money = showAmount*rate/365*duration;

            // console.log("投资金额"+showAmount);
            // console.log("投资期限"+duration);
            // console.log("投资利率"+interestRate);
            // console.log("优惠利率"+discountRate);
            // console.log(rate);
            // console.log(money);

            return Math.round(money*100)/100;
        }
    }
}
</script>

<style lang="sass" scoped>
@import "../../common/css/common";

    .investCon{
        // position: fixed;
        height: 8.35rem-$status-bar-height;
        bottom: 0;
        background: #fff;
        margin-top:.3rem;
        width: 100%;
        // max-width: 6.4rem;
        .twoFloor{
            padding-top: .2rem;
            margin:0 .3rem;
            .investMsg{
                span{
                    font-size: .28rem;
                    color:#333333;
                    display: block;
                }
                i{
                    margin-top: .05rem;
                    font-size: .22rem;
                    color:#999999;
                    display: block;
                }
            }
            .amount{
                margin-top: .4rem;
                width: 100%;
                height: .66rem;
                line-height: .66rem;
                padding-bottom: .3rem;
                border-bottom: $public-border solid #efefef;
                text-align: center;
                .amountAdd{
                    background: url("../../static/images/scatter/pf_20.png") no-repeat;
                    width:.66rem;
                    height:.66rem;
                    background-size: .66rem .66rem;
                    float: right;
                }
                .amountNum{
                    border: none;
                    width: 4.48rem;
                    height: 100%;
                    font-family: PingFangSC-Light;
                    font-size: .6rem;
                    color: #f75a5a;
                    text-align: center;
                }
                .amountNum:-ms-input-placeholder{
                    color:#f75a5a;
                }

                .amountNum::-webkit-input-placeholder{
                    color: #f75a5a;
                }
                .amountMinus{
                    background: url("../../static/images/scatter/pf_17.png") no-repeat;
                    width:.66rem;
                    height:.66rem;
                    background-size: .66rem .66rem;
                    float: left;
                }
            }
            .investTit{
                padding-top: .3rem;
                width: 100%;
                height: .6rem;
                border-bottom: $public-border solid #efefef;
                i{
                    color: #f75b5b;
                }
                .earnings{
                    background: url("../../static/images/scatter/pf_32.png") no-repeat;
                    background-size: .36rem .36rem;
                    line-height: .36rem;
                    height: .36rem;
                    display: inline-block;
                    padding-left: .4rem;
                    float: left;
                    color:#666666;
                    font-size: .24rem;
                }
                .balance{
                    background: url("../../static/images/scatter/pf_29.png") no-repeat;
                    background-size: .34rem .33rem;
                    padding-left: .4rem;
                    height: .36rem;
                    line-height: .36rem;
                    display: inline-block;
                    float: right;
                    color:#666666;
                    font-size: .24rem;
                }
            }
        }
        .investBtn{
            margin-top: .8rem;
            text-align: center;
            .top{
                margin-top: .24rem;
            }
            .des{
                font-size: .22rem;
                color: #999999;
            }
            .pay{
                font-size: .24rem;
                color: #f75b5b;
                text-decoration:underline;
            }
        }
    }





</style>