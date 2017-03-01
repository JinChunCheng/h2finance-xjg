/**
* Created by Darren on 16/11/01.
*
* Des: 购买确定按钮
*   1:可以购买  2:预售(倒计时)   3:售罄
*
*/

<template>
<div>
    <div v-if="info_1.status === '1'" class='public-Buy-Buttion clearfix'>
       <div class="calculator-1" @click="go_calculator('profit-calculator')"></div>
       <div class="btn-Buy-1" @click="go_info('pay-money')">立即购买</div>
    </div>

    <div v-if="info_1.status === '2'" class='public-Buy-Buttion clearfix'>
       <div class="calculator-2" @click="go_calculator('profit-calculator')"></div>
       <div class="btn-Buy-2 clearfix">
           <span class="title">距发售</span>
           <span v-text="times.days" class="time"></span>
           <em>:</em>
           <span v-text="times.hours" class="time"></span>
           <em>:</em>
           <span v-text="times.minutes" class="time"></span>
           <em>:</em>
           <span v-text="times.seconds" class="time"></span>
       </div>
    </div>
    <div v-if="info_1.status==='3'||info_1.status==='4'" class='public-Buy-Buttion clearfix'>
       <div class="calculator-2" @click="go_calculator('profit-calculator')"></div>
       <div class="btn-Buy-3" v-text="info_1.status==='3'?'已售罄':'还款中'"></div>
    </div>
</div>
</template>
<script>
export default {
    props: ["info_1","times"],
    data() {
        return {
            duration:'',
            // days: '00',
            // hours: '00',
            // minutes: '00',
            // seconds: '00'
        }
    },
    computed: {
        showBack: function() {
            return this.back ? true : false;
        },
        totalRate: function() {
            //console.log(this.info_1.status);
            if(!this.info_1.discountRate){
                this.info_1.discountRate = 0;
            }
            var total = (this.info_1.interestRate + this.info_1.discountRate) * 100;
            return total.toFixed(2);
        }
    },
    methods: {
        goBack: function() {
            history.back();
        },
        go_info: function (msg) {
            router.go({
                name:msg, 
                params:{
                    targetId:this.$route.params.targetId
                },
                query:{
                    targetType:this.$route.query.targetType
                } 
            });
        },
        go_calculator: function (msg) {
            router.go({
                name:msg, 
                params:{
                    targetId:this.$route.params.targetId
                },
                query:{
                    targetType:this.$route.query.targetType,
                    rate:this.totalRate,
                    duration:this.info_1.duration,
                    status:this.info_1.status,
                    biddingAmount:this.info_1.biddingStartAmount

                } 
            });
        }
    }
}
</script>
<style lang="sass" scoped>
@import "../../common/css/common";
.public-Buy-Buttion {
    z-index:998;
    position: fixed;
    bottom: 0;
    width: 100%;
    max-width: $custom-max-width;
    .calculator-1 {
        float: left;
        width: .88rem;
        height: .88rem;
        background: url("../../static/images/Buy/calculator.png") no-repeat .2rem 0.165rem;
        background-size: .42rem .56rem ;
        background-color: #de5353;
    }
    .calculator-2 {
        @extend .calculator-1;
        background: url("../../static/images/Buy/calculator_2.png") no-repeat .24rem 0.165rem;
        background-size: .42rem .56rem ;
        background-color: #cfcfcf;
    }
    .btn-Buy-1{
        float: left;
        width: $custom-max-width - 0.88rem;
        height: .88rem;
        line-height: .88rem;
        text-align: center;
        font-size: .3rem;
        color: #fff;
        background: #f75c5c;
    }
    .btn-Buy-2{
        @extend .btn-Buy-1;
        color: #666;
        background: #dcdcdc;
        .time{
            float: left;
            margin-top: .26rem;
            width: .36rem;
            line-height: 0.36rem;
            background:#666666;
            color: #fff;
            font-size: .22rem;
            border-radius: 4px;
        }
        .title{
            float: left;
            font-size: .26rem;
            color: #666;
            background:#dcdcdc;
            border-radius: .05rem;
            margin-left: 20%;
            margin-right: .2rem;
        }
        em{
            float: left;
            color: #666666;
            width: .14rem;
        }   
    }
    .btn-Buy-3{
        @extend .btn-Buy-1;
        color: #666;
        background: #dcdcdc;
    }
}
</style>
