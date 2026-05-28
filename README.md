# 🎨 PrintHub - Frontend (Vue 3)

Este repositorio contiene la interfaz visual del proyecto e-commerce **PrintHub**. La aplicación funciona como una SPA desacoplada que consume la API REST del backend Laravel.

---

# 🏗️ 1. Arquitectura Frontend

La aplicación visual es independiente del backend y puede desplegarse por separado.

## Tecnologías utilizadas

- Vue 3 (Composition API)
- Vite
- Pinia
- Vue Router
- Axios
- Bootstrap 5.3
- CSS Responsive

---

# 🐳 2. Desarrollo Local con Docker

## Requisitos

- Docker
- Docker Compose

---

## Instalación

### Clonar repositorio

```bash
git clone <repo-frontend>
```

---

### Variables de entorno

```bash
cp .env.example .env
```

---

### Configurar API Backend

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

### Levantar contenedores

```bash
docker-compose up -d --build
```

---

La aplicación estará disponible en:

```txt
http://localhost:5173
```

Vite aplicará Hot Reload automáticamente.

---

> 📸 **[CAPTURA 1: DOCKER FRONTEND]**
>
> `![Docker Frontend](docs/docker-frontend.png)`

---

# 🚀 3. CI/CD Frontend

El frontend tiene un pipeline independiente del backend.

---

## Instalación dependencias

```bash
npm install
```

---

## Build producción

```bash
npm run build
```

Esto genera:

```txt
/dist
```

---

## Deploy automático

Los archivos compilados se despliegan en:

- AWS + Nginx
- Amazon S3
- CloudFront

---

# 🔒 4. Seguridad y HTTPS

Producción disponible mediante:

```txt
https://projecteXX.ddaw.es
```

HTTPS gestionado con Let's Encrypt.

---

> 📸 **[CAPTURA 2: PIPELINE FRONTEND]**
>
> `![CI/CD Frontend](docs/cicd-frontend.png)`

---

# 📈 5. Escalabilidad

## Entorno Desarrollo

- Servidor Vite local
- Hot Reload

---

## Producción

La build Vue genera archivos estáticos:

- HTML
- CSS
- JavaScript

Distribuibles mediante CDN para soportar tráfico elevado.

---

# 👥 6. Normas de Contribución

## Separación de Responsabilidades

- Solo lógica visual
- No incluir lógica backend

---

## Pull Requests

- Validación visual obligatoria
- Revisión antes de merge

---

## Diseño

- Priorizar Bootstrap
- Mantener responsive design
- Evitar CSS redundante
