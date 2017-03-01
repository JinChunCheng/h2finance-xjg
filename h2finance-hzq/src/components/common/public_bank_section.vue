/**
 * Created by youhaiyang on 10/17/2016
 *
 * bank item container
 */

<template>
	<div class="bank-section clearfix">
		<div class="bank-icon" :class="mode"><img :src="getBankIcon"></div>
		<div class="bank-content">
			<div class="bank-title">{{bank.bankName}}</div>
			<div class="bank-sub">{{bank.remark}}</div>
		</div>
        <div v-if="mode=='sm'&&bank.checked" class="checked"></div>
        <div v-if="mode!='sm'" class="arrow-right"></div>
	</div>
</template>

<script>
export default {
	props: ['bank', 'mode'],
    data() {
    	return {};
    },
    computed: {
    	getBankIcon: function() {
			var bankCode = this.bank.bankCode;
			if(!bankCode){
				return '/images/bank/default-grey.png';
			}else{
				return '/images/bank/' + bankCode + '.png';
			}
    	}
    }
}
</script>

<style lang="sass" scoped>
.bank-section {
    background-color: #ffffff;
	.bank-icon {
		float: left;
		width: .72rem;
		height: .72rem;
		img {
			display: inline-block;
			width: 100%;
			height: 100%;
		}
	};
    .bank-icon.sm {
        width: .52rem;
        height: .52rem;
        margin-top: .1rem;    
    };
    .bank-content {
    	float: left;
    	margin-left: .3rem;
    	.bank-title {
    		font-size: .28rem;
    		color: #000000;
    		//margin-bottom: .09rem;
    	};
    	.bank-sub {
    		font-size: .24rem;
    		color: #999999;
    	}
    };
    .arrow-right {
    	float: right;
        background: url("../../static/images/right-next.png") no-repeat;
        background-size: .16rem .28rem;
	    width: .16rem;
	    height: .28rem;
	    margin-top: .22rem;
    };
    .checked {
        float: right;
        background: url("../../static/images/check.png") no-repeat;
        background-size: .42rem .30rem;
        width: .42rem;
        height: .30rem;
        margin-top: .22rem;
    }
}
</style>
