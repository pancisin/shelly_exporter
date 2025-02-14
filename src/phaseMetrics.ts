import { Gauge, Registry } from "prom-client";

const client = require("prom-client");

export default (register: Registry): Record<string, Gauge> => {
  let metrics = {};

  const gauge = (name: string, help: string) => {
    const metric = new client.Gauge({
      name,
      help,
      registers: [register],
      labelNames: ["phase"],
    });

    Object.assign(metrics, { [name]: metric });
  };

  gauge("current", "Current value in amps.");
  gauge("voltage", "Voltage value.");
  gauge("act_power", "Act power.");
  gauge("aprt_power", "aprt_power");
  gauge("pf", "pf");
  gauge("freq", "freq");

  return metrics;
};
