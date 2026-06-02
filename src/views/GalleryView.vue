<template>
    <MainLayout>
      <div class="gallery-page">
        
        <a href="#destacados" class="enlace-banner" style="display:block;">
        <div class="banner">
          <div class="banner-texto">
            ¡Oferta especial de Navidad! 🦌🎅 Solo por tiempo limitado.
          </div>
        </div>
      </a>
  
        <header class="gallery-header text-center py-5">
          <h1 class="fw-bold display-4">GALERÍA DE PROYECTOS</h1>
          <div class="d-flex justify-content-center mt-3">
               <img src="/img/logoPrintHub.jpeg" loading="lazy" alt="Logo PrintHub" width="120" class="rounded-circle shadow-sm" />
          </div>
        </header>
  
        <div class="container pb-5">
          
          <div class="menu-galeria mb-5 sticky-top bg-white py-3" style="z-index: 90; top: 0;">
              <ul class="d-flex justify-content-center gap-2 list-unstyled flex-wrap m-0">
                  <li><a href="#" class="btn btn-dark rounded-pill px-4" @click.prevent>Todo</a></li>
                  <li v-for="seccion in secciones" :key="seccion.id">
                      <a :href="`#${seccion.id}`" class="btn btn-outline-dark rounded-pill px-4">{{ seccion.titulo }}</a>
                  </li>
                  <li><a href="#" class="btn btn-outline-dark rounded-pill px-4" @click.prevent>Modelos</a></li>
                  <li><a href="#" class="btn btn-outline-dark rounded-pill px-4" @click.prevent>Otros</a></li>
              </ul>
          </div>
  
          <div class="galeria-content">
              <section v-for="(seccion, sIndex) in secciones" :key="seccion.id" :id="seccion.id" class="mb-5 section-block">
                  
                  <div class="d-flex align-items-center mb-4">
                      <h2 class="text-uppercase fw-bold m-0 me-3" style="color: #ff6b00;">{{ seccion.titulo }}</h2>
                      <div class="flex-grow-1 border-bottom" style="border-color: #ddd;"></div>
                  </div>
                  
                  <div class="carousel-container shadow-lg rounded-4">
                      
                      <button class="carousel-btn prev" @click="prevSlide(sIndex)" aria-label="Anterior">
                          <span class="arrow">&#10094;</span>
                      </button>
                      
                      <div class="carousel-viewport">
                          <div class="carousel-track" :style="{ transform: `translateX(-${currentIndices[sIndex] * 100}%)` }">
                              <div v-for="(img, iIndex) in seccion.imagenes" :key="iIndex" class="carousel-slide">
                                  <img :src="getImagePath(img)" loading="lazy" :alt="seccion.titulo" class="carousel-image">
                              </div>
                          </div>
                      </div>
                      
                      <button class="carousel-btn next" @click="nextSlide(sIndex)" aria-label="Siguiente">
                          <span class="arrow">&#10095;</span>
                      </button>
  
                      <div class="carousel-dots-container">
                          <div class="carousel-dots">
                              <span 
                                  v-for="(_, iIndex) in seccion.imagenes" 
                                  :key="iIndex" 
                                  class="dot" 
                                  :class="{ active: currentIndices[sIndex] === iIndex }"
                                  @click="goToSlide(sIndex, iIndex)"
                              ></span>
                          </div>
                      </div>
  
                  </div>
              </section>
          </div>
  
        </div>
      </div>
    </MainLayout>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue';
  import MainLayout from '../layouts/MainLayout.vue';
  
  const secciones = reactive([
      { id: 'videojuegos', titulo: 'Videojuegos', imagenes: ['juego1.webp', 'juego2.webp', 'juego3.webp', 'juego4.webp'] },
      { id: 'arquitectura', titulo: 'Arquitectura', imagenes: ['puente1.webp', 'puente2.webp', 'puente3.webp', 'puente4.webp'] },
      { id: 'automoviles', titulo: 'Automóviles', imagenes: ['coche1.webp', 'coche2.webp', 'coche3.webp', 'coche4.webp'] }
  ]);
  
  const currentIndices = ref(secciones.map(() => 0));
  
  const nextSlide = (sectionIndex) => {
      const totalImages = secciones[sectionIndex].imagenes.length;
      currentIndices.value[sectionIndex] = (currentIndices.value[sectionIndex] + 1) % totalImages;
  };
  const prevSlide = (sectionIndex) => {
      const totalImages = secciones[sectionIndex].imagenes.length;
      currentIndices.value[sectionIndex] = (currentIndices.value[sectionIndex] - 1 + totalImages) % totalImages;
  };
  const goToSlide = (sectionIndex, imageIndex) => {
      currentIndices.value[sectionIndex] = imageIndex;
  };
  
  const getImagePath = (img) => {
      if (!img) return '/img/marcaDeAgua.png';
      return img.startsWith('http') ? img : `/img/${img}`;
  };
  </script>
  
  <style scoped>
  @import '../assets/css/gallery.css';
  </style>