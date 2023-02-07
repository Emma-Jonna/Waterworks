const getInfo = async () => {
  const response = await fetch(
    "https://data.goteborg.se/RiverService/v1.1/MeasureSites/api-key?&format=Json"
  );

  const resp = await response.json();

  console.log(resp[0].Description);

  resp.forEach((element) => {
    console.log(element.Description);
  });

  try {
  } catch (error) {}
};

getInfo();
