Validator({
    form:'#form-1',
    formGroup:'.form-group',
    errorSelector:'.form-message',
    rules:[
      Validator.isRequered('#fullname'),
      Validator.isRequered('#province', "Vui lòng chọn tỉnh thành"),
      Validator.isRequered('#email'),
      Validator.isEmail('#email'),
      Validator.isConfirm('#c_email',function () {
        return document.querySelector('#form-1 #email').value
      },"Email không trùng khớp"),
      Validator.isRequered('input[name="gender"]','Vui lòng chọn giới tính'),
      // Validator.isRequered('input[name="color"]'),
      Validator.isRequered('#password'),
      Validator.minLength('#password',5),
      Validator.isRequered('#password_confirmation'),
      Validator.isConfirm('#password_confirmation',function () {
        return document.querySelector('#form-1 #password').value
      },"Mật khẩu không trùng khớp")
    ],
    onSubmit: function(data){
      // console.log(data);
      $.ajax({
            url: 'http://localhost:3000/email/send',
            type: 'POST',
            dataType: 'json',
            data,
            beforeSend: function() {
              if ($(".fc-loading").length < 1) $("body").append('<div class="fc-loading" />');
                $(".fc-loading").addClass("active");
                // elm.find("button").prop("disabled", true);
            },
            success: function(json) {
              console.log(json);
              if (json.status == "success") {
                $(".fc-loading").removeClass("active");
              }
            },
            error: function(json){
              alert(json.error)
              console.log(json.error);
              $(".fc-loading").removeClass("active");
            }
        })
    }
  })