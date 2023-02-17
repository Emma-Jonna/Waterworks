mapboxgl.accessToken =
  "pk.eyJ1IjoiY2FwdGFpbmNhdGxhZHkiLCJhIjoiY2xkdWFqN3lwMDN2djNwcW9yeHBkeDRqbyJ9.sDDirsJ2Zj8gpAZWB9HlFQ";
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/doughnuteagle/cle4bsayi000x01oc94n1x17p", // style URL
  center: [12.012207669236538, 57.65732635513358], // starting position [lng, lat]
  zoom: 9, // starting zoom
});

map.on("idle", function () {
  map.resize();
});

const getInfo = async () => {
  const response = await fetch(
    "https://data.goteborg.se/RiverService/v1.1/MeasureSites/f43ea846-245a-4797-b66b-d34b33e98df6?&format=Json"
  );

  const resp = await response.json();

  // console.log(resp[0].Description);

  // createMarkers(waterdata);

  createMarkers(resp);
  const waterInfo = document.querySelector(".all-water-info");
  const button = document.querySelector(".button");

  //get out and print data for all the water informations
  resp.forEach((waterData) => {
    const header = document.createElement("h2");

    header.style.color = "red";

    header.textContent = waterData.Code;
    waterInfo.appendChild(header);
    waterData.MeasureParameters.forEach((messurments) => {
      if (messurments.Code === "Level") {
        const p = document.createElement("p");
        p.style.color = "red";
        p.textContent = messurments.CurrentValue;
        waterInfo.appendChild(p);
      }
    });
  });
  waterInfo.classList.add("hidden");
  button.addEventListener("click", () => {
    // console.log(resp);
    if (waterInfo.classList.contains("hidden")) {
      waterInfo.classList.remove("hidden");
    } else waterInfo.classList.add("hidden");
  });

  try {
  } catch (error) {}
};

const createMarkers = async (resp) => {
  const waterdata = await resp;
  waterdata.forEach((element) => {
    //changes color
    let markerColor = "black";
    if (element.MeasureParameters[0].CurrentValue >= 10) {
      markerColor = "blue";
    }
    if (element.MeasureParameters[0].CurrentValue >= 60) {
      markerColor = "green";
    }

    if (!element.MeasureParameters[0].CurrentValue) {
      element.MeasureParameters[0].CurrentValue = "No data available";
    }
    // console.log(element.Description);
    // console.log(`Latitude: ${element.Lat}, Longitude${element.Long}`);
    const marker = new mapboxgl.Marker({ color: markerColor })

      .setLngLat([element.Long, element.Lat])

      .addTo(map)
      .setPopup(
        new mapboxgl.Popup().setHTML(
          element.Description +
            "<br>Water level: " +
            element.MeasureParameters[0].CurrentValue
        )
      )
      // add popup
      .addTo(map);

    // marker.classList.add("markers");
  });
};

getInfo();

//zoom in with controls
const nav = new mapboxgl.NavigationControl({
  visualizePitch: true,
});
map.addControl(nav, "bottom-right");

// get info-box when you press a button

/* markers.forEach((element) => {
  console.log(element.innerHTML);
}); */

/* map.on("click", "poi-label", (e) => {
  console.log("hej");
  console.log(e.lngLat);
}); */

// console.log(waterData);

// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com

/* const map = new mapboxgl.Map({
  container: "map", // container ID
  center: [-122.420679, 37.772537], // starting position [lng, lat]
  zoom: 13, // starting zoom
  style: "mapbox://styles/mapbox/streets-v11", // style URL or style object
  hash: true, // sync `center`, `zoom`, `pitch`, and `bearing` with URL
  // Use `transformRequest` to modify requests that begin with `http://myHost`.
  transformRequest: (url, resourceType) => {
    if (resourceType === "Source" && url.startsWith("http://myHost")) {
      return {
        url: url.replace("http", "https"),
        headers: {"my-custom-header": true},
        credentials: "include", // Include cookies for cross-origin requests
      };
    }
  },
}); */
