# 🎨 PrintHub - Frontend (Vue 3)

# 📖 Descripción General

Este repositorio contiene el frontend SPA del proyecto **PrintHub**, accesible mediante:

```txt
https://projecte01.ddaw.es
```

La aplicación ha sido desarrollada utilizando Vue 3 y consume la API REST desplegada en:

```txt
https://api.projecte01.ddaw.es
```

---

# 🌐 1. DNS Y DOMINIOS

## Dominio principal

```txt
projecte01.ddaw.es
```

---

## Subdominios

| Servicio    | Dominio                |
| ----------- | ---------------------- |
| Frontend    | projecte01.ddaw.es     |
| Backend API | api.projecte01.ddaw.es |

---

## HTTPS

Todo el sistema utiliza certificados válidos:

```txt
Let's Encrypt
```

---

> 📸 **CAPTURA HTTPS**
>
> `![HTTPS](docs/https-front.png)`

---

# 🏗️ 2. ARQUITECTURA FRONTEND

## Tecnologías

| Tecnología  | Uso        |
| ----------- | ---------- |
| Vue 3       | Framework  |
| Vite        | Build Tool |
| Pinia       | Estado     |
| Vue Router  | Navegación |
| Axios       | HTTP       |
| Bootstrap 5 | UI         |

---

# 🐳 3. ENTORNO LOCAL DOCKER

# Objetivo

Permitir ejecutar el frontend sin instalar Node.js.

---

## Variables entorno

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## Docker

Servicios:

- frontend
- nginx

---

## Levantar entorno

```bash
docker-compose up -d --build
```

---

## Acceso local

```txt
http://localhost:5173
```

---

> 📸 **CAPTURA DOCKER FRONTEND**
>
> `![Docker Frontend](docs/docker-frontend.png)`

---

# 🚀 4. CI/CD FRONTEND

## Pipeline independiente

El frontend tiene despliegue independiente del backend.

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

---

## Deploy automático

El contenido `/dist` se despliega automáticamente hacia:

- Nginx AWS
- S3
- CloudFront

---

# 👤 Usuario deployer

El despliegue automático utiliza:

```txt
deployer
```

---

## Funciones

- Deploy frontend
- Gestión releases
- SSH automatizado
- Integración GitHub Actions

---

## Flujo despliegue

```txt
Commit → Pipeline → Build → SSH deployer → Producción
```

---

# 🔐 5. SEGURIDAD

## HTTPS obligatorio

Frontend accesible únicamente mediante:

```txt
https://projecte01.ddaw.es
```

---

## Seguridad aplicada

- HTTPS
- Security Groups AWS
- Certificados Let's Encrypt
- Variables entorno protegidas

---

# 📈 6. ESCALABILIDAD

La build final genera archivos estáticos:

- HTML
- CSS
- JavaScript

Distribuibles mediante CDN global.

---

# 👥 7. NORMAS CONTRIBUCIÓN

## Reglas

- Pull Requests obligatorios
- Revisión visual
- Responsive obligatorio
- Uso Bootstrap prioritario

---

# 📜 8. LICENCIA

Proyecto educativo desarrollado para DDAW + NUV.

---

# 👨‍💻 9. EQUIPO DESARROLLO

Proyecto desarrollado por el equipo PrintHub.

---

# 📌 10. ESTADO PROYECTO

| Característica    | Estado |
| ----------------- | ------ |
| Vue SPA           | ✅     |
| Docker            | ✅     |
| HTTPS             | ✅     |
| AWS               | ✅     |
| CI/CD             | ✅     |
| Deploy automático | ✅     |
