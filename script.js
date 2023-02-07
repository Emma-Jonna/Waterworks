const getInfo = async () => {
  const response = await fetch(
    "https://data.goteborg.se/RiverService/v1.1/MeasureSites/f43ea846-245a-4797-b66b-d34b33e98df6/Nedsjon?&format=Json"
  );

  const resp = await response.json();

  console.log(resp);

  try {
  } catch (error) {}
};

getInfo();
