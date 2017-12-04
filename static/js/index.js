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
          if (data.token) {
            window.token = data.token
            $('#loginForm').remove()
          }
          
          $('#processing-modal').modal('hide')
        }
      })
    } else {
      return
    }
  })
  //
  $('#getAllSecrets').off('click')
  $('#getAllSecrets').on('click', function(e){
    console.log('click All Secrets')
    getAllSecrets()
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
/**
 * get All Secrets
 * 
 */
function getAllSecrets() {
  var token = window.token || ''
  $('#processing-modal').modal('show')
  $.ajax({
    type: 'GET',
    url: '/api/getAllSecrets',
    data: {
      token: token
    },
    success: function (data) {
      console.log(data)
      appendData(data)
      $('#processing-modal').modal('hide')
    }
  })
}