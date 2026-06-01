<template>
  <MainLayout>
    <div class="login-container">
      <div class="login-card">
        <h2>Iniciar Sesión</h2>
        <p class="subtitle">Bienvenido de nuevo a PrintHub</p>

        <Form @submit="handleLogin" :validation-schema="schema">
          
          <div class="form-group">
            <label>Correo Electrónico</label>
            <Field name="email" type="email" placeholder="tu@email.com" class="custom-input" />
            <ErrorMessage name="email" class="error" />
            <span v-if="auth.errors?.email" class="error">{{ auth.errors.email[0] }}</span>
          </div>

          <div class="form-group">
            <label>Contraseña</label>
            <Field name="password" type="password" placeholder="••••••••" class="custom-input" />
            <ErrorMessage name="password" class="error" />
          </div>

          <button type="submit" :disabled="auth.loading" class="btn-login">
            {{ auth.loading ? 'Cargando...' : 'Entrar' }}
          </button>

        </Form>

        <div class="mt-4 text-center">
            <p>O iniciar sesión con</p>
            <button @click="loginWithGoogle" class="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-google me-2" viewBox="0 0 16 16">
                    <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
                </svg>
                Google
            </button>
        </div>

        <div class="login-footer">
          <p>¿No tienes cuenta? <a href="/register">Regístrate aquí</a></p>
          <p class="admin-link">
            ¿Eres Administrador? <a href="http://localhost/login">Acceso Admin</a>
          </p>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue';
import MainLayout from '../layouts/MainLayout.vue';
import { useAuthStore } from '../stores/auth';
// Importaciones de vee-validate y yup
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

const loginWithGoogle = () => {
  window.location.href = 'http://localhost:80/api/oauth/google/redirect';
};

const auth = useAuthStore();

// Esquema de validación usando Yup
const schema = yup.object({
  email: yup
    .string()
    .required('El correo electrónico es obligatorio')
    .email('Debe ser un formato de correo electrónico válido'),
  password: yup
    .string()
    .required('La contraseña es obligatoria'),
});

// El submit de vee-validate inyecta automáticamente los 'values' si es válido
const handleLogin = async (values) => {
  try {
    await auth.login({
      email: values.email,
      password: values.password,
      remember: true
    });
    // redireccionar...
  } catch (error) {
    console.error("Error en login:", error);
    if (error.response && error.response.status === 500) {
      alert("Error interno del servidor. Intente más tarde.");
    } else {
      alert("Usuario o contraseña incorrectos.");
    }
  }
};
</script>

<style scoped>
.login-container {
    min-height: 80vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f4f4f4;
    padding: 20px;
}

.login-card {
    background: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    width: 100%;
    max-width: 400px;
    text-align: center;
}

h2 { margin-bottom: 10px; color: #333; }
.subtitle { color: #666; margin-bottom: 30px; font-size: 0.9rem; }

.form-group { margin-bottom: 20px; text-align: left; }
.form-group label { display: block; margin-bottom: 5px; font-weight: 600; font-size: 0.9rem; }
.custom-input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; }

.btn-login {
    width: 100%;
    padding: 12px;
    background: linear-gradient(90deg, #FF6B00, #ff8c42);
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.3s;
}
.btn-login:hover { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(255,107,0,0.3); }

.error { color: red; font-size: 0.8rem; margin-top: 5px; display: block; }

.login-footer { margin-top: 20px; font-size: 0.9rem; border-top: 1px solid #eee; padding-top: 20px;}
.login-footer a { color: #007BFF; text-decoration: none; }
.admin-link { margin-top: 10px; font-size: 0.8rem; color: #999; }
</style>