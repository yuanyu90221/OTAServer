'use strict'
$(document).ready(function(){
  console.log('test')
  $('.form-signin').off('submit')  
  $('.form-signin').submit(function(e){
    e.preventDefault();
    // console.log('form-submit')
    // console.log('passwd:',this.passwd.value)
    // console.log('username:',this.username.value)
    // console.log('isCache:',this.isCache.checked)
    var data =  {
      passwd: this.passwd.value,
      username: this.username.value
    }
    // console.log(signInFormValid(data))
    if (signInFormValid(this)){
      $('#processing-modal').modal('show')
      $.ajax({
        type: 'POST',
        url: '/api/user',
        data: {
          username: data.username,
          passwd: data.passwd
        },
        success: function (data) {
          console.log(data)
          if (!data.token) {
            window.token = data.token
          }
          $('#processing-modal').modal('hide')
        }
      })
    } else {
      return
    }
  })
})

/**
 * Validation for Sign In
 * 
 * @param {*} formObj 
 */
function signInFormValid(formObj) {
  var ArraysWithName = ['passwd', 'username']
  var result = true
  ArraysWithName.forEach(function(key){
    if (formObj.hasOwnProperty(key) === false || !formObj[key].value) {
      result =  false    
    }
  }) 
  return result 
}

function register() {
  
}