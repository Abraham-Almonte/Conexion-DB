// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Usar variable de entorno o localhost para desarrollo
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/formulario_db';
    
    const conn = await mongoose.connect(mongoURI, {
      // Opciones recomendadas para MongoDB Atlas
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout después de 5 segundos
      socketTimeoutMS: 45000, // Cerrar sockets después de 45 segundos de inactividad
    });
    
    console.log(`✅ MongoDB conectado exitosamente: ${conn.connection.host}`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ Error de conexión a MongoDB: ${error.message}`);
    console.error('Detalles del error:', error);
    process.exit(1); // Salir con código de error
  }
};

// Manejar eventos de conexión
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB desconectado');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error de MongoDB:', err);
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB desconectado debido a la terminación de la aplicación');
  process.exit(0);
});

module.exports = connectDB;