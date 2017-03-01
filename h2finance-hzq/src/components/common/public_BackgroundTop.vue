/**
 * Created by Darren on 16/09/30.
 *
 * Des: 资产显示Top背景
 *
 */
 
<template>
	<div class="my-Top clearfix">
          <div class="point">
			<slot></slot>
          </div>
    </div>
</template>

<script>
export default {
 	data () {
	 	return {
	 		msg: 'Hello from vue-loader!App!'
	 	}
 	}
}
</script>

<style lang="sass" scoped>
@import "../../common/css/common";
.my-Top{
	padding-top: $status-bar-height;
	color: #ffffff;
	background: url('../../static/images/my-3.png') no-repeat;
	background-size: 6.4rem 5.02rem;
	.point{
		height: 100%;
		background: url('../../static/images/my-4.png') repeat;
		background-size: 5.48rem 2.76rem;
	}
}

</style>
























