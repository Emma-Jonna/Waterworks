const getInfo = async () => {
  const response = await fetch(
    "https://data.goteborg.se/RiverService/v1.1/MeasureSites/api-key/Nedsjon?&format=Json"
  );

  const resp = await response.json();

  console.log(resp);

  try {
  } catch (error) {}
};

getInfo();
