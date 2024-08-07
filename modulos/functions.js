//  Functions general cards

export function pintarCheckbox(arregloCategorias) {
  for (let i = 0; i < arregloCategorias.length; i++) {
    const nuevoCheck = document.createElement("div")
    nuevoCheck.className = "form-check form-check-inline text-light"
    nuevoCheck.innerHTML = `
    
                    <input type="checkbox" class="form-check-input " value="${arregloCategorias[i]}" id="${arregloCategorias[i]}"> 
                    <label for="${arregloCategorias[i]}"class="form-check-label" for="${arregloCategorias[i]}"> ${arregloCategorias[i]}</label>
                  
    `
    document.getElementById("checkboxContainer").appendChild(nuevoCheck)

  }

}
export function filtroTexto(arregloEventos) {
  let texto = document.getElementById("inputTexto").value.toLowerCase()
  console.log(texto)
  let arregloFiltrado = arregloEventos
  if (texto != null || texto != undefined) {
    arregloFiltrado = arregloEventos.filter(evento => evento.name.toLowerCase().includes(texto)) || evento.description.toLowerCase().includes(texto)

  }
  return arregloFiltrado


}
export function filtroChecks(arregloEventos) {
  let checkboxChecked = [...document.querySelectorAll('input[type=checkbox]:checked')]
  checkboxChecked = checkboxChecked.map(e => e.value)

  let arregloFiltrado = arregloEventos
  if (checkboxChecked.length != 0) {
    arregloFiltrado = arregloEventos.filter(evento => checkboxChecked.includes(evento.category))
  }
  return arregloFiltrado


}
export function pintarTarjetas(arregloEventos) {

  let contenedorTarjetas = document.getElementById("contenedorTarjetas")
  contenedorTarjetas.innerHTML = ""
  if (arregloEventos.length === 0) {
    contenedorTarjetas.innerHTML = '<div class="card container-flex text-center "><p class="card-header card-title text-center">No items found. </p> <img id="dogo" src="https://www.shutterstock.com/image-photo/funny-cute-dog-beagle-looks-600nw-2057440388.jpg" alt="dogo"> </div>    '
    return
  }

  for (let i = 0; i < arregloEventos.length; i++) {
    const tarjeta = document.createElement("div")
    tarjeta.className = "card m-2 container-flex "
    tarjeta.innerHTML = `
      <img id="imgCard" class="m-1" src="${arregloEventos[i].image}" class="card-img-top">
    
        <h5 class="card-header card-title text-center">${arregloEventos[i].name}</h5>
          <div class="card-body justify-content-center">
        <p class="card-text text-center">${arregloEventos[i].description}</p>
        
          <p class="card-text text-center m-2">Price: ${arregloEventos[i].price} </p>
<div class="container-fluid d-flex justify-content-center card-footer p-3 ">
          <a href="details.html?id=${arregloEventos[i]._id}" class="btn bg-dark "> <h5>Details </h5></a>
        </div>
       
      </div>
    `
    contenedorTarjetas.appendChild(tarjeta)

  }
}

// Functions Stats Page
export function createEventTable() {
  fetch('https://aulamindhub.github.io/amazing-api/events.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const tableHTML = generateTableHTML(data);

      const tableContainer = document.getElementById('tableContainer');
      tableContainer.innerHTML = tableHTML;
    })
    .catch(error => {
      console.error('Error al obtener los datos:', error);

      const tableContainer = document.getElementById('tableContainer');
      tableContainer.innerHTML = '<p>No Data Found.</p>';
    });
}
export function generateTableHTML(data) {

  const calculateAssistancePercentage = (assistance, capacity) => {
    return ((assistance / capacity) * 100).toFixed(2);
  };


  const highestAssistanceEvent = data.events.reduce((prev, current) => {
    const prevPercentage = calculateAssistancePercentage(prev.assistance || prev.estimate, prev.capacity);
    const currentPercentage = calculateAssistancePercentage(current.assistance || current.estimate, current.capacity);
    return prevPercentage > currentPercentage ? prev : current;
  });

  const lowestAssistanceEvent = data.events.reduce((prev, current) => {
    const prevPercentage = calculateAssistancePercentage(prev.assistance || prev.estimate, prev.capacity);
    const currentPercentage = calculateAssistancePercentage(current.assistance || prev.estimate, current.capacity);
    return prevPercentage < currentPercentage ? prev : current;
  });


  const largestCapacityEvent = data.events.reduce((prev, current) => {
    return prev.capacity > current.capacity ? prev : current;
  });


  let tableHTML = `
      <table class="table table-dark table-hover table-bordered">
          <thead class="table-light">
              <tr>
                  <th colspan="3">Events Statistics</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <th>Events with highest % of assistance</th>
                  <th>Events with lowest % of assistance</th>
                  <th>Events with large capacity</th>
              </tr>
              <tr>
                  <td>${highestAssistanceEvent.name} (${calculateAssistancePercentage(highestAssistanceEvent.assistance, highestAssistanceEvent.capacity)}%)</td>
                  <td>${lowestAssistanceEvent.name} (${calculateAssistancePercentage(lowestAssistanceEvent.assistance, lowestAssistanceEvent.capacity)}%)</td>
                  <td>${largestCapacityEvent.name} (${largestCapacityEvent.capacity})</td>
              </tr>
          </tbody>
          </table> 
                     
  `;

  return tableHTML;

}
export async function createTable() {

  const tableContainer = document.getElementById('tableContainerTres');


  const response = await fetch('https://aulamindhub.github.io/amazing-api/events.json');
  const data = await response.json();


  const futureEvents = data.events.filter(event => new Date(event.date) > new Date(data.currentDate));


  const eventsByCategory = {};
  futureEvents.forEach(event => {
    if (!eventsByCategory[event.category]) {
      eventsByCategory[event.category] = {
        revenue: 0,
        totalAssistance: 0,
        capacity: 0
      };
    }
    eventsByCategory[event.category].revenue += event.price * (event.assistance || event.estimate);
    eventsByCategory[event.category].totalAssistance += event.assistance || event.estimate;
    eventsByCategory[event.category].capacity += event.capacity;
  });


  let tableHTML = `
      <table class="table table-dark table-hover table-bordered">
          <thead class="table-light">
              <tr>
                  <th colspan="3">Upcoming events Statistics by category</th>
              </tr>
              <tr>
                  <th>Categories</th>
                  <th>Revenues</th>
                  <th>Porcentage of assistance</th>
              </tr>
          </thead> 

          <tbody>`;


  for (const category in eventsByCategory) {
    const { revenue, totalAssistance, capacity } = eventsByCategory[category];
    const percentage = ((totalAssistance / capacity) * 100).toFixed(2);
    tableHTML += `
          <tr>
              <td>${category}</td>
              <td>$${revenue}</td>
              <td>${percentage}%</td>
          </tr>`;
  }

  tableHTML += `
          </tbody>
      </table>`;


  tableContainer.innerHTML = tableHTML;
}
export async function createTableDos() {

  const tableContainerDos = document.getElementById('tableContainerCuatro');

  const response = await fetch('https://aulamindhub.github.io/amazing-api/events.json');
  const data = await response.json();

  const pastEvents = data.events.filter(event => new Date(event.date) < new Date(data.currentDate));


  const eventsByCategory = {};
  pastEvents.forEach(event => {
    if (!eventsByCategory[event.category]) {
      eventsByCategory[event.category] = {
        revenue: 0,
        totalAssistance: 0,
        capacity: 0
      };
    }
    eventsByCategory[event.category].revenue += event.price * (event.assistance || event.estimate);
    eventsByCategory[event.category].totalAssistance += event.assistance || event.estimate;
    eventsByCategory[event.category].capacity += event.capacity;
  });


  let tableHTML = `
    <table class="table table-dark table-hover table-bordered">
      <thead class="table-light">
        <tr>
          <th colspan="3">Past events Statistics by category</th>
        </tr>
        <tr>
          <th>Categories</th>
          <th>Revenues</th>
          <th>Porcentage of assistance</th>
        </tr>
      </thead> 

      <tbody>`;


  for (const category in eventsByCategory) {
    const { revenue, totalAssistance, capacity } = eventsByCategory[category];
    const percentage = ((totalAssistance / capacity) * 100).toFixed(2);
    tableHTML += `
      <tr>
        <td>${category}</td>
        <td>$${revenue}</td>
        <td>${percentage}%</td>
      </tr>`;
  }

  tableHTML += `
      </tbody>
    </table>`;


  tableContainerDos.innerHTML = tableHTML;
}

//functions Details Page
export function pintarTarjetaDetalles() {
  fetch('https://aulamindhub.github.io/amazing-api/events.json')
    .then(response => response.json())
    .then(data => {
      const urlparams = new URLSearchParams(window.location.search);
      const eventoId = urlparams.get('id');
      const events = data.events;
      console.log(eventoId)
      for (let i = eventoId; i < events; i++) {
        const event = events[i - 1];
        console.log(event)
        const capacityString = event.capacity !== null && event.capacity !== undefined ? `Capacity: ${event.capacity}` : '';
        const estimateString = event.estimate !== null && event.estimate !== undefined ? `Estimate: ${event.estimate}` : '';
        const cardContainer = document.getElementById('card');

        const cardContent = `

  <div class="card  container col-md-5 row justify-content-center text-center">
      <img id="imgDetails" class="p-2" id="imgDet" src="${event.image}" alt="${event.name}">
      <h5 id="titleHeader"class="card-title card-header bg-dark">${event.name}</h5>
      <div class="card-body">
      <p class="card-text">Date: ${event.date} </p>
      <p class="card-text">Description: ${event.description}</p>
      <p class="card-text">Category: ${event.category}</p>
      <p class="card-text">Place: ${event.place}</p>
      <p class="card-text"> ${capacityString}</p>
      <p class="card-text">  ${estimateString}</p>
      <p class="card-text">Price: ${event.price}</p>
      </div>
    </div>
  </div>
  `;

        cardContainer.innerHTML = cardContent;
      }

    })
    .catch(error => console.error('Error al obtener los eventos:', error));


}

