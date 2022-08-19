const mongoose = require('mongoose');

(async () => {
  try {
    const db = await mongoose.connect("", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Hemos conectado la base de datos a : ", db.connection.host);
  } catch (error) {
    console.error(error);
  }
})();