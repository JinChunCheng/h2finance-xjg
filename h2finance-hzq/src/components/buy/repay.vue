/**
* Created by gyr on 16/10/17.
*
* Des: 购买详情-还款计划
*
*/

<template>
    <public-object-top msg="还款计划" back="true"></public-object-top>
    <repay-list></repay-list>

</template>

<script>
    import public_ObjectTop from '../common/public_ObjectTop.vue';
    import repayList from './repayList.vue';


    export default {
        data () {
            return {

            }
        },
        components:{
            "public-object-top":public_ObjectTop,
            "repay-list": repayList
        }
    }
</script>

<style lang="sass" scoped>


</style>