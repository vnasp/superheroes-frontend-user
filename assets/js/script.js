$(document).ready(function () {
  // Inicio con el div de resultados oculto
  $("#searchResult").hide();
  busquedaHeroe();

  // Año en el footer
  const currentYear = new Date().getFullYear();
  $("#year").text(currentYear);
});

// Separé en funciones para mejorar la mantención del código
function busquedaHeroe() {
  $("#searchButton").click(function () {
    // Capturo el dato desde el input
    let id_heroe = $("#searchInput").val();

    // Primero valido si no es número o si está fuera del rango y vacío el input
    if (!$.isNumeric(id_heroe) || id_heroe < 1 || id_heroe > 731) {
      alert("Por favor, ingresa un número válido del 1 al 731.");
      $("#searchInput").val("");
    } else {
      consumirAPI(id_heroe);
    }
  });
}

function consumirAPI(id_heroe) {
  // Datos API
  const API_URL = "https://superheroapi.com/api/";
  const TOKEN = "4905856019427443";

  $.ajax({
    url: API_URL + TOKEN + "/" + id_heroe,
    type: "GET",
    dataType: "json",
    success: function (data) {
      // Oculto el div del home, muestro el div de resultados
      $("#default").hide();
      $("#searchResult").show();

      // Función para mostrar los datos en el DOM
      mostrarHeroe(data);
      datosGrafico(data.powerstats);
      // Vacío el input después de la búsqueda exitosa
      $("#searchInput").val("");
    },
    error: function (xhr, status, error) {
      console.error("Error: " + status + " " + error);
    },
  });
}

function mostrarHeroe(data) {
  // Modifico los elementos del DOM con los datos del héroe
  $("#superHeroeName, #superHeroeGraphName").text(data.name);
  $("#superHeroeImage").attr("src", data.image.url);
  $("#superHeroeImage").attr("alt", data.name);
  $("#superHeroeDesc").text(
    "También conocido como " +
      data.biography.aliases +
      ". Su primera aparición fue en " +
      data.biography["first-appearance"] +
      "."
  );
  $("#superHeroeID").text(data.id);

  if (data.appearance.gender === "Female") {
    $("#superHeroeGender").text("Mujer");
  } else if (data.appearance.gender === "Male") {
    $("#superHeroeGender").text("Hombre");
  } else {
    $("#superHeroeGender").text("-");
  }

  if (data.appearance.race === "null") {
    $("#superHeroeRace").text("-");
  } else {
    $("#superHeroeRace").text(data.appearance.race);
  }

  if (data.biography.alignment === "good") {
    $("#superHeroeTeam").text("Aliado");
  } else if (data.biography.alignment === "bad") {
    $("#superHeroeTeam").text("Enemigo");
  } else {
    $("#superHeroeTeam").text("-");
  }
}

function datosGrafico(datos) {
  // Preparo los datos par el gráfico
  const statsLabels = [];
  const statsValues = [];
  for (const [key, value] of Object.entries(datos)) {
    statsLabels.push(key + " (" + value + ")");
    statsValues.push(parseInt(value, 10));
  }
  mostrarGrafico(statsLabels, statsValues);
}

function mostrarGrafico(statsLabels, statsValues) {
  var ctx = $("#superHeroeStats").get(0).getContext("2d");

  // Si hago una nueva búsqueda, que borre todo lo anterior de ese div
  if (window.myRadarChart) {
    window.myRadarChart.destroy();
    $("#superHeroeNoStats").text("");
  }

  // Si el personaje no tiene stats, que de un mensaje
  if (statsValues.some(isNaN)) {
    $("#superHeroeNoStats").text(
      "Este personaje no tiene stats para graficar."
    );
  }

  // Gráfico de ChartJS porque quería uno tipo radar
  window.myRadarChart = new Chart(ctx, {
    type: "radar",
    data: {
      labels: statsLabels,
      datasets: [
        {
          data: statsValues,
          fill: true,
          backgroundColor: "rgba(255, 217, 90, 0.5)",
          borderColor: "rgb(204, 149, 24)",
          pointBackgroundColor: "rgb(255, 99, 132)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgb(255, 99, 132)",
          pointRadius: 0,
        },
      ],
    },
    options: {
      elements: {
        line: {
          borderWidth: 3,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        r: {
          ticks: {
            display: false,
          },
        },
      },
    },
  });
}
