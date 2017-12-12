$(document).ready(function(){
  $('.form-modify').off('submit')
  $('.form-modify').submit(function(e) {
    e.preventDefault()
    $('#processing-modal').modal('show')
    $.ajax({
      type: 'POST',
      url: '/api/modifySecret',
      data: {
        userId: this.userId.value,
        secret: this.secret.value,
        keyNum: this.keyNum.value,
        token: window.token
      },
      success: function(data) {
        // console.log(data)
        window.token = data.data[0].token
        getAllSecrets()
        $('#processing-modal').modal('hide')
        $('#modify-modal').modal('hide')      
      },
      error: function(xhr, textStatus, thrownError) {
        alert(thrownError.message)
        $('#processing-modal').modal('hide')
      }
    })
  })
})
/**
 * fill data into datatable
 * 
 * @param {*} data 
 * @param {*} index 
 */
function fillInData(data, index) {
  return '<div class="well" id="secret' + index+ '">'
  + '<div class="item"><label>UserId:</label><div class="userId">' + data.userId + '</div></div>'
  + '<div class="item"><label>KeyNum:</label><div class="keyNum">' + data.keyNum + '</div></div>'
  + '<div class="item"><label>Secret:</label><div class="secret">' + data.secret + '</div></div>'
  + '<div class="item"><label>ModifiedTime:</label><div class="time">' + new Date(data.modifiedDate).toLocaleString() + '</div></div>'
  + '<button class="btn btn-primary"  onClick="updateSecret(' + index + ')">Modify Secret</button>'
  '</div>'
}                
/**
 * add Data to Datatable
 * 
 * @param {*} data 
 */
function appendData(data) {
  var contentSpace = $('#secretsTbl')
  var results = data.data
  
  contentSpace.empty()
  results.forEach(function(content, index) {
    contentSpace.append(fillInData(content, index))
  })
}
/**
 * update Secret to Modify Modal
 * 
 * @param {*} index 
 */
function updateSecret(index) {
  $('#editForm input[name="secret"]').val($('#secret' + index + ' .secret').text())
  $('#editForm input[name="userId"]').val($('#secret' + index + ' .userId').text())
  $('#editForm input[name="keyNum"]').val($('#secret' + index + ' .keyNum').text())
  $('#modify-modal').modal('show')
}