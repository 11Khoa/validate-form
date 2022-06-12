//contructor function
function Validator(options) {

    function getParent(element,selector){
        while (element.parentElement) {
            if(element.parentElement.matches(selector)) return element.parentElement
            element=element.parentElement
        }
    }
    var formElement = document.querySelector(options.form)
    var selectorRules = {}

    function validate(inputElement, rule) {
        var errElement =getParent(inputElement,options.formGroup).querySelector(options.errorSelector)
        // var errElement = inputElement.parentElement.querySelector(options.errorSelector)
        var errMessage //= rule.test(inputElement.value)

        // Lấy rule selector
        var rules = selectorRules[rule.selector]

        //Lặp rule và check có lỗi stop
        for (var i = 0; i < rules.length; i++) {
            errMessage = rules[i](inputElement.value)
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errMessage=rules[i](formElement.querySelector(rule.selector+`:checked`))
                    break;
            
                default:
                    // console.log(inputElement.value);
                    errMessage=rules[i](inputElement.value)
                    break;
            }
            if (errMessage) break
        }

        if (errMessage) {
            addInvalid(inputElement, errElement, errMessage)
        } else {
            removeInvalid(inputElement, errElement, errMessage)
        }
        return !errMessage
    }
    //end validate

    function addInvalid(inputElement, errElement, errMessage) {
        errElement.innerText = errMessage
        getParent(inputElement,options.formGroup).classList.add('invalid')
    }

    function removeInvalid(inputElement, errElement) {
        errElement.innerText = ''
        getParent(inputElement,options.formGroup).classList.remove('invalid')
    }

    if (formElement) {
        formElement.onsubmit = function (e) {
            e.preventDefault()

            var isFormValid = true

            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = validate(inputElement, rule)
                if (!isValid) {
                    isFormValid = false
                }
                // console.log(inputElement.value);
            })

            //check error
            if (isFormValid) {

                //submit với js
                if (typeof options.onSubmit === 'function') {
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
                    options.onSubmit({formValues})
                }else{ //submit mặc định
                    formElement.submit()
                }
            } else {
                return
            }
        }


        options.rules.forEach(function (rule) {
            var inputElements = formElement.querySelectorAll(rule.selector)

            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            } else {
                selectorRules[rule.selector] = [rule.test]
            }

            Array.from(inputElements).forEach(function(inputElement){
                 //check input show invalid
                 inputElement.onblur = function () {
                    // console.log(rule);
                    validate(inputElement, rule)
                }

                //delete error invalid
                inputElement.oninput = function () {
                    removeInvalid(inputElement, getParent(inputElement,options.formGroup).querySelector(options.errorSelector))
                }
            })
        });
        // console.log(selectorRules);
    }
}

Validator.isRequered = function (selector, customeMsg) {
    return {
        selector,
        test: function (value) {
            // console.log(value);
            return value ? undefined : customeMsg || 'Vui long nhap truong nay'
        }
    }
}

Validator.isEmail = function (selector, customeMsg) {
    return {
        selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            // console.log(regex.test(value));
            return regex.test(value) ? undefined : customeMsg || 'Truong nay phai la email'
        }
    }
}


Validator.minLength = function (selector, min, customeMsg) {
    return {
        selector,
        test: function (value) {
            return value.length >= min ? undefined : customeMsg || `Mật khẩu tối thiểu ${min} kí tự`
        }
    }
}

Validator.isConfirm = function (selector, getConfirmValue, customeMsg) {
    return {
        selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : customeMsg || 'giá trị khác nhau'
        }
    }
}