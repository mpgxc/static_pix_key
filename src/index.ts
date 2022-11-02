import { Pix } from "./Pix";

console.log(
  new Pix({
    city: "Pajeu Piaui",
    key: "eae55787-527c-4100-9150-56e20c32035e",
    name: "Mateus Pinto Garcia",
    description: "Vaquejada - Fazenda Pajeu",
  })
    .setValue(159)
    .build()
);
