mapboxgl.accessToken =
  "pk.eyJ1IjoiY2FwdGFpbmNhdGxhZHkiLCJhIjoiY2xkdWFqN3lwMDN2djNwcW9yeHBkeDRqbyJ9.sDDirsJ2Zj8gpAZWB9HlFQ";
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/doughnuteagle/cle8iibsk006901q9d2lnkaol", // style URL
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
    const infoCard = document.createElement("article");
    infoCard.classList.add("info-card");
    waterInfo.appendChild(infoCard);
    const header = document.createElement("h2");

    // header.style.color = "red";

    header.textContent = waterData.Code;
    infoCard.appendChild(header);

    waterData.MeasureParameters.forEach((messurments) => {
      /* if (messurments.Code === "Level") {
        const p = document.createElement("p");
        p.style.color = "red";
        p.textContent = messurments.CurrentValue;
        waterInfo.appendChild(p);
      } */
      const p = document.createElement("p");
      // p.style.color = "red";

      if (!messurments.CurrentValue == "") {
        p.textContent = `${messurments.Description}: ${messurments.CurrentValue}`;
      } else {
        p.textContent = `${messurments.Description}: Ingen data tillgänglig`;
      }
      infoCard.appendChild(p);
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

const lowWaterLevel = "#6C9A8B";
const mediumWaterLevel = "#E8998D";
const highWaterLevel = "#EED2CC";

/* const lowWaterLevel = "#512D38";
const mediumWaterLevel = "#B27092";
const highWaterLevel = "#F4BFDB"; */

const createMarkers = async (resp) => {
  const waterdata = await resp;
  waterdata.forEach((element) => {
    //changes color
    let markerColor = lowWaterLevel;
    if (element.MeasureParameters[0].CurrentValue >= 10) {
      markerColor = mediumWaterLevel;
    }
    if (element.MeasureParameters[0].CurrentValue >= 60) {
      markerColor = highWaterLevel;
    }

    element.MeasureParameters.forEach((MeasureParameter) => {
      if (
        !MeasureParameter.CurrentValue &&
        MeasureParameter.CurrentValue != "0"
      ) {
        MeasureParameter.CurrentValue = "Ingen data tillgänglig";
      }
    });

    /*if (!element.MeasureParameters[0].CurrentValue) {
      element.MeasureParameters[0].CurrentValue = "Ingen data tillgänglig";
    }*/
    // console.log(element.Description);
    // console.log(`Latitude: ${element.Lat}, Longitude${element.Long}`);
    const marker = new mapboxgl.Marker({color: markerColor})

      .setLngLat([element.Long, element.Lat])

      .addTo(map)
      .setPopup(
        new mapboxgl.Popup().setHTML(
          "<b>" +
            element.Description +
            "</b>" +
            popupInfo(
              element
            ) /*  + "<br><button onclick='moreInfo()'>More info</button>" */
        )
      )
      // add popup
      .addTo(map);

    // marker.classList.add("markers");
  });
};

function moreInfo() {}

function popupInfo(element) {
  let textContent = "";
  element.MeasureParameters.forEach((MeasureParameter) => {
    /*if (!element.MeasureParameter.CurrentValue) {
      element.MeasureParameter.CurrentValue = "Ingen data tillgänglig";
    }*/
    textContent +=
      "<p>" +
      MeasureParameter.Description +
      ": " +
      MeasureParameter.CurrentValue + "<p>";
  });
  return textContent;
}

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
