function Validator(formSelector) {
    var _this=this
    function getParentElement(element,selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)) return element.parentElement
            element=element.parentElement
        }
    }
    var formRules=[]
    var formElement=document.querySelector(formSelector)


    var validatorRules={
        required:function(value,msgCustome){
            return value ? undefined : msgCustome || 'Vui lòng nhập trường này'
        },
        email:function(value,msgCustome){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : msgCustome || 'Vui lòng nhập email'
        },
        comparewith:function(compare){
            return function(value,msgCustome){
                var elementCompare=formElement.querySelector(`input[name="${compare}"]`).value
                return value===elementCompare ? undefined : msgCustome || `Nội dung không trùng khớp với nhau`
            }
        },
        min:function(min){
            return function(value,msgCustome){
                return value.length>=min ? undefined : msgCustome || `Nhập ít nhất ${min} ký tự`
            }
        },
        max:function(max){
            return function(value,msgCustome){
                return value.length<=max ? undefined : msgCustome || `Tối đa ${max} ký tự`
            }
        }
    }

    if(!formElement) return

    var inputs=formElement.querySelectorAll('[name][rules]')
    var regex=/[^a-zA-Z0-9_ ~]/gm //chỉ lấy a-z 0-9 và _ với (dấu cách" ")

    for (var input of inputs){
        var rules=input.getAttribute('rules').split(regex)
        console.log(rules);
        for (var rule of rules){
            var ruleInfo,ruleFunc,ruleMsg
        //    console.log(rule);
            var isRuleHasValue=rule.includes('_')
            var isMsg=rule.includes('~')
            if(isMsg){
                console.log(rule);
                var index=rule.indexOf('~')
                console.log(rule.slice(index+1));
            }

            if(isRuleHasValue){
                ruleInfo=rule.split('_')
                rule=ruleInfo[0]
                // if(ruleInfo[2]){
                //     ruleMsg=ruleInfo[2]
                //     console.log(validatorRules[rule](ruleInfo[1])(true,ruleMsg));
                // }
                // console.log(ruleInfo);
                console.log(rule);
            }

            ruleFunc=validatorRules[rule]

            if(isRuleHasValue){
                ruleFunc=ruleFunc(ruleInfo[1])
            }
            if(Array.isArray(formRules[input.name])){
                formRules[input.name].push(ruleFunc)
            }else{
                // console.log(ruleFunc);
                formRules[input.name]=[ruleFunc]
            }

            // console.log(formRules);
        }

        // event check
        input.onblur=handleValidate
        input.oninput=handleClearErr
    }

    function handleValidate(e){
        var rules=formRules[e.target.name]
        var errorMessage

        for(var rule of rules){
            errorMessage= rule(e.target.value)
            if(errorMessage) break
        }

        if(errorMessage){
            var formGroup=getParentElement(e.target,'.form-group')

            if(formGroup){
                formGroup.classList.add('invalid')
                var formMessage=formGroup.querySelector('.form-message')
                if(!formMessage) return
                formMessage.innerText=errorMessage
            }
        }
        return !errorMessage
    }

    function handleClearErr(e){
        var formGroup=getParentElement(e.target,'.form-group')
        if(formGroup.classList.contains('invalid')){
            formGroup.classList.remove('invalid')
            var formMessage=formGroup.querySelector('.form-message')
            if(formMessage) formMessage.innerText=''
        }
    }

    formElement.onsubmit=function(e){
        e.preventDefault()
        
        var inputs=formElement.querySelectorAll('[name][rules]')
        var isValid=true

        for(var input of inputs){
            if(!handleValidate({target:input})){
                isValid=false
            }
        }
        // console.log(_this);
        if(isValid){

            if (typeof _this.onSubmit === 'function') {
                var enableInputs = formElement.querySelectorAll('[name]')
                var formValues = Array.from(enableInputs).reduce(function (values, input) {
                    switch (input.type) {
                        case 'radio':
                            values[input.name] = formElement.querySelector(`input[name="${input.name}"]:checked`).value
                            break
                        case 'checkbox':
                            if(!input.matches(':checked')){
                                values[input.name]=[]
                                return values
                            }

                            if(!Array.isArray(values[input.name])){
                                values[input.name]=[]
                            }
                            values[input.name].push(input.value)
                            break;
                        case 'file':
                            values[input.name]=input.files
                            break;
                        default:
                            values[input.name] = input.value
                            break;
                    }
                    return values
                }, {})

                // console.log(formValues);
                _this.onSubmit({formValues})
            }else{ //submit mặc định
                formElement.submit()
            }
        }
    }
    // console.log(formRules);
}