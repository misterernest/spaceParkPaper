$(document).ready(function(){
  let respuestaConsulta = new Array();

  const hoy = new Date();
  const dd = hoy.getDate();
  const mm = hoy.getMonth()+1; //hoy es 0!
  const yyyy = hoy.getFullYear();
  const hour = hoy.getHours();
  const min = 00;
  const seg = 00;
  consultarBaseDatosGantt(`${yyyy}-${mm}-${dd}`, 180);
  google.charts.load('current', {'packages':['gantt']});
  let heightGant;


  // Recorre la consulta a la base de datos, para enviarla al diagrama de gantt
  function consultaGantt(arrayConsulta){
    let dateInicial = new Date();
    let dateFinal = new Date();
    google.charts.setOnLoadCallback(drawChart);
    heightGant = 200 * arrayConsulta.length;
    for (let i = 0; i < arrayConsulta.length; i++) {
      dateInicial.setTime(Date.parse(arrayConsulta[i].fecha_incial));
      dateFinal.setTime(Date.parse(arrayConsulta[i].fecha_final));
      respuestaConsulta[i] = [
        `${arrayConsulta[i].id}`,
        `id:${arrayConsulta[i].id} - ${arrayConsulta[i].categoria} (${arrayConsulta[i].cliente})`,
        `W:${arrayConsulta[i].ancho_x}mts x H:${arrayConsulta[i].ancho_x}mts`,
        new Date(dateInicial.getFullYear(), dateInicial.getMonth(), dateInicial.getDate()),
        new Date(dateFinal.getFullYear(), dateFinal.getMonth(), dateFinal.getDate()),
        null,
        100,
        null
      ]
    }
  }

  /* Consulta la base de datos por meses */
  function consultarBaseDatosGantt (date,dias){

    // Convertir a objeto
    var data = {};

    data.date = date;
    data.dias = dias;
    data.categoria = '';

    var url = 'consultar.php';   //este es el PHP al que se llama por AJAX
    $.ajax({
      method: 'POST',
      url: url,
      data: data,   //acá están todos los parámetros (valores a enviar) del POST
      success: function(response){
        consultaGantt(response);
      },
      dataType:"json"
    });
  }


    function drawChart() {
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Task ID');
      data.addColumn('string', 'Task Name');
      data.addColumn('string', 'Resource');
      data.addColumn('date', 'Start Date');
      data.addColumn('date', 'End Date');
      data.addColumn('number', 'Duration');
      data.addColumn('number', 'Percent Complete');
      data.addColumn('string', 'Dependencies');
      data.addRows(respuestaConsulta);

      var options = {
        height: heightGant,
        gantt: {
          trackHeight: 30
        }
      };
      var chart = new google.visualization.Gantt(document.getElementById('chart_div'));

      chart.draw(data, options);
    }
  });
