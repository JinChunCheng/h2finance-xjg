/*
 *  Title :表单验证
 *  Notice:......
 *  Author:Darren_YCDing
 *  Time  :16/7/26
 */
var public_detection = function(){
    //策略对象
    var strategies = {
        //输入为空判断
        isNonEmpty:function( value, errorMsg ){
            if(value === ''){
                return errorMsg;
            }
        },
        //输入最小长度判断
        minLength:function( value, length, errorMsg ){
            if(value.length < length){
                return errorMsg;
            }
        },
        //输入是否为手机号判断
        isMobile:function( value, errorMsg ){
            if(!/(^1[3|5|8][0-9]{9}$)/.test( value ) ){
                return errorMsg;
            }
        },
        //输入是否为邮箱判断
        isEmail: function(value,errorMsg){
            if (!/^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/.test(value)) {
                return errorMsg;
            };
        }
    };
    //Validator类
    var Validator = function(){
        this.cache = [];
    };
    Validator.prototype = {
        constructor: Validator,
        add:function( dom, rules){
            var result = {
                      domId:dom.id,
                      errorMsg:""
                };
            var self = this ,i = 0, rule;
            for( i; rule = rules[ i++ ]; ){
                (function(rule){
                    var strategyAry = rule.strategy.split( ':' );
                    var errorMsg = rule.errorMsg;
                    self.cache.push(function(){
                        var strategy = strategyAry.shift();
                        strategyAry.unshift( dom.value );
                        strategyAry.push( errorMsg );
                        result.errorMsg = strategies[ strategy ].apply( dom, strategyAry);
                        console.log(result);
                        return result;
                        // return strategies[ strategy ].apply( dom, strategyAry);
                    });
                })(rule);
            }
        },
        start:function(){
            var i = 0, validatorFunc;
            for( i; validatorFunc = this.cache[ i++ ]; ){
                var mssage_Info = validatorFunc();
                if( mssage_Info.errorMsg ){
                    console.log(mssage_Info);
                    return mssage_Info;
                }
            }
        }
    };
    return new Validator();
};




//表单规则
function validatorFunc(){
    var validator = public_detection();
    validator.add(
        userphone, 
        [{
            strategy:'isNonEmpty',
            errorMsg:'手机号不能为空'
        },
        {
            strategy:'isMobile',
            errorMsg:'手机号码格式不正确'
        }
        ]
    );
    validator.add(
        password,
        [{
            strategy:'isNonEmpty',
            errorMsg:'密码不能为空'
        },{
            strategy:'minLength:6',
            errorMsg:'密码长度不能小于6位'
        }]
    );
    var errorMsg = validator.start();
    return errorMsg;
};
