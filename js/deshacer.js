$(document).ready(function(){
  $("#deshacer").click(function(){
    if(btn_deshacer){
      deshacerAjax();
    }
  });
  function deshacerAjax(){
   // Convertir a objeto
   var url = 'deshacer.php';   //este es el PHP al que se llama por AJAX
       $.ajax({
           method: 'POST',
           url: url,
           success: function(response){
               // resultado es un array que indica exitoso o no.

                   location.reload();
           },
           error: function( jqXHR, textStatus, errorThrown ) {
             $('#myAlertLabel').text("ERROR")
             $('#msj-alert').text(``);
             $('#msj-alert').append(`<div class="col-lg-11 col-md-11">ERROR ${textStatus} - ${errorThrown}</div>`)
             $('#alert').modal('show');
           }
         });
       }

});
