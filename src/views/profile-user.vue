<template>
  <div class="profile-container">
    <div class="profile-header">
      <div class="cover-photo"></div>
      <div class="profile-info">
        <div class="avatar-upload" :class="{ uploading: isUploading || isDeleting }">
          <img :src="avatarUrl" class="profile-avatar">
          <label for="avatar-upload" class="edit-avatar-btn">
            <i class="ni ni-ruler-pencil"></i>
          </label>
          <input 
            id="avatar-upload" 
            type="file" 
            accept="image/*" 
            @change="handleAvatarChange" 
            style="display: none"
          >
        </div>
        
        <div class="avatar-actions">
          <button 
            v-if="selectedFile" 
            @click="updateAvatar" 
            class="update-avatar-btn"
            :disabled="isUploading"
          >
            <i class="ni ni-cloud-upload-96"></i> {{ isUploading ? 'Uploading...' : 'Update' }}
          </button>
          
          <button 
            v-if="hasAvatar && !selectedFile" 
            @click="confirmDeleteAvatar" 
            class="delete-avatar-btn"
            :disabled="isDeleting"
          >
            <i class="ni ni-fat-remove"></i> {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
        
        <h1>{{ user.firstName }} {{ user.lastName }}</h1>
        <p class="role-badge" :class="user.role">{{ formatRole(user.role) }}</p>
      </div>
    </div>

    <div class="profile-content">
      <div class="profile-card">
        <div class="card-header">
          <h2><i class="ni ni-single-02"></i> Personal Information</h2>
          <button @click="toggleEditMode" class="btn-toggle-edit">
            {{ editMode ? 'Cancel' : 'Edit' }}
          </button>
        </div>

        <div v-if="!editMode" class="info-grid">
          <div class="info-item">
            <label>First Name</label>
            <p>{{ user.firstName || 'Not provided' }}</p>
          </div>
          <div class="info-item">
            <label>Last Name</label>
            <p>{{ user.lastName || 'Not provided' }}</p>
          </div>
          <div class="info-item">
            <label>Email</label>
            <p>{{ user.email || 'Not provided' }}</p>
          </div>
          <div class="info-item">
            <label>Address</label>
            <p>{{ user.address || 'Not provided' }}</p>
          </div>
        </div>

        <form v-else @submit.prevent="updateProfile" class="edit-form">
          <div class="form-group">
            <label>First Name</label>
            <input v-model="editForm.firstName" type="text" class="form-control" required>
          </div>
          <div class="form-group">
            <label>Last Name</label>
            <input v-model="editForm.lastName" type="text" class="form-control" required>
          </div>
          <div class="form-group">
            <label>Address</label>
            <textarea v-model="editForm.address" class="form-control" rows="2" required></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-save" :disabled="isUpdating">
              <i v-if="isUpdating" class="fa fa-spinner fa-spin"></i>
              {{ isUpdating ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>

      <!-- === SECTION DES COMMANDES === -->
      <div class="profile-card">
        <div class="card-header">
          <h2><i class="ni ni-bullet-list-67"></i> Mes Commandes</h2>
        </div>
        
        <div v-if="orders.length" class="orders-container">
          <div class="order-card" v-for="order in orders" :key="order._id">
            <div class="order-header">
              <div class="order-id">Commande #{{ order._id.slice(-6).toUpperCase() }}</div>
              <div class="order-status" :class="getStatusClass(order.status)">
                {{ formatStatus(order.status) }}
              </div>
            </div>
            
            <div class="order-details">
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span>{{ formatDate(order.createdAt) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Méthode de paiement:</span>
                <span>{{ formatPaymentMethod(order.paymentMethod) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Statut paiement:</span>
                <span :class="getPaymentStatusClass(order.paymentStatus)">
                  {{ formatPaymentStatus(order.paymentStatus) }}
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Total:</span>
                <span class="order-total">{{ formatPrice(order.totalPrice) }}</span>
              </div>
            </div>
            
            <div class="order-items">
              <div class="items-header">Articles ({{ order.items.length }})</div>
              <div class="item" v-for="(item, index) in order.items" :key="index">
                <img :src="getProductImage(item.product)" class="item-image" @error="handleImageError">
                <div class="item-info">
                  <div class="item-name">{{ item.product.name }}</div>
                  <div class="item-shop">Boutique: {{ item.shopInfo.name }}</div>
                  <div class="item-quantity">Quantité: {{ item.quantity }}</div>
                  <div class="item-price">{{ formatPrice(item.unitPrice) }} x {{ item.quantity }}</div>
                </div>
              </div>
            </div>
            
            <div class="order-actions">
              <button class="btn-details" @click="viewOrderDetails(order._id)">
                <i class="ni ni-zoom-split-in"></i> Détails
              </button>
              <button 
                v-if="order.status === 'pending'" 
                class="btn-cancel"
                @click="confirmCancelOrder(order)"
              >
                <i class="ni ni-fat-remove"></i> Annuler
              </button>
            </div>
          </div>
        </div>
        
        <div v-else class="no-orders">
          <i class="ni ni-cart"></i>
          <p>Aucune commande trouvée</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import defaultAvatar from '@/assets/default-avatar.png';

export default {
  name: "ProfileUser",
  data() {
    return {
      editMode: false,
      isUpdating: false,
      isUploading: false,
      isDeleting: false,
      user: {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        role: '',
        avatar: '',
        isVerified: false
      },
      editForm: {
        firstName: '',
        lastName: '',
        address: ''
      },
      avatarPreview: null,
      selectedFile: null,
      defaultAvatar: defaultAvatar,
      orders: []
    };
  },
  computed: {
    avatarUrl() {
      return this.avatarPreview || this.user.avatar || this.defaultAvatar;
    },
    hasAvatar() {
      return this.user.avatar && this.user.avatar !== '' && this.user.avatar !== 'null';
    }
  },
  created() {
    this.initAuth();
    this.loadUserData();
    this.loadMyOrders();
  },
  methods: {
    initAuth() {
      const token = localStorage.getItem('accessToken');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    },
    loadUserData() {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          this.user = JSON.parse(storedUser);
          if (this.user.avatar === 'null' || this.user.avatar === null) {
            this.user.avatar = '';
          }
          if (this.$route.params.id && this.user.id !== this.$route.params.id) {
            this.$router.push('/login');
          }
        } catch (e) {
          console.error('User parsing error:', e);
          this.$router.push('/login');
        }
      } else {
        this.$router.push('/login');
      }
    },
    async loadMyOrders() {
      try {
        const response = await axios.get('http://localhost:4000/api/order/my-orders');
        this.orders = response.data.orders || [];
      } catch (error) {
        this.handleError(error, 'Unable to load orders');
      }
    },
    
    formatRole(role) {
      const roles = {
        customer: 'Customer',
        seller: 'Seller',
        service_provider: 'Service Provider',
        admin: 'Administrator'
      };
      return roles[role] || role;
    },
    toggleEditMode() {
      this.editMode = !this.editMode;
      if (this.editMode) {
        this.editForm = {
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          address: this.user.address
        };
      }
    },
    async updateProfile() {
      try {
        this.isUpdating = true;
        const updateData = {
          firstName: this.editForm.firstName,
          lastName: this.editForm.lastName,
          address: this.editForm.address
        };
        const response = await axios.put(
          'http://localhost:4000/api/user/personal-infos',
          updateData,
          { headers: { 'Content-Type': 'application/json' } }
        );
        this.user = { ...this.user, ...updateData };
        localStorage.setItem('user', JSON.stringify(this.user));
        this.showNotification('Profile updated successfully', 'success');
        this.editMode = false;
      } catch (error) {
        this.handleError(error, 'Error updating profile');
      } finally {
        this.isUpdating = false;
      }
    },
    handleAvatarChange(event) {
      const file = event.target.files[0];
      if (!file) return;
      if (!file.type.match('image.*')) {
        this.showNotification('Please select a valid image (JPEG, PNG)', 'error');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        this.showNotification('File size should not exceed 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarPreview = e.target.result;
      };
      reader.readAsDataURL(file);
      this.selectedFile = file;
    },
    async updateAvatar() {
      if (!this.selectedFile) return;
      try {
        this.isUploading = true;
        const formData = new FormData();
        formData.append('avatar', this.selectedFile);
        const response = await axios.put(
          'http://localhost:4000/api/shop/avatar',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        this.user.avatar = response.data.avatarUrl;
        localStorage.setItem('user', JSON.stringify(this.user));
        this.showNotification('Avatar updated successfully', 'success');
        this.resetAvatarUpload();
      } catch (error) {
        this.handleError(error, 'Error updating avatar');
      } finally {
        this.isUploading = false;
      }
    },
    confirmDeleteAvatar() {
      if (confirm('Are you sure you want to delete your avatar?')) {
        this.deleteAvatar();
      }
    },
    async deleteAvatar() {
      try {
        this.isDeleting = true;
        await axios.delete('http://localhost:4000/api/shop/delete-avatar');
        this.user.avatar = '';
        localStorage.setItem('user', JSON.stringify(this.user));
        this.showNotification('Avatar deleted successfully', 'success');
      } catch (error) {
        this.handleError(error, 'Error deleting avatar');
      } finally {
        this.isDeleting = false;
      }
    },
    resetAvatarUpload() {
      this.avatarPreview = null;
      this.selectedFile = null;
      document.getElementById('avatar-upload').value = '';
    },
    handleError(error, defaultMsg) {
      console.error(error);
      let errorMsg = defaultMsg;
      if (error.response && error.response.data && error.response.data.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        errorMsg = error.message;
      }
      this.showNotification(errorMsg, 'error');
    },
    showNotification(message, type) {
      if (this.$notify) {
        this.$notify({
          type: type === 'error' ? 'danger' : 'success',
          message: message
        });
      } else {
        alert(message);
      }
    },
     formatPrice(price) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
  },

  formatDate(dateStr) {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateStr).toLocaleDateString('fr-FR', options);
  },

  formatStatus(status) {
    const statusMap = {
      'pending': 'En attente',
      'processing': 'En traitement',
      'shipped': 'Expédiée',
      'delivered': 'Livrée',
      'cancelled': 'Annulée'
    };
    return statusMap[status] || status;
  },

  formatPaymentMethod(method) {
    return method === 'cash' ? 'Espèces' : 
           method === 'card' ? 'Carte bancaire' : 
           method;
  },

  formatPaymentStatus(status) {
    const statusMap = {
      'unpaid': 'Non payé',
      'paid': 'Payé',
      'refunded': 'Remboursé'
    };
    return statusMap[status] || status;
  },

  getStatusClass(status) {
    return {
      'pending': 'status-pending',
      'processing': 'status-processing',
      'shipped': 'status-shipped',
      'delivered': 'status-delivered',
      'cancelled': 'status-cancelled'
    }[status] || '';
  },

  getPaymentStatusClass(status) {
    return {
      'unpaid': 'payment-unpaid',
      'paid': 'payment-paid',
      'refunded': 'payment-refunded'
    }[status] || '';
  },

  getProductImage(product) {
    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      return firstImage.startsWith('http') ? firstImage : `http://localhost:4000/${firstImage}`;
    }
    return require('@/assets/default-product.png');
  },

  handleImageError(event) {
    event.target.src = require('@/assets/default-product.png');
  },

  viewOrderDetails(orderId) {
    this.$router.push(`/orders/${orderId}`);
  },

  confirmCancelOrder(order) {
    if (confirm(`Voulez-vous vraiment annuler la commande #${order._id.slice(-6).toUpperCase()}?`)) {
      this.cancelOrder(order._id);
    }
  },

  async cancelOrder(orderId) {
    try {
      await axios.put(`http://localhost:4000/api/order/${orderId}/cancel`);
      this.showNotification('Commande annulée avec succès', 'success');
      this.loadMyOrders();
    } catch (error) {
      this.handleError(error, "Erreur lors de l'annulation de la commande");
    }
  }
  }
};
</script>

<style scoped>
/* Styles CSS inchangés */
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding-bottom: 50px;
}

.profile-header {
  position: relative;
  margin-bottom: 100px;
}

.cover-photo {
  height: 200px;
  background: linear-gradient(135deg, #5e72e4 0%, #825ee4 100%);
  border-radius: 0 0 20px 20px;
}

.profile-info {
  text-align: center;
  position: relative;
  margin-top: -75px;
}

.profile-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 5px solid white;
  object-fit: cover;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.profile-info h1 {
  margin: 15px 0 5px;
  font-size: 2rem;
  color: #32325d;
}

.role-badge {
  display: inline-block;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 5px;
}

.role-badge.admin {
  background-color: #fb6340;
  color: white;
}

.role-badge.seller {
  background-color: #2dce89;
  color: white;
}

.role-badge.customer {
  background-color: #11cdef;
  color: white;
}

.profile-content {
  padding: 0 20px;
}

.profile-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.card-header h2 {
  color: #525f7f;
  font-size: 1.5rem;
  margin: 0;
  display: flex;
  align-items: center;
}

.card-header h2 i {
  margin-right: 10px;
  color: #5e72e4;
}

.btn-toggle-edit {
  background: #5e72e4;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-toggle-edit:hover {
  background: #4a5fc8;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
}

.info-item label {
  display: block;
  color: #8898aa;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.info-item p {
  font-size: 1.1rem;
  color: #32325d;
  margin: 0;
  padding: 8px 0;
  border-bottom: 1px solid #f1f1f1;
}

.edit-form {
  display: grid;
  gap: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #525f7f;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 1rem;
  transition: border 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: #5e72e4;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn-save {
  background: #2dce89;
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-save:hover {
  background: #24b47e;
}

.btn-save:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.avatar-upload {
  position: relative;
  display: inline-block;
  margin-bottom: 15px;
}

.edit-avatar-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: #5e72e4;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.edit-avatar-btn:hover {
  background: #4a5fc8;
  transform: scale(1.1);
}

.edit-avatar-btn i {
  font-size: 16px;
}

.avatar-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
}

.update-avatar-btn, .delete-avatar-btn {
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
}

.update-avatar-btn {
  background: #2dce89;
}

.update-avatar-btn:hover {
  background: #24b47e;
}

.delete-avatar-btn {
  background: #fb6340;
}

.delete-avatar-btn:hover {
  background: #f5365c;
}

.update-avatar-btn:disabled, 
.delete-avatar-btn:disabled {
  background: #8898aa;
  cursor: not-allowed;
}

.update-avatar-btn i, 
.delete-avatar-btn i {
  margin-right: 8px;
}

.uploading .profile-avatar {
  opacity: 0.7;
}

.fa-spinner {
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .profile-info h1 {
    font-size: 1.5rem;
  }
  
  .profile-card {
    padding: 20px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}

.order-item {
  background: #f8f9fe;
  padding: 15px 20px;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.orders-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

.order-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  overflow: hidden;
  border: 1px solid #eee;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #f8f9fe;
  border-bottom: 1px solid #eee;
}

.order-id {
  font-weight: 600;
  color: #525f7f;
}

.order-status {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-pending {
  background: #ffd600;
  color: #000;
}

.status-processing {
  background: #2196F3;
  color: white;
}

.status-shipped {
  background: #4CAF50;
  color: white;
}

.status-delivered {
  background: #8BC34A;
  color: white;
}

.status-cancelled {
  background: #f44336;
  color: white;
}

.order-details {
  padding: 15px 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  border-bottom: 1px solid #eee;
}

.detail-row {
  display: flex;
  justify-content: space-between;
}

.detail-label {
  color: #8898aa;
  font-weight: 500;
}

.order-total {
  font-weight: 600;
  color: #5e72e4;
}

.payment-paid {
  color: #2dce89;
}

.payment-unpaid {
  color: #fb6340;
}

.payment-refunded {
  color: #8898aa;
}

.order-items {
  padding: 15px 20px;
}

.items-header {
  font-weight: 600;
  margin-bottom: 10px;
  color: #525f7f;
}

.item {
  display: flex;
  gap: 15px;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}

.item:last-child {
  border-bottom: none;
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 5px;
}

.item-info {
  flex: 1;
}

.item-name {
  font-weight: 500;
  margin-bottom: 5px;
}

.item-shop {
  font-size: 0.8rem;
  color: #8898aa;
  margin-bottom: 3px;
}

.item-quantity, .item-price {
  font-size: 0.9rem;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  background: #f8f9fe;
  border-top: 1px solid #eee;
}

.btn-details, .btn-cancel {
  padding: 8px 15px;
  border-radius: 5px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-details {
  background: #5e72e4;
  color: white;
  border: none;
}

.btn-details:hover {
  background: #4a5fc8;
}

.btn-cancel {
  background: #fb6340;
  color: white;
  border: none;
}

.btn-cancel:hover {
  background: #f5365c;
}

.no-orders {
  text-align: center;
  padding: 40px 20px;
  color: #8898aa;
}

.no-orders i {
  font-size: 3rem;
  margin-bottom: 15px;
  color: #dee2e6;
}

@media (max-width: 768px) {
  .order-details {
    grid-template-columns: 1fr;
  }
  
  .order-actions {
    justify-content: center;
  }
}

</style>