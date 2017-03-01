/**
 * created by youhaiyang on 10/17/2016
 *
 * button
 */

<template>
    <button type="button" class="btn" :class="btnCls">
		<slot></slot>
    </button>
</template>
<script>
	export default {
		data() {
			return {};
		},
		props: ['cls'],
		computed: {
			btnCls: function() {
				return this.cls || 'btn-lg';
			}
		}
	}
</script>
<style lang="sass" scoped>
.btn {
    border: none;
    border-radius: 0.5rem;
    outline: none;
    color: #ffffff;
    background: #f75c5c;
}
.btn-lg {
    width: 5rem;
    height: .8rem;
    font-size: .3rem;
}
.btn[disabled] {
	background: #dcdcdc;
}
</style>
