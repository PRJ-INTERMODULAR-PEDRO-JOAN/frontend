# Usamos una versión ligera de Node (asegúrate de que coincida con la que usas, la 20 es ideal)
FROM node:20-alpine

# Establecemos la carpeta donde vivirá tu app dentro del contenedor
WORKDIR /app

# Exponemos el puerto de desarrollo
EXPOSE 5174

# Nota: No copiamos el código ni hacemos npm install aquí, 
# porque le hemos dicho a Docker Compose que monte tu carpeta en vivo.