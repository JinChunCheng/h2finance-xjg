/**
* Created by gyr on 16/11/29.
*
* Des:我的-银行卡信息
*
*/
<template>
    <div class="bank clearfix" :style="{'background-image':getBankBg}">
        <div class="bank-icon">
            <div class="bank-icon-msg">
                <span></span>
                <img :src="getBankIcon"/>
            </div>
        </div>
        <div class="bank-msg">
            <p>{{bank.bankName}}</p>
            <span class="bank-type">储蓄卡</span>
            <div class="bank-card">
                {{bank.bankAccountMask}}
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['bank'],
    data() {
        return {

        }
    },
    computed: {
        getBankIcon: function() {
            var bankCode = this.bank.bankCode;
           return '/images/bank/' + bankCode + '.png';
            //return './images/bank/' + bankCode + '.png';
        },
        getBankBg: function() {
            var bankCode = this.bank.bankCode;
            //console.log(code);
            return 'url(/images/bankbg/' + bankCode + '.png)';
            //return 'url(./images/bankbg/' + bankCode + '.png)';
        }
    }
}
</script>
<style lang="sass" scoped>
    @import "../../common/css/common";
    .bank{
        margin: .3rem .2rem 0 .2rem;
        width: 6rem;
        height: 1.6rem;
        //background: url("../../static/images/bankBg/bg301290000007.png") no-repeat;
        background-size: 6rem 1.6rem;
        .bank-icon{
            float: left;
            width: 1.1rem;
            height: 1.6rem;
            .bank-icon-msg{
                margin: 0 .2rem .24rem .2rem;
                width: .7rem;
                height: .7rem;   
                position:relative;
                span{
                    border-radius: .7rem;
                    top:0.2rem;
                    position:absolute;
                    opacity:0.8;
                    width: .7rem;
                    height: .7rem;
                    background: #fff;
                    -moz-opacity:0.8;
                    -khtml-opacity: 0.8;
                    display: inline-block;
                }
                img{
                    top:0.2rem;
                    position:absolute;
                    display: inline-block;
                    width: .5rem;
                    height: .5rem;
                    margin: .1rem;
                    z-index:1;
                }
            }
           
        }
        .bank-msg{
            float: right;
            width: 4.9rem;
            height: 1.6rem;
            color: #fff;
            p{
                padding-top: .2rem;
                font-size: .26rem;
            }
            .bank-type{
                display: block;
                //padding-top: .05rem;
                font-size: .2rem;
            }
            .bank-card{
                padding-top: .25rem;
                height: .28rem;
                line-height: .28rem;
                font-size: .28rem;
                .bank-card-left{
                    float: left;
                    padding-top: .05rem;
                    //filter:alpha(opacity:60);
                    opacity:0.6;
                    -moz-opacity:0.6;
                    -khtml-opacity: 0.6;
                }
                .bank-card-right{
                    float: left;
                    padding-left: .2rem;
                }
            }
        }
    }
</style>

