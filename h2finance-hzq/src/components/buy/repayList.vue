/**
* Created by gyr on 16/10/17.
* Type:非公共组件
* Des: 购买详情-还款计划页面功能列表
*
*/

<template>
    <div class="property">
        <pb-menu-next class="repay">
            <span class="repayTitle date">还款时间</span>
            <span class="repayTitle type">类型</span>
            <span class="repayTitle num">还款金额(元)</span>
        </pb-menu-next>
        <pb-menu-next class="repay" v-for="item in items" track-by="$index">
            <span sloat="image" class="repayCon date">{{item.date}}</span>
            <span class="repayCon type">{{item.type}}</span>
            <span sloat="right" class="repayNum num">{{item.num}}</span>
        </pb-menu-next>
     </div>
</template>

<script>
    import public_Menunext from '../common/public_Menunext';

    export default {
        data () {
            return {
                items:[
                    {type:'本金',num:2598.43,date:"2016-10-09"},
                    {type:'利息',num:125.12,date:"2016-10-09"},
                    {type:'本金',num:125.12,date:"2016-10-09"},
                    {type:'利息',num:2598.43,date:"2016-10-09"},
                    {type:'本金',num:125.12,date:"2016-10-09"},
                    {type:'利息',num:2598.43,date:"2016-10-09"},
                    {type:'本金',num:125.12,date:"2016-10-09"},
                    {type:'利息',num:2598.43,date:"2016-10-09"},
                    {type:'本金',num:125.12,date:"2016-10-09"},
                    {type:'利息',num:2598.43,date:"2016-10-09"}
                ]
            }
        },
        components:{
            "pb-menu-next":public_Menunext
        }
    }
</script>

<style lang="sass" scoped>
    .property{
        background-color: #fff;
        padding: 0 .3rem;
        margin-top: 1.18rem;
        .repay{
            height:.47rem;
            line-height:.47rem;
            .repayTitle{
                font-size: .28rem;
                color: #999;
            }
            .repayCon{
                font-size: .26rem;
                color: #000;
            }
            .repayNum{
                font-size: .26rem;
                color: #f75c5c;
            }
            .date{
                float: left;
                width: 1.6rem;
                text-align: center;
            }
            .num{
                float: right;
                width: 1.6rem;
                text-align: center;
            }
            .type{
                display: inline-block;
                width:2.6rem;
                text-align : center;
            }
        }

    }


</style>