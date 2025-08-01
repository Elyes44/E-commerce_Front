<template>
  <div>
    <!-- Cart Sidebar -->
    <div class="cart-sidebar" :class="{ 'cart-open': isCartOpen }">
      <div class="cart-header">
        <h3>Votre Panier ({{ cartItems.length }})</h3>
        <button class="close-cart" @click="toggleCart">
          <i class="ni ni-fat-remove"></i>
        </button>
      </div>
      <div class="cart-body">
        <div v-if="cartItems.length === 0" class="empty-cart">
          <i class="ni ni-cart"></i>
          <p>Votre panier est vide</p>
        </div>
        <div v-else>
          <div class="cart-item" v-for="(item, index) in cartItems" :key="index">
            <img :src="getProductImage(item.product)" :alt="item.product.name" @error="handleImageError" />
            <div class="item-details">
              <h6>{{ item.product.name }}</h6>
              <p>{{ formatPrice(item.product.price) }} x {{ item.quantity }}</p>
              <div class="item-actions">
                <button @click="decreaseQuantity(index)" class="btn btn-sm btn-outline-primary">-</button>
                <span>{{ item.quantity }}</span>
                <button @click="increaseQuantity(index)" class="btn btn-sm btn-outline-primary">+</button>
                <button @click="removeItem(index)" class="btn btn-sm btn-danger">
                  <i class="ni ni-fat-remove"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="cart-footer" v-if="cartItems.length > 0">
        <div class="cart-total">
          <span>Total:</span>
          <span>{{ formatPrice(cartTotal) }}</span>
        </div>
        <button 
          class="btn btn-primary btn-block checkout-btn" 
          @click="proceedToCheckout"
          :disabled="isProcessingOrder"
        >
          <span v-if="isProcessingOrder">
            <i class="fas fa-spinner fa-spin"></i> Traitement...
          </span>
          <span v-else>Commander</span>
        </button>
        <div v-if="orderError" class="alert alert-danger mt-3">
  {{ orderError }}
  <div v-if="orderError.includes('connecter')">
    <router-link to="/login" class="btn btn-sm btn-link">Se connecter</router-link>
  </div>
</div>
      </div>
    </div>

    <!-- Cart Toggle Button -->
    <div class="cart-toggle" @click="toggleCart">
      <i class="ni ni-cart"></i>
      <span class="cart-badge" v-if="cartItems.length > 0">{{ cartItems.length }}</span>
    </div>

    <!-- Overlay when cart is open -->
    <div class="cart-overlay" v-if="isCartOpen" @click="toggleCart"></div>

    <!-- Hero Section -->
    <div class="position-relative">
      <section class="section-shaped my-0">
        <div class="shape shape-style-1 shape-default shape-skew">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div class="container shape-container d-flex">
          <div class="col px-0">
            <div class="row">
              <div class="col-lg-6">
                <h1 class="display-3 text-white">
                  Nos Produits
                  <span>Trouvez ce dont vous avez besoin</span>
                </h1>
                <p class="lead text-white">
                  Parcourez notre large sélection de produits de qualité.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Products Section -->
    <section class="section section-lg pt-lg-0 mt--300">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-12">
            <!-- Search Bar and Filters -->
            <div class="search-filter mb-4">
              <div class="row align-items-center flex-nowrap">
                <div class="col-md-4">
                  <base-input
                    alternative
                    placeholder="Rechercher des produits..."
                    addon-left-icon="ni ni-zoom-split-in"
                    v-model="searchQuery"
                  ></base-input>
                </div>
                <div class="col-md-4">
                  <select v-model="categoryFilter" class="form-control">
                    <option value="">Toutes catégories</option>
                    <option v-for="category in uniqueCategories" :key="category" :value="category">
                      {{ category }}
                    </option>
                  </select>
                </div>
                <div class="col-md-4">
                  <select v-model="priceFilter" class="form-control">
                    <option value="">Tous les prix</option>
                    <option value="0-100">0 - 100 €</option>
                    <option value="101-500">101 - 500 €</option>
                    <option value="501+">501+ €</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Chargement...</span>
              </div>
              <p class="mt-3">Chargement des produits...</p>
            </div>

            <!-- Error State -->
            <div v-if="error" class="alert alert-danger">
              {{ error }}
            </div>

            <!-- Product Cards -->
            <div class="row row-grid" v-if="!loading && !error">
              <div class="col-lg-4 mb-4" v-for="product in filteredProducts" :key="product._id">
                <card class="border-0 h-100" hover shadow body-classes="py-5 d-flex flex-column">
                  <div class="product-image-container" :data-category="product.category">
                    <img
                      :src="getProductImage(product)"
                      :alt="product.name"
                      class="product-image mb-4"
                      @error="handleImageError"
                    />
                  </div>
                  <h6 class="text-primary text-uppercase">{{ product.name }}</h6>
                  <p class="description mt-3 flex-grow-1">
                    {{ product.description || 'Aucune description disponible' }}
                  </p>
                  <div class="mb-3">
                    <strong>Prix: </strong>{{ formatPrice(product.price) }} | 
                    <strong>Stock: </strong>{{ product.stock }}
                  </div>
                  <div class="mb-3">
                    <badge type="primary" rounded>{{ product.category || 'Non catégorisé' }}</badge>
                    <badge type="info" rounded v-if="product.shop">{{ product.shop.name }}</badge>
                  </div>
                  <div class="d-flex justify-content-center mt-auto">
                    <base-button 
                      type="primary" 
                      class="mr-2 btn-sm" 
                      @click="addToCart(product)"
                      :disabled="product.stock <= 0"
                    >
                      {{ product.stock > 0 ? 'Ajouter au panier' : 'En rupture' }}
                    </base-button>
                    <router-link 
                      v-if="product.shop" 
                      :to="`/shop/${product.shop._id}`" 
                      class="btn btn-outline-primary btn-sm" 
                    >
                      Voir la boutique
                    </router-link>
                  </div>
                </card>
              </div>
            </div>

            <!-- No Results -->
            <div v-if="!loading && !error && filteredProducts.length === 0" class="text-center py-5">
              <h4>Aucun produit trouvé</h4>
              <p>Essayez d'ajuster votre recherche ou vos filtres</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Info Section -->
    <section class="section section-shaped my-0 overflow-hidden">
      <div class="shape shape-style-3 bg-gradient-default shape-skew">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="container pt-lg pb-300">
        <div class="row text-center justify-content-center">
          <div class="col-lg-10">
            <h2 class="display-3 text-white">Pourquoi choisir notre boutique ?</h2>
            <p class="lead text-white">
              Des produits de qualité, des vendeurs vérifiés et une expérience d'achat exceptionnelle.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Order Success Modal - Version native -->
    <div v-if="showOrderSuccess" class="modal-native">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Commande validée</h5>
          <button type="button" class="close" @click="showOrderSuccess = false">
            <span>&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Votre commande a été passée avec succès !</p>
          <p>Numéro de commande: <strong>{{ orderResponse && orderResponse.orderNumber }}</strong></p>
          <p>Total: <strong>{{ formatPrice(orderResponse && orderResponse.totalAmount) }}</strong></p>
          <p>Méthode de paiement: <strong>Espèces</strong></p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="showOrderSuccess = false">Fermer</button>
          <button type="button" class="btn btn-secondary" @click="viewOrderDetails">Voir les détails</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    // State
    const searchQuery = ref('');
    const categoryFilter = ref('');
    const priceFilter = ref('');
    const products = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const isCartOpen = ref(false);
    const cartItems = ref([]);
    const isProcessingOrder = ref(false);
    const orderError = ref(null);
    const showOrderSuccess = ref(false);
    const orderResponse = ref(null);

    // Default images for different categories
    const defaultImages = {
      'laptop': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'monitor': 'https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'keyboard': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'fruit': 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'default': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    };

    // Fetch products from API
    const fetchProducts = async () => {
      try {
        loading.value = true;
        error.value = null;
        const response = await axios.get('http://localhost:4000/api/product/all-products');
        products.value = response.data.products;
      } catch (err) {
        console.error('Error fetching products:', err);
        error.value = 'Échec du chargement des produits. Veuillez réessayer plus tard.';
      } finally {
        loading.value = false;
      }
    };

    // Format price
    const formatPrice = (price) => {
      return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
    };

    // Get unique categories for filter dropdown
    const uniqueCategories = computed(() => {
      const categories = new Set();
      products.value.forEach(product => {
        if (product.category) {
          categories.add(product.category);
        }
      });
      return Array.from(categories).sort();
    });

    // Handle image loading errors
    const handleImageError = (event) => {
      const productCard = event.target.closest('.product-image-container');
      if (productCard) {
        const category = productCard.dataset.category || 'default';
        event.target.src = defaultImages[category.toLowerCase()] || defaultImages['default'];
      } else {
        event.target.src = defaultImages['default'];
      }
    };

    // Construct proper image URL with fallback to default
    const getProductImage = (product) => {
      if (!product.images || product.images.length === 0) {
        const category = product.category ? product.category.toLowerCase() : 'default';
        return defaultImages[category] || defaultImages['default'];
      }
      
      const firstImage = product.images[0];
      if (typeof firstImage === 'string') {
        if (firstImage.startsWith('http')) {
          return firstImage;
        }
        return `http://localhost:4000/${firstImage}`;
      }
      
      const category = product.category ? product.category.toLowerCase() : 'default';
      return defaultImages[category] || defaultImages['default'];
    };

    // Filter products based on search and filters
    const filteredProducts = computed(() => {
      return products.value.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                            (product.description && product.description.toLowerCase().includes(searchQuery.value.toLowerCase()));
        
        const matchesCategory = !categoryFilter.value || 
                              (product.category && product.category.toLowerCase() === categoryFilter.value.toLowerCase());
        
        let matchesPrice = true;
        if (priceFilter.value && product.price) {
          const price = Number(product.price);
          if (priceFilter.value === '0-100') matchesPrice = price <= 100;
          else if (priceFilter.value === '101-500') matchesPrice = price > 100 && price <= 500;
          else if (priceFilter.value === '501+') matchesPrice = price > 500;
        }
        
        return matchesSearch && matchesCategory && matchesPrice;
      });
    });

    // Cart functions
    const toggleCart = () => {
      isCartOpen.value = !isCartOpen.value;
      if (!isCartOpen.value) {
        orderError.value = null;
      }
    };

    const addToCart = (product) => {
      if (product.stock <= 0) return;
      
      const existingItem = cartItems.value.find(item => item.product._id === product._id);
      
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          existingItem.quantity += 1;
        } else {
          alert(`Stock insuffisant! Seulement ${product.stock} disponible(s).`);
        }
      } else {
        cartItems.value.push({
          product: product,
          quantity: 1
        });
      }
      
      saveCart();
    };

    const removeItem = (index) => {
      cartItems.value.splice(index, 1);
      saveCart();
    };

    const increaseQuantity = (index) => {
      const item = cartItems.value[index];
      if (item.quantity < item.product.stock) {
        item.quantity += 1;
        saveCart();
      } else {
        alert(`Stock insuffisant! Seulement ${item.product.stock} disponible(s).`);
      }
    };

    const decreaseQuantity = (index) => {
      if (cartItems.value[index].quantity > 1) {
        cartItems.value[index].quantity -= 1;
        saveCart();
      } else {
        removeItem(index);
      }
    };

    const cartTotal = computed(() => {
      return cartItems.value.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
      }, 0);
    });

    const proceedToCheckout = async () => {
      try {
        isProcessingOrder.value = true;
        orderError.value = null;
        
        if (cartItems.value.length === 0) {
          orderError.value = "Votre panier est vide";
          return;
        }

        // Récupération du token avec vérification
       const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

        
        if (!token) {
          orderError.value = "Veuillez vous connecter pour passer commande";
          return;
        }

        // Préparation des données
        const orderData = {
          paymentMethod: 'cash',
          cart: cartItems.value.map(item => ({
            productId: item.product._id,
            quantity: item.quantity
          }))
        };

        // Envoi de la commande
        const response = await axios.post('http://localhost:4000/api/order/', orderData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.trim()}`
          }
        });

        // Traitement de la réponse
        orderResponse.value = response.data;
        showOrderSuccess.value = true;
        cartItems.value = [];
        saveCart();
        
      } catch (err) {
        console.error('Erreur lors de la commande:', err);
        
        // Gestion des erreurs sans opérateur ?.
        if (err.response) {
          if (err.response.status === 401) {
            orderError.value = "Session expirée. Veuillez vous reconnecter.";
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
          } else {
            orderError.value = (err.response.data && err.response.data.message) 
              ? err.response.data.message 
              : "Une erreur est survenue lors de la commande";
          }
        } else {
          orderError.value = "Problème de connexion au serveur";
        }
      } finally {
        isProcessingOrder.value = false;
      }
    };
    const checkAuth = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) {
    console.warn("Aucun token d'authentification trouvé");
    return false;
  }
  
  // Optionnel : vérification plus poussée du token
  try {
    // Vous pourriez décoder le JWT ici pour vérifier son expiration
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log("Utilisateur connecté:", payload);
    return true;
  } catch (e) {
    console.error("Token invalide:", e);
    return false;
  }
};

    const viewOrderDetails = () => {
      showOrderSuccess.value = false;
      alert(`Redirection vers la commande ${orderResponse.value.orderNumber}`);
    };

    // Save cart to localStorage
    const saveCart = () => {
      localStorage.setItem('cart', JSON.stringify(cartItems.value));
    };

    // Load cart from localStorage
    const loadCart = () => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        cartItems.value = JSON.parse(savedCart);
      }
    };

    // Fetch products when component mounts
    onMounted(() => {
      loadCart();
      fetchProducts();
    });

    return {
      searchQuery,
      categoryFilter,
      priceFilter,
      products,
      loading,
      error,
      isCartOpen,
      cartItems,
      cartTotal,
      uniqueCategories,
      filteredProducts,
      isProcessingOrder,
      orderError,
      showOrderSuccess,
      orderResponse,
      toggleCart,
      addToCart,
      removeItem,
      increaseQuantity,
      decreaseQuantity,
      proceedToCheckout,
      viewOrderDetails,
      handleImageError,
      getProductImage,
      formatPrice
    };
  }
};
</script>

<style scoped>
/* Product styles */
.product-image-container {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border-radius: 4px;
  overflow: hidden;
}

.product-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.product-image:hover {
  transform: scale(1.05);
}

.search-filter {
  margin-bottom: 2rem;
}

.search-filter .form-control {
  height: calc(1.5em + 1.25rem + 2px);
  border-radius: 0.25rem;
}

.search-filter .row {
  flex-wrap: nowrap;
}

.description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 60px;
}

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

/* Cart styles */
.cart-sidebar {
  position: fixed;
  top: 0;
  right: -400px;
  width: 400px;
  height: 100vh;
  background: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1050;
  transition: right 0.3s ease;
  display: flex;
  flex-direction: column;
}

.cart-open {
  right: 0;
}

.cart-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-cart {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #888;
  cursor: pointer;
}

.cart-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #888;
}

.empty-cart i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.cart-item {
  display: flex;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.cart-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 1rem;
}

.item-details {
  flex: 1;
}

.item-details h6 {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.item-actions {
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
}

.item-actions button {
  margin: 0 0.3rem;
  padding: 0.1rem 0.5rem;
}

.item-actions span {
  margin: 0 0.5rem;
  min-width: 20px;
  text-align: center;
}

.cart-footer {
  padding: 1.5rem;
  border-top: 1px solid #eee;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-weight: bold;
  font-size: 1.1rem;
}

.checkout-btn {
  padding: 0.75rem;
}

.checkout-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.cart-toggle {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  background: #5e72e4;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 1040;
  transition: all 0.3s ease;
}

.cart-toggle:hover {
  transform: scale(1.1);
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #fb6340;
  color: white;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
}

.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

/* Modal native styles */
.modal-native {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1060;
}

.modal-content {
  background: white;
  border-radius: 5px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.modal-header {
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
}

.modal-body {
  padding: 15px;
}

.modal-footer {
  padding: 15px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
}

.modal-footer button {
  margin-left: 10px;
}

.close {
  font-size: 1.5rem;
  font-weight: bold;
  color: #000;
  opacity: 0.5;
  background: transparent;
  border: none;
  cursor: pointer;
}

.close:hover {
  opacity: 0.75;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .cart-sidebar {
    width: 100%;
  }
  
  .search-filter .row {
    flex-wrap: wrap;
  }
  
  .search-filter .col-md-4 {
    margin-bottom: 1rem;
    width: 100%;
  }
}
</style>