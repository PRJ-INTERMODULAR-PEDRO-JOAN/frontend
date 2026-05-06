<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <div class="text-center">
      <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;"></div>
      <h3 class="mt-3">Procesando inicio de sesión...</h3>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
    // Leemos los parámetros de la URL
    const token = route.query.token;
    const error = route.query.error;

    if (token) {
        try {
            // Guardamos el token y pedimos los datos del usuario
            await authStore.loginWithToken(token);
            
            // Redirigimos al usuario a la página de inicio/dashboard y limpiamos la URL
            router.push({ name: 'home' }); // Cambia 'home' por el nombre de tu ruta principal
        } catch (err) {
            alert('Error al obtener los datos del usuario.');
            router.push({ name: 'login' });
        }
    } else if (error) {
        alert('Error al iniciar sesión con Google.');
        router.push({ name: 'login' });
    } else {
        // Si alguien entra aquí sin token, lo mandamos al login
        router.push({ name: 'login' });
    }
});
</script>