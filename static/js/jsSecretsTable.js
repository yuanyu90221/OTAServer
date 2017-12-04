$(document).ready(function(){
    // $("#secretsTbl").DataTable()
    // secretsTbl.fnAddData([{userId:1, number:1}])
    
})
                
/**
 * add Data to Datatable
 * 
 * @param {*} data 
 */
function appendData(data) {
  // SecretsMngTbl.fnAddData(data)
  console.log(data.data[0])
  $('#secretsTbl .panel-heading').text(data.data[0].userId)
  $('#secretsTbl .panel-body').text(data.data[0].secret)
}