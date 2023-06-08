const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(bodyParser.json({ limit: "10000mb" }));

app.post("/store", (req, res) => {
  const jsonData = req.body.data; // Obtén los datos del cuerpo de la solicitud
  
  // Lee el archivo db.json
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo db.json:", err);
      res.status(500).send("Error en el servidor");
      return;
    }

    const db = JSON.parse(data); // Parsea el contenido del archivo como un objeto JSON
    db.data = jsonData; // Actualiza el valor de la clave "data" con los datos recibidos

    // Escribe el objeto JSON actualizado en el archivo db.json
    fs.writeFile("db.json", JSON.stringify(db), "utf8", (err) => {
      if (err) {
        console.error("Error al escribir en el archivo db.json:", err);
        res.status(500).send("Error en el servidor");
        return;
      }

      console.log("Datos almacenados exitosamente en db.json");
      res.status(200).send("Datos almacenados exitosamente");
    });
  });
});

app.get("/data", (req, res) => {
  // Lee el archivo db.json y envía su contenido como respuesta
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo db.json:", err);
      res.status(500).send("Error en el servidor");
      return;
    }

    const db = JSON.parse(data); // Parsea el contenido del archivo como un objeto JSON
    res.status(200).json(db); // Envía el objeto JSON como respuesta
  });
});

app.listen(3000, () => {
  console.log("Servidor JSON Server en ejecución en el puerto 3000");
});
