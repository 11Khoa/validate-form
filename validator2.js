function Validator(formSelector) {
    var _this=this
    function getParentElement(element,selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)) return element.parentElement
            element=element.parentElement
        }
    }


    //https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }


    //https://stackoverflow.com/questions/11246758/how-to-get-unique-values-in-an-array
    function findUnique(arr, predicate) {
        var found = {};
        
        // found.hasOwnProperty()
        arr.forEach((d,index) => {
             found[predicate(d)] = d;
        });
        var ob=Object.keys(found).map((key,index) =>{
            
            return found[key]
        }); 
        return ob
      }
        // usage example:
        // var a = ['a', 1, 'a', 2, '1'];
        // var unique = a.filter(onlyUnique);
        // console.log(unique); // ['a', 1, 2, '1']

    
        // https://stackoverflow.com/questions/51537568/how-to-get-unique-values-from-object-array-javascript
        function unique(data) {
            var resArr = [];
            data.filter(function(item){
            var i = resArr.findIndex(x => 
                (x.key == item.key));
            if(i <= -1){
                // console.log(item.value);
                    resArr.push(item);
            }
            return null;
            });
            return resArr
        }
        //================================================


    //https://stackoverflow.com/questions/45593598/check-if-multiple-radio-buttons-are-checked
    function getCheckedButton(element) {
        var i = 0;
        var formValid = false;
        while (!formValid && i < element.length) {
            if (element[i].checked) formValid = true;
            i++;
        }
        return formValid
    }
    // console.log(getCheckedButton());
    var formRules={}
    var formElement=document.querySelector(formSelector)
    var validattorRules={
        required:function(value,select){
            var messageCustome=select.dataset.errormsg
            var radios=formElement.querySelectorAll(`[name="${select.name}"]`)
            console.log();
           
            if(radios[0].type==='radio' || radios[0].type==='checkbox'){
               value=getCheckedButton(radios)
            }
           
            
            return value ? undefined : messageCustome || 'Vui lòng nhập trường này'
        },
        email:function(value,messageCustome){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : messageCustome || 'Vui lòng nhập đúng địa chỉ email'
        },
        comparewith:function(compare){
            return function(value){
                var elementCompare=formElement.querySelectorAll(`input[name="${compare}"]`)
                var elementValue=elementCompare[0].value
                var msgCustome=elementCompare[1].dataset.errormsg
                // console.log(msgCustome);

                return value===elementValue ? undefined : msgCustome || `Nội dung không trùng khớp với nhau`
            }
        },
        min:function(min){
            return function(value){
                return value.length>=min ? undefined : `Nhập ít nhất ${min} ký tự`
            }
        },
        max:function(max){
            return function(value){
                return value.length<=max ? undefined : `Tối đa ${max} ký tự`
            }
        }
    }

    if(!formElement) return

    var inputs=formElement.querySelectorAll('[name][rules]')
    for (var input of inputs){
        var rules=input.getAttribute('rules').split('|')
        
        for (var rule of rules){
            var ruleInfo,ruleFunc
            // var regex=/[^a-zA-Z0-9_ ]/gm //chỉ lấy a-z 0-9 và _ với (dấu cách" ")
            var isRuleHasValue=rule.includes(':')

            if(isRuleHasValue){
                ruleInfo=rule.split(':')
                rule=ruleInfo[0]
                // console.log(validattorRules[rule](ruleInfo[1]));
            }

            ruleFunc=validattorRules[rule]
        //    console.log(ruleFunc);

            if(isRuleHasValue){
                ruleFunc=ruleFunc(ruleInfo[1])
            }

            if(Array.isArray(formRules[input.name])){
                formRules[input.name].push(ruleFunc)
            }else{
                // console.log(ruleFunc);
                formRules[input.name]=[ruleFunc]
            }
        }


        // event check every input, non step
        // ===================================================

        input.onblur=handleValidate
        input.oninput=handleClearErr

        // ===================================================
    }

    // var confirmInfo=formElement.querySelector('.form-submit')

    // ===================================================

    function handleValidate(e){
        var rules=formRules[e.target.name]
        // rules[0](e.target.value,e.target.dataset.errormsg)
        var errorMessage

        // console.log(e.target);
        for(var rule of rules){
            //add value and element to validattorRules.[name]
            errorMessage= rule(e.target.value,e.target)
            if(errorMessage) break
        }

        if(errorMessage){
            var formGroup=getParentElement(e.target,'.form-group')

            // if(errCustome){
            //     errorMessage=errCustome
            // }

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

    var btnBeforeSubmit=formElement.querySelector('.form-submit')
    var formMain=formElement.querySelector('.form-main')
    var formInput=formMain.querySelector('.form-input')
    var btnBack=formMain.querySelector('.form-back')
    btnBeforeSubmit.addEventListener('click',function (e) {
        e.preventDefault()
        var inputs=formElement.querySelectorAll('[name][rules]')
        var isValid=true
        // if(!getCheckedButton()){
        //     console.log(validattorRules.required(1,"nguyen dang khoa"));
        // }
        for(var input of inputs){
            if(!handleValidate({target:input})){
                isValid=false
            }
        }


        var formValues
        var enableInputs = formElement.querySelectorAll('[name]')
        if(isValid){
            if (typeof _this.onSubmit === 'function') {
                formValues = Array.from(enableInputs).reduce(function (values, input) {
                    switch (input.type) {
                        case 'radio':
                            values[input.name] = formElement.querySelector(`input[name="${input.name}"]:checked`).value
                            break
                        case 'checkbox':
                            
                            if(!input.matches(':checked')){
                                return values
                            }

                            if(!Array.isArray(values[input.name])){
                                values[input.name]=[]
                            }
                            
                            values[input.name].push(input.value)
                            break;
                        case 'select-one':
                            if(input.selectedIndex>0){
                                values[input.name]=input.options[input.selectedIndex].text
                            }
                            break;
                        case 'file':
                            if(input.files.length>0){
                                values[input.name]=input.files
                            }
                            break;
                        default:
                            values[input.name] = input.value
                            break;
                    }
                    return values
                }, {})

                var formClone=formElement.querySelectorAll('.form-group')
                var elClone=[]
                

                for(var group of formClone){
                    var title=group.querySelector('.form-label').innerText
                    var key=group.querySelector('[name]').getAttribute('name')
                    
                    elClone.push({
                        key:key,
                        title:title
                    })
                    
                }

                var title=unique(elClone)
                
                // console.log(title);
                var elementGroup=[]
                Object.keys(title).forEach(key=>{
                    // console.log(title[key].title,formValues[title[key].key]);
                    if(formValues[title[key].key]){
                        if(/(file)/.test(title[key].key)){
                            // console.log(formValues[title[key].key][0].name);
                            elementGroup.push(`
                                <div class="form-group">
                                    <label for="${title[key].key}" class="form-label">${title[key].title}:</label>
                                    <div class="form-value">
                                        <span class="${title[key].key}">${formValues[title[key].key][0].name}</span>
                                    </div>
                                </div>
                            `)
                        }else{
                            elementGroup.push(`
                                <div class="form-group">
                                    <label for="${title[key].key}" class="form-label">${title[key].title}:</label>
                                    <div class="form-value">
                                        <span class="${title[key].key}">${formValues[title[key].key]}</span>
                                    </div>
                                </div>
                            `)
                        }
                    }
                   
                })
                var html=`
                <div class="form-confirm">
                    ${elementGroup.join("")}
                </div>
                `

                // console.log(html);
                
                formInput.insertAdjacentHTML("afterend", html);
                formInput.style.display='none'
                btnBack.style.display='block'

                
                // _this.onSubmit({formValues})



                // console.log(formValues);


            }else{ //submit mặc định
                formElement.submit()
            }
        }
    })
    btnBack.addEventListener('click',function(e){
        e.preventDefault()
        var formConfirm=formMain.querySelector('.form-confirm')
        formConfirm.remove()
        formInput.style.display='block'
        btnBack.style.display='none'
    })


    //=========================================================================
    // formElement.onsubmit=function(e){
    //     e.preventDefault()
        
    //     var inputs=formElement.querySelectorAll('[name][rules]')
    //     var isValid=true

    //     for(var input of inputs){
    //         if(!handleValidate({target:input})){
    //             isValid=false
    //         }
    //     }
    //     // console.log(_this);
    //     if(isValid){
    //         var formValues
    //         if (typeof _this.onSubmit === 'function') {
    //             var enableInputs = formElement.querySelectorAll('[name]')
    //             // console.log(enableInputs);
    //             formValues = Array.from(enableInputs).reduce(function (values, input) {
    //                 switch (input.type) {
    //                     case 'radio':
    //                         values[input.name] = formElement.querySelector(`input[name="${input.name}"]:checked`).value
    //                         // console.log(values[input.name]);
    //                         break
    //                     case 'checkbox':
                            
    //                         if(!input.matches(':checked')){
    //                             return values
    //                         }

    //                         if(!Array.isArray(values[input.name])){
    //                             values[input.name]=[]
    //                         }
                            
    //                         values[input.name].push(input.value)
    //                         break;
    //                     case 'select-one':
    //                         if(input.selectedIndex>0){
    //                             values[input.name]=input.options[input.selectedIndex].text
    //                         }
    //                         break;
    //                     case 'file':
    //                         if(input.files.length>0){
    //                             values[input.name]=input.files
    //                         }
    //                         break;
    //                     default:
    //                         values[input.name] = input.value
    //                         break;
    //                 }
    //                 // console.log(values);
    //                 return values
    //             }, {})

    //             var formClone=formElement.querySelectorAll('.form-group')
    //             var elClone=[]
                
    //                     for(var group of formClone){
    //                         var caption=group.getElementsByTagName('label')
    //                         var input=group.querySelector('[name]')
    //                         // console.log(caption[0].outerHTML);
    //                         // var value=group.get
    //                         // console.log(formValues[input.name]);  <span class="${input.name}">${formValues[input.name]}</span>
    //                         // console.log(input.name,'//'+formValues[input.name]);

    //                         elClone.push(`
    //                                 <div class="form-group">
    //                                     <div class="form-caption">${caption[0].outerHTML}</div>
    //                                     <div class="form-value">
    //                                         <span class="${input.name}">${formValues[input.name]}</span>
    //                                     </div>
    //                                 </div>
    //                         `)
    //                     }
    //             var html=`
    //             <div class="form-confirm">
    //                 ${elClone.join("")}
    //             </div>
    //             `

    //             // var formMain=formElement.querySelector('.form-main')
    //             // var formInput=formMain.querySelector('.form-input')
    //             // var btnBack=formMain.querySelector('form-back')
    //             // formMain.classList.add('form-confirm')
    //             // formInput.insertAdjacentHTML("afterend", html);
    //             // formInput.style.display='none'


    //             // btnBack.addEventListener('click',function(){
    //             //     console.log(1);
    //             // })
    //             // _this.onSubmit({formValues})
    //             console.log(formValues);
    //         }else{ //submit mặc định
    //             formElement.submit()
    //         }
    //     }
    // }
    //=========================================================================


    // console.log(formRules);
    
    //prevent a user close/leave a browser
    // window.onbeforeunload = function(){
    //     return '';
    // };
}
