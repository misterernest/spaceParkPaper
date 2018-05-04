<?php
//index.php

?>
 <?php include 'modal.html';
         ?>
<!DOCTYPE html>
<html>
 <head>
  <title>Reservas</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.4.0/fullcalendar.css" />
  <!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha.6/css/bootstrap.css" /> -->
  <script src="../js/jquery-3.2.1.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.4.0/fullcalendar.min.js"></script>

  <!--  -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" />
  <script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>


  <script>

  $(document).ready(function() {
   var calendar = $('#calendar').fullCalendar({
    editable:true,
    header:{
     left:'prev,next today',
     center:'title',
     right:'month,agendaWeek'
    },
    firstDay: 1,
     monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
     monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
     dayNames: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'],
     dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
     buttonText:
              {
                  prev:     ' ◄ ',
                  next:     ' ► ',
                  prevYear: ' &lt;&lt; ',
                  nextYear: ' &gt;&gt; ',
                  today:    'hoy',
                  month:    'mes',
                  week:     'semana',
                  day:      'día'
              },
    events: 'calendario/load.php',
    selectable:true,
    selectHelper:true,
    select: function(start, end, allDay)
    {
     // espacio dedicado para realizar funciones si se toca una casilla vacia
    },
    editable:false,

    eventClick:function(event)
    {
      var id = event.id;
      console.log(event.categorias);

      let fechaStart = new Date(event.start);
      let fechaEnd = new Date(event.end);
      $('#largoY_1').val(event.largo);
      $('#anchoX_1').val(event.ancho);
      $('#cliente_1').val(event.title);
      $('#categoria_1').val(event.categorias);
      $('#date_1').val(`${fechaStart.getFullYear()}-${fechaStart.getMonth()+1}-${fechaStart.getDate()+1}`);
      $('#time_1').val(event.startHora);
      $('#date1_1').val(`${fechaEnd.getFullYear()}-${fechaEnd.getMonth()+1}-${fechaEnd.getDate()+1}`);
      $('#time1_1').val(event.endHora);
      $('#comentario_1').html(event.comentario);

      $('#largoY_1').prop('readonly', true);
      $('#anchoX_1').prop('readonly', true);
      $('#date_1').prop('readonly', true);
      $('#time_1').prop('readonly', true);
      $('#date1_1').prop('readonly', true);
      $('#time1_1').prop('readonly', true);

      $('#modal_1').modal('show');
      $('#guardar_1').click(function(){
          $('#modal_1').modal('hide');
        actualizarCalBD(
          event.id,
          $('#categoria_1').val(),
          $('#cliente_1').val(),
          $('#comentario_1').val()
          );

      });
    }
   });
  });

   function actualizarCalBD (id, categoria, cliente , comentario){
 // Convertir a objeto
 var data = {};

 data.id = id;
 data.categoria = categoria;
 data.cliente = cliente;
 data.comentario = comentario;
 var url = 'calendario/update.php';   //este es el PHP al que se llama por AJAX

  resultado = new Array();
     $.ajax({
       method: 'POST',
       url: url,
       data: data,   //acá están todos los parámetros (valores a enviar) del POST
       success: function(response){
         // resultado es un array que indica exitoso o no.
      console.log(response);

         if(response == "1"){
           $('#myAlertLabel').text("ACTUALIZACION")
           $('#msj-alert').text(``);
           $('#msj-alert').append(`<div class="col-lg-11 col-md-11">Datos actualizados correctamente</div>`)
           $('#alert').modal('show');
         }else{
           $('#myAlertLabel').text("ERROR")
           $('#msj-alert').text(``);
           $('#msj-alert').append(`<div class="col-lg-11 col-md-11">No se pudo actualizar los Datos error al en base de datos</div>`)
           $('#alert').modal('show');
         }
         $("#enterado").click(function(){
           location.reload();
         });
       },
       error: function( jqXHR, textStatus, errorThrown ) {
         $('#myAlertLabel').text("ERROR")
         $('#msj-alert').text(``);
         $('#msj-alert').append(`<div class="col-lg-11 col-md-11">ERROR ${textStatus} - ${jqXHR} - ${errorThrown}</div>`)
         $('#alert').modal('show');
       }
     });
   }

  </script>
 </head>
 <body>
  <br />
  <h2 align="center"><a href="gantt.php" target="_blank">Calendario para Reservas</a></h2>
  <br />
  <div class="container">
   <div id="calendar"></div>
  </div>
 <?php
  include 'modal_1.html';
  include 'alert.html';
  ?>
 </body>
</html>
