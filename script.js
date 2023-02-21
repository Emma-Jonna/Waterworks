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

    header.textContent = waterData.Description;
    infoCard.appendChild(header);

    waterData.MeasureParameters.forEach((messurments) => {
      const p = document.createElement("p");

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

    if (waterInfo.classList.contains("hidden")) {
      waterInfo.classList.remove("hidden");
    } else waterInfo.classList.add("hidden");
  });

  try {
  } catch (error) {}
};

const lowWaterLevel = "#FF8811";
const mediumWaterLevel = "#F4D06F";
const highWaterLevel = "#98473E";

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
      MeasureParameter.CurrentValue +
      "<p>";
  });
  return textContent;
}

getInfo();

//zoom in with controls
const nav = new mapboxgl.NavigationControl({
  visualizePitch: true,
});
map.addControl(nav, "bottom-right");
