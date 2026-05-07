<template>
    <MainLayout>
      <div class="dashboard-container">
        
        <div class="back-btn-wrapper">
          <router-link to="/" class="btn btn-outline-dark btn-sm rounded-pill px-3 fw-bold btn-volver">
              ← Volver al Inicio
          </router-link>
        </div>
  
        <div class="card shadow-lg border-0 rounded-4 dashboard-card">
          <div class="card-body p-4 p-md-5">
              
            <div class="text-center mb-4">
                <img src="/img/logoPrintHub.jpeg" width="60" class="rounded-circle mb-3 shadow-sm" alt="Logo">
                <h3 class="fw-bold title-text">Editar mis datos</h3>
                <p class="text-muted subtitle-text">Actualiza tu información personal</p>
            </div>
  
            <div v-if="statusMessage" class="alert alert-success text-center py-2 mb-4 rounded-3 small border-0 shadow-sm">
                {{ statusMessage }}
            </div>
  
            <form @submit.prevent="updateProfile">
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label small fw-bold text-muted custom-label">Nombre</label>
                        <input type="text" v-model="profileForm.name" class="form-control bg-light border-0 py-2 custom-input" :class="{ 'is-invalid': errors.name }" required>
                        <div v-if="errors.name" class="invalid-feedback">{{ errors.name[0] }}</div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label small fw-bold text-muted custom-label">Apellidos</label>
                        <input type="text" v-model="profileForm.surname" class="form-control bg-light border-0 py-2 custom-input" :class="{ 'is-invalid': errors.surname }">
                        <div v-if="errors.surname" class="invalid-feedback">{{ errors.surname[0] }}</div>
                    </div>
                    <div class="col-12">
                        <label class="form-label small fw-bold text-muted custom-label">Email</label>
                        <input type="email" v-model="profileForm.email" class="form-control bg-light border-0 py-2 custom-input" :class="{ 'is-invalid': errors.email }" required>
                        <div v-if="errors.email" class="invalid-feedback">{{ errors.email[0] }}</div>
                    </div>
                    <div class="col-12">
                        <label class="form-label small fw-bold text-muted custom-label">Teléfono</label>
                        <input type="tel" v-model="profileForm.phone" class="form-control bg-light border-0 py-2 custom-input" :class="{ 'is-invalid': errors.phone }">
                        <div v-if="errors.phone" class="invalid-feedback">{{ errors.phone[0] }}</div>
                    </div>
                </div>
  
                <div class="mt-4 pt-2">
                    <button type="submit" class="btn btn-primary w-100 py-2 fw-bold rounded-3 shadow-sm btn-guardar" :disabled="loading">
                        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                        GUARDAR CAMBIOS
                    </button>
                </div>
            </form>
  
            <hr class="my-4 separator-line">
  
            <div class="d-grid mb-3">
                <button class="btn btn-light text-muted border-0 py-2 d-flex justify-content-between align-items-center btn-collapse" type="button" data-bs-toggle="collapse" data-bs-target="#passCollapse">
                    <span>🔒 Cambiar mi contraseña</span>
                    <span class="small">▼</span>
                </button>
                
                <div class="collapse mt-3" id="passCollapse">
                    <div class="card card-body bg-light border-0 rounded-3 collapse-card">
                        <form @submit.prevent="updatePassword">
                            <div class="mb-3">
                                <label class="form-label small fw-bold text-muted custom-label">Contraseña Actual</label>
                                <input type="password" v-model="passwordForm.current_password" class="form-control border-0 custom-input-collapse" :class="{ 'is-invalid': passwordErrors.current_password }">
                                <div v-if="passwordErrors.current_password" class="invalid-feedback">{{ passwordErrors.current_password[0] }}</div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label small fw-bold text-muted custom-label">Nueva Contraseña</label>
                                <input type="password" v-model="passwordForm.password" class="form-control border-0 custom-input-collapse" :class="{ 'is-invalid': passwordErrors.password }">
                                <div v-if="passwordErrors.password" class="invalid-feedback">{{ passwordErrors.password[0] }}</div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label small fw-bold text-muted custom-label">Confirmar Contraseña</label>
                                <input type="password" v-model="passwordForm.password_confirmation" class="form-control border-0 custom-input-collapse">
                            </div>
                            <button type="submit" class="btn btn-outline-dark w-100 btn-sm fw-bold btn-actualizar-pass">Actualizar Contraseña</button>
                        </form>
                    </div>
                </div>
            </div>
  
            <div class="d-grid">
                <button class="btn btn-outline-danger border-0 py-2 text-start btn-eliminar" type="button" data-bs-toggle="modal" data-bs-target="#deleteAccountModal">
                    ⚠️ Eliminar cuenta
                </button>
            </div>
  
          </div>
        </div>
  
        <div class="modal fade" id="deleteAccountModal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow rounded-4 custom-modal">
              <div class="modal-header border-0 pb-0">
                <h5 class="modal-title fw-bold text-danger">¿Estás seguro?</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <p class="text-muted small modal-text">
                    Una vez eliminada tu cuenta, todos tus recursos y datos se borrarán permanentemente. 
                    Por favor, ingresa tu contraseña para confirmar.
                </p>
                <form @submit.prevent="deleteAccount">
                    <div class="mb-3">
                        <input type="password" v-model="deleteForm.password" class="form-control bg-light border-0 custom-input" placeholder="Contraseña" :class="{ 'is-invalid': deleteErrors.password }">
                        <div v-if="deleteErrors.password" class="invalid-feedback">{{ deleteErrors.password[0] }}</div>
                    </div>
                    <div class="d-flex justify-content-end gap-2">
                        <button type="button" class="btn btn-secondary rounded-pill px-4" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-danger rounded-pill px-4 fw-bold">Eliminar Cuenta</button>
                    </div>
                </form>
              </div>
            </div>
          </div>
        </div>
  
      </div>
    </MainLayout>
  </template>
  
  <script setup>
  import { ref, onMounted, reactive } from 'vue';
  import MainLayout from '../layouts/MainLayout.vue';
  import { useAuthStore } from '../stores/auth';
  import axios from '../api/axios';
  import { useRouter } from 'vue-router';
  
  const authStore = useAuthStore();
  const router = useRouter();
  const loading = ref(false);
  const statusMessage = ref('');
  
  const errors = ref({});
  const passwordErrors = ref({});
  const deleteErrors = ref({});
  
  const profileForm = reactive({
      name: '',
      surname: '',
      email: '',
      phone: ''
  });
  
  const passwordForm = reactive({
      current_password: '',
      password: '',
      password_confirmation: ''
  });
  
  const deleteForm = reactive({
      password: ''
  });
  
  onMounted(async () => {
      if (!authStore.user) {
          await authStore.fetchUser();
      }
      if (authStore.user) {
          profileForm.name = authStore.user.name;
          profileForm.surname = authStore.user.surname || '';
          profileForm.email = authStore.user.email;
          profileForm.phone = authStore.user.phone || '';
      }
  });
  
  const updateProfile = async () => {
      loading.value = true;
      errors.value = {};
      statusMessage.value = '';
      try {
          const response = await axios.patch('/api/profile', profileForm);
          authStore.user = response.data.user; 
          statusMessage.value = '¡Perfil actualizado con éxito!';
          setTimeout(() => statusMessage.value = '', 3000);
      } catch (error) {
          if (error.response && error.response.status === 422) {
              errors.value = error.response.data.errors;
          } else {
              console.error(error);
              alert('Ocurrió un error al actualizar el perfil.');
          }
      } finally {
          loading.value = false;
      }
  };
  
  const updatePassword = async () => {
      passwordErrors.value = {};
      try {
          await axios.put('/api/password', passwordForm);
          statusMessage.value = '¡Contraseña cambiada correctamente!';
          passwordForm.current_password = '';
          passwordForm.password = '';
          passwordForm.password_confirmation = '';
          document.getElementById('passCollapse').classList.remove('show');
          setTimeout(() => statusMessage.value = '', 3000);
      } catch (error) {
          if (error.response && error.response.status === 422) {
              passwordErrors.value = error.response.data.errors;
          } else {
              console.error(error);
              alert('Error al cambiar contraseña.');
          }
      }
  };
  
  const deleteAccount = async () => {
      deleteErrors.value = {};
      if (!confirm('¿Estás SEGURO de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) return;
      try {
          await axios.delete('/api/profile', {
              data: { password: deleteForm.password }
          });
          const modalEl = document.getElementById('deleteAccountModal');
          const modalInstance = bootstrap.Modal.getInstance(modalEl);
          if(modalInstance) modalInstance.hide();
          authStore.user = null;
          localStorage.removeItem('token');
          router.push('/login');
      } catch (error) {
          if (error.response && error.response.status === 422) {
              deleteErrors.value = error.response.data.errors;
          } else {
              console.error(error);
              alert('No se pudo eliminar la cuenta.');
          }
      }
  };
  </script>
  
  <style scoped>
  /* --- ESTILOS BASE (Modo Claro) --- */
  .dashboard-container {
      background-color: #f8f9fa;
      min-height: calc(100vh - 80px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      position: relative;
  }
  
  .dashboard-card {
      max-width: 600px;
      width: 100%;
      background-color: #ffffff;
  }
  
  .back-btn-wrapper {
      width: 100%;
      max-width: 600px;
      margin-bottom: 1rem;
  }
  
  .btn-guardar {
      background: linear-gradient(90deg, #FF6B00, #ff8c42);
      border: none;
  }
  .btn-guardar:hover {
      background: linear-gradient(90deg, #ff8c42, #FF6B00);
  }
  
  @media (max-width: 768px) {
      .back-btn-wrapper {
          text-align: center;
      }
  }
  </style>
  
  <style>
  /* --- ESTILOS MODO OSCURO (Solo para Dashboard) --- */
  /* Aplicamos reglas directamente al componente cuando el HTML tiene data-bs-theme="dark" */
  
  [data-bs-theme="dark"] .dashboard-container {
      background-color: #121212 !important;
  }
  
  [data-bs-theme="dark"] .dashboard-card {
      background-color: #242424 !important;
      border: 1px solid #383838 !important;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5) !important;
  }
  
  [data-bs-theme="dark"] .title-text {
      color: #f8f9fa !important;
  }
  
  [data-bs-theme="dark"] .subtitle-text,
  [data-bs-theme="dark"] .custom-label {
      color: #adb5bd !important;
  }
  
  [data-bs-theme="dark"] .custom-input,
  [data-bs-theme="dark"] .custom-input-collapse {
      background-color: #1a1a1a !important;
      color: #f8f9fa !important;
      border: 1px solid #444 !important;
  }
  
  [data-bs-theme="dark"] .custom-input:focus,
  [data-bs-theme="dark"] .custom-input-collapse:focus {
      border-color: #FF6B00 !important;
      box-shadow: 0 0 0 0.25rem rgba(255, 107, 0, 0.25) !important;
  }
  
  [data-bs-theme="dark"] .separator-line {
      border-top-color: #444 !important;
      opacity: 1;
  }
  
  [data-bs-theme="dark"] .btn-collapse {
      background-color: #1a1a1a !important;
      color: #f8f9fa !important;
  }
  [data-bs-theme="dark"] .btn-collapse:hover {
      background-color: #333 !important;
  }
  
  [data-bs-theme="dark"] .collapse-card {
      background-color: #1a1a1a !important;
      border: 1px solid #383838 !important;
  }
  
  [data-bs-theme="dark"] .btn-actualizar-pass {
      color: #f8f9fa !important;
      border-color: #555 !important;
  }
  [data-bs-theme="dark"] .btn-actualizar-pass:hover {
      background-color: #333 !important;
      border-color: #666 !important;
  }
  
  [data-bs-theme="dark"] .btn-volver {
      color: #f8f9fa !important;
      border-color: #555 !important;
  }
  [data-bs-theme="dark"] .btn-volver:hover {
      background-color: #242424 !important;
      color: #fff !important;
  }
  
  /* --- MODO OSCURO PARA EL MODAL DE ELIMINAR CUENTA --- */
  [data-bs-theme="dark"] .custom-modal {
      background-color: #242424 !important;
      border: 1px solid #383838 !important;
  }
  
  [data-bs-theme="dark"] .modal-text {
      color: #adb5bd !important;
  }
  
  [data-bs-theme="dark"] .btn-close {
      filter: invert(1) grayscale(100%) brightness(200%);
  }
  </style>