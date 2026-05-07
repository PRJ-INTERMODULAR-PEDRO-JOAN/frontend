<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView v-slot="{ Component }">
    <transition name="page" mode="out-in">
      <component :is="Component" :key="$route.path" />
    </transition>
  </RouterView>
</template>

<style>
/* TRANSICIÓN DE PÁGINA (Global)
   Asegúrate de que este bloque NO sea 'scoped' para que afecte a todas las páginas
*/

/* Estado mientras se anima (duración y suavizado) */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

/* Estado inicial cuando entra la página / Estado final cuando sale */
.page-enter-from {
  opacity: 0;
  transform: translateY(10px); /* Viene un poquito desde abajo */
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px); /* Se va un poquito hacia arriba */
}

/* TRUCO DE UX: Evitar scroll horizontal durante la transición
   A veces, mientras una página sale y otra entra, el ancho puede fluctuar.
*/
body {
  overflow-x: hidden;
}
</style>