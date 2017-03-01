/**
* Created by gyr on 16/10/10.
*
* Des: 项目投资页面
*
*/

<template>
<div>
    <div v-if="project.items.flag">
        <public-object-top msg="项目投资" back="true"></public-object-top>
        <public-buy-title :date="project.date"></public-buy-title>
        <buy-project-child :items="project.items"></buy-project-child>
    </div>
    <div v-else>
        <public-safety></public-safety>
    </div>
</div>
</template>
<script>
import public_ObjectTop from '../common/public_ObjectTop.vue';
import public_BuyTitle from '../common/public_BuyTitle.vue';
import buyProject_child from './buyProject_child.vue';
import public_safety from '../common/public_safety';
import { MessageBox, Toast } from 'mint-ui';

import http_url from '../../http_url.js';

export default {
    data() {
            return {
                project: {
                    date: {
                        currentDate: "",
                        debtStartDate: "",
                        debtEndDate: "",
                        duration: ""
                    },
                    items: {
                        stepAmount: "",
                        unitMaxAmount: "",
                        amount: "",
                        balance: "",
                        showAmount: "",
                        flag: true,
                        duration: "",
                        interestRate: "",
                        discountRate: ""
                    },
                    next_address: "buy-finish"
                }
            }
        },
        components: {
            "public-object-top": public_ObjectTop,
            "public-buy-title": public_BuyTitle,
            "buy-project-child": buyProject_child,
            "public-safety": public_safety
        },
        created() {
            var user = JSON.parse(this.Util.Storage.get('USER'));
            //需要先设置资金密码
            if (user.isSetPwd != '1') {
                Toast({
                    message: '请先设置资金密码',
                    position: 'top',
                    duration: 2000
                });
                router.go({ name: 'my-fund-pwd-set' });
                return;
            }

            this.$http({
                method: "POST",
                url: http_url.buy_financing,
                body: {
                    "type": this.$route.query.targetType,
                    "id": this.$route.params.targetId
                }
            }).then((response) => {
                if (response.data.code == 200) {
                    this.data_processing(response.data.data);
                }
            });

            this.$on('clickNextPage', this.go_finish_page);
        },
        methods: {
            data_processing: function(info_data) {
                this.project.date.currentDate = info_data.currentDate; //当前时间
                this.project.date.debtStartDate = info_data.debtStartDate; //起息日
                this.project.date.debtEndDate = info_data.debtEndDate; //标的结束时间
                this.project.date.duration = info_data.duration; //投资期限

                this.project.items.amount = info_data.biddingStartAmount; //起投金额
                this.project.items.stepAmount = info_data.biddingStepAmount; //Step
                this.project.items.unitMaxAmount = info_data.biddingEndAmount; //最高金额
                this.project.items.balance = info_data.balance; //账户可用余额
                this.project.items.duration = info_data.duration; //投资期限
                this.project.items.interestRate = info_data.interestRate; //投资利率
                this.project.items.discountRate = info_data.discountRate; //优惠利率


                /**
                 * 判断计算器页面是否传值
                 *
                 * Des: 
                 *   1：如果未进入计算器页面或进入页面为输入金额，则直接使用服务器
                 *      端返回属性 "起投金额" biddingStartAmount
                 *   2：如果进入过计算器页面，并输入购买金额，则使用输入金额为初始化数值
                 *
                 */
                let calculator_num = this.$route.query.biddingAmount;
                let result = 0;
                if (calculator_num === '' || calculator_num === null || calculator_num === undefined) {
                    result = info_data.biddingStartAmount;
                } else {
                    result = this.$route.query.biddingAmount;
                }
                this.project.items.showAmount = result;
            },
            go_finish_page: function(param) {
                this.$http({
                    method: "POST",
                    url: http_url.buy_password,
                    body: {
                        "targetType": this.$route.query.targetType,
                        "targetId": this.$route.params.targetId,
                        "biddingAmount": this.project.items.showAmount,
                        "operateOrigin": "1",
                        "financelPassword": this.Util.Security.encrypt(param)
                    }
                }).then((response) => {
                    if (response.data.code == 200) {
                        router.go({
                            name: this.project.next_address,
                            params: {
                                id: response.data.data
                            }
                        });
                    }
                });
            }
        },
        events: {
            "on-back": function() {
                this.project.items.flag = true;
            }
        }
}
</script>

<style lang="sass" scoped>

</style>