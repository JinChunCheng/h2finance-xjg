/**
 * Created by Darren on 16/09/11.
 *
 * Des: 主程序模块
 *
 */
 
<template>
    <div class="chart-line">
    	<canvas id="lineChart" class="line-body"></canvas>
    </div>
</template>

<script>
// import chart from 'chart';

export default{
    data:function () {
        return {
        	config:{
        		type: 'line',
        		data:{
					labels : ["银行活期","余额宝","货币基金","汇赚钱"],
					datasets : [
						{
							fillColor : "rgba(220,220,220,0.5)",
							strokeColor : "rgba(220,220,220,1)",
							pointColor : "rgba(220,220,220,1)",
							borderWidth:4,
							// pointBorderColor:"",
							// pointBackgroundColor:"rgba(239,91,40,0.8)",
							// pointStyle:"dash",
							borderColor : "rgba(239,91,40,0.8)",
							backgroundColor:"rgba(239,91,40,0.2)",
							pointStrokeColor : "#f75d5b",
							data : [],
							spanGaps: false
						}
					]
				},
			    options: {
			    	// maintainAspectRatio:false,
			        tooltips: {
			        	intersect:false,
			        	bodyFontSize:12
			        	// titleFontSize:20
			        },
			        legend:{
			        	display:false,//去掉标题
			        	labels:{
			        		fontSize:24,
			        		fontColor: 'rgb(255, 99, 132)'
			        	}
			        }
			    }
        	}
        }
    },
    ready() {
		var ctx = document.getElementById("lineChart").getContext("2d");
		new Chart(ctx,this.config);
	},
	events: {
		'chartChange': function(data) {
			this.config.data.datasets[0].data = data;
			var ctx = document.getElementById("lineChart").getContext("2d");
			new Chart(ctx,this.config);
		}
	}
}
</script>
<style lang="sass" scoped>
.chart-line{
	width:6.2rem;
	margin-top: .3rem;
	padding-bottom: .4rem;
	.line-body{
		width:2rem;
		height:1.5rem;
	}
}
</style>