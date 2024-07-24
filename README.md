# Bank App

### Requisitos

1. Docker instalado
2. Docker engine corriendo en tu máquina
3. Usando como template el archivo .env.example, crear su propio archivo .env en ambos proyectos con las variables indicadas

## Iniciar el proyecto

1. Levantar el docker-compose en el root del proyecto:

```bash
docker-compose up --build
```

La API se iniciará en [http://localhost:3000](http://localhost:3000)

## Correr tests

1. Debe tener el contenedor corriendo (puede hacerlo con el comando de arriba)

**Tests server**

```bash
docker exec -it node-server npm run test
```

La API se iniciará en [http://localhost:3000](http://localhost:3000)
