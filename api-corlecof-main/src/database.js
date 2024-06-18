const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

(async () => {
  const url = process.env.MONGODB_URI;
  await mongoose.connect(url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) {
        console.log('Error en la conexion a la base de datos');
      } else {
        console.log(`Conectado a la Base de datos`);
      }
    }
  );
})();