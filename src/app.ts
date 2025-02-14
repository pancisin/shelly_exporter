import restana from "restana";
import client from "prom-client";
import fetch from "node-fetch";
import getPhaseMetrics from "./phaseMetrics";

const register = new client.Registry();
const phaseMetrics = getPhaseMetrics(register);

const SHELLY_HOST = process.env.SHELLY_HOST;

const fetchShellyStatus = async () => {
  const data = await fetch(`http://${SHELLY_HOST}/rpc/Shelly.GetStatus`).then(
    (response) => response.json() as any
  );

  ["a", "b", "c"].forEach((phase) => {
    Object.keys(phaseMetrics).forEach((metricName) => {
      phaseMetrics[metricName]
        .labels({ phase })
        .set(data["em:0"][`${phase}_${metricName}`]);
    });
  });
};

fetchShellyStatus();
setInterval(async () => {
  await fetchShellyStatus();
}, 10000);

const service = restana();
service.get("/metrics", async (req, res) => {
  res.send(await register.metrics());
});

const servicePort = process.env.EXPORTER_PORT;
if (servicePort == null) {
  throw new Error("Port is not defined in environment variables!");
}
service.start(parseInt(servicePort));
