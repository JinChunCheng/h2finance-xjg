/**
* Created by gyr on 16/10/10.
*
* Des: 购买完成页面
*
*/
<template>
    <public-object-top msg="购买完成"></public-object-top>
    <public-buy-title :date="finish"></public-buy-title>
    <buy-finish-list :info="finish"></buy-finish-list>
    <div class="back-btn">
        <pb-button cls="btn-lg" @click="back">确定</pb-button>
    </div>
</template>
<script>
import public_ObjectTop from '../common/public_ObjectTop.vue';
import public_BuyTitle from '../common/public_BuyTitle.vue';
import buyFinish_list from './buyFinish_list.vue';
import public_button from '../common/public_button';

import http_url from '../../http_url.js';

export default {
    data() {
            return {
                finish: {
                    // date:{
                    //     todayInvest:"(java未返)",
                    //     startJX:"(java未返)",
                    //     JBDate:"(java未返)"
                    // },
                    // items:[
                    //     {title:'投资金额',num:10000},
                    //     {title:'预计收益',num:2598.43}
                    // ]
                }
            }
        },
        components: {
            "public-object-top": public_ObjectTop,
            "public-buy-title": public_BuyTitle,
            "buy-finish-list": buyFinish_list,
            "pb-button": public_button
        },
        created: function() {
            this.$http({
                method: "GET",
                url: http_url.buy_finish + this.$route.params.id
            }).then((response) => {
                if (response.data.code == 200) {
                    this.data_processing(response.data.data);
                }
            });
        },
        methods: {
            back: function() {
                router.go('/my/invest-record');
            },
            data_processing: function(info_data) {
                this.finish = info_data;
            }
        }
}
</script>

<style lang="sass" scoped>
@import '../../common/css/common.scss';

.back-btn {
    margin-top: .8rem;
    width: 100%;
    max-width: $custom-max-width;
    text-align: center;
}
</style>