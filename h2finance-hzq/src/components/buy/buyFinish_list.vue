/**
* Created by gyr on 16/10/11.
* Type:非公共组件
* Des: 购买详情页面功能列表
*
*/

<template>
    <div class="property">
        <pb-menu-next v-for="item in items" track-by="$index">
            <span class="buyLeft">{{item.title}}</span>
            <span sloat="right" class="buyNum">{{item.num}}元</span>
        </pb-menu-next>
    </div>

</template>

<script>
    import public_Menunext from '../common/public_Menunext';

    export default {
        props:['info'],
        data () {
            return {
                list:[
                    {
                        title:"",
                        num:""
                    },
                    {
                        title:"",
                        num:""
                    }
                ]
            }
        },
        components:{
            "pb-menu-next":public_Menunext
        },
        computed: {
            items: function(){
                this.list[0]["title"] = "投资金额";
                this.list[0]["num"] = this.info.biddingAmount;
                this.list[1]["title"] = "预计收益";
                this.list[1]["num"] = this.info.preInterest;
                return this.list;
            }
        }
    }
</script>

<style lang="sass" scoped>
    .property{
        margin-top: .3rem;
        background-color: #ffffff;
        padding-left: .3rem;
        .buyLeft{
            font-size:.28rem;
            color:#000;
        }
        .buyNum{
            float:right;
            padding-right: .3rem;
            font-size:.28rem;
            color:#f75a5a;
        }
    }


</style>