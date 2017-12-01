'use strict'
$(document).ready(function(){
  console.log('test')  
  $('.form-signin').submit(function(e){
    e.preventDefault();
    // console.log('form-submit')
    console.log('passwd:',this.passwd.value)
    console.log('username:',this.username.value)
    console.log('isCache:',this.isCache.checked)
    var data =  {
      passwd: this.passwd.value,
      username: this.username.value
    }
    console.log(signInFormValid(data))
    // $.ajax({
      
    // })

    $('#processing-modal').modal('show')
    $.ajax({
      type: 'POST',
      url: '/api/user',
      data: {
        username: data.username,
        passwd: data.passwd
      },
      // dataType: 'application/json',
      success: function (data) {
        console.log(data)
        $('#processing-modal').modal('hide')
      }
    })
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