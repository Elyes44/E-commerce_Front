<template>
    <div class="profile-page">
        <!-- Section Cover -->
        <section class="section-profile-cover section-shaped my-0">
            <div class="shape shape-style-1 shape-primary shape-skew alpha-4">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </section>

        <!-- Section Principale -->
        <section class="section section-skew">
            <div class="container">
                <!-- Carte Profil -->
                <card shadow class="card-profile mt--300" no-body>
                    <!-- Bannière -->
                    <div class="banner-container" :style="bannerStyle"></div>

                    <div class="px-4" style="position: relative; z-index: 2;">
                        <div class="row justify-content-center">
                            <!-- Logo -->
                            <div class="col-lg-3 order-lg-2">
                                <div class="card-profile-image">
                                    <div class="logo-container">
                                        <img :src="logoUrl" 
                                             @error="handleLogoError"
                                             class="rounded-circle shop-logo"
                                             alt="Logo boutique">
                                    </div>
                                </div>
                            </div>

                            <!-- Actions -->
                            <div class="col-lg-4 order-lg-3 text-lg-right align-self-lg-center">
                                <div class="card-profile-actions py-4 mt-lg-0">
                                    <base-button type="info" size="sm" class="mr-4" @click="showAddProductModal">
                                        <i class="ni ni-fat-add"></i> Ajouter Produit
                                    </base-button>
                                    <base-button type="default" size="sm" class="float-right">Message</base-button>
                                </div>
                            </div>

                            <!-- Stats -->
                            <div class="col-lg-4 order-lg-1">
                                <div class="card-profile-stats d-flex justify-content-center">
                                    <div>
                                        <span class="heading">{{ products.length }}</span>
                                        <span class="description">Produits</span>
                                    </div>
                                    <div>
                                        <span class="heading">4.8</span>
                                        <span class="description">Avis</span>
                                    </div>
                                    <div>
                                        <span class="heading">89%</span>
                                        <span class="description">Satisfaction</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Informations Boutique -->
                        <div class="text-center mt-5">
                            <h3>{{ shopData.name || 'Nom de la boutique' }}</h3>
                            <div class="h6 mt-4">
                                <i class="ni business_briefcase-24 mr-2"></i>
                                {{ shopData.description || 'Description de la boutique' }}
                            </div>
                            <div v-if="shopData.createdAt">
                                <i class="ni calendar-grid-58 mr-2"></i>
                                Membre depuis {{ formatDate(shopData.createdAt) }}
                            </div>
                        </div>
                    </div>
                </card>

                <!-- Section Produits -->
                <div class="mt-5">
                    <h4 class="text-center mb-4">Nos Produits</h4>
                    
                    <div class="row row-grid">
                        <div class="col-lg-4 col-md-6 mb-4" v-for="(product, index) in products" :key="product._id">
                            <card class="border-0 h-100" hover shadow body-classes="py-4 d-flex flex-column">
                                <!-- Carrousel personnalisé -->
                                <div class="custom-carousel">
                                    <div class="carousel-track" 
                                         :style="{ transform: `translateX(-${product.currentSlide * 100}%)` }">
                                        <div class="carousel-slide" 
                                             v-for="(image, imgIndex) in product.images" 
                                             :key="imgIndex">
                                            <img :src="getProductImageUrl(image, imgIndex)" 
                                                 @error="handleProductImageError($event, index, imgIndex)"
                                                 class="product-image"
                                                 alt="Image produit">
                                        </div>
                                    </div>
                                    
                                    <!-- Contrôles du carrousel -->
                                    <button class="carousel-control prev" 
                                            @click="prevSlide(index)" 
                                            v-if="product.images.length > 1">
                                        <i class="ni ni-bold-left"></i>
                                    </button>
                                    <button class="carousel-control next" 
                                            @click="nextSlide(index)" 
                                            v-if="product.images.length > 1">
                                        <i class="ni ni-bold-right"></i>
                                    </button>
                                    
                                    <!-- Indicateurs -->
                                    <div class="carousel-indicators" v-if="product.images.length > 1">
                                        <span v-for="(image, imgIndex) in product.images" 
                                              :key="'indicator-'+imgIndex"
                                              :class="{ active: product.currentSlide === imgIndex }"
                                              @click="goToSlide(index, imgIndex)"></span>
                                    </div>
                                </div>
                                
                                <h5 class="text-primary">{{ product.name }}</h5>
                                <p class="description flex-grow-1">{{ product.description }}</p>
                                
                                <div class="d-flex justify-content-between align-items-center mt-3">
                                    <div>
                                        <span class="h4 text-success">{{ product.price }} €</span>
                                        <span class="text-muted ml-2">/ unité</span>
                                    </div>
                                    <badge type="info">{{ product.stock }} en stock</badge>
                                </div>
                                
                                <div class="mt-3">
                                    <badge v-for="tag in getProductTags(product)" 
                                           :key="tag"
                                           :type="getBadgeType(tag)"
                                           class="mr-1 mb-1">
                                        {{ tag }}
                                    </badge>
                                </div>
                                
                                <base-button type="primary" size="sm" class="mt-3 align-self-start" @click="showUpdateProductModal(product)">
                                    <i class="ni ni-settings"></i> Modifier Produit
                                </base-button>
                            </card>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Modal pour ajouter/mettre à jour un produit -->
        <modal :show.sync="productModal" gradient="primary" modal-classes="modal-primary modal-dialog-centered">
            <div class="form-container">
                <div class="form-header">
                    <i class="ni ni-box-2"></i>
                    <h5>{{ isUpdatingProduct ? 'Modifier Produit' : 'Ajouter Produit' }}</h5>
                </div>

                <base-alert type="danger" v-if="productError" class="alert-modern d-flex align-items-center">
                    <i class="ni ni-fat-remove mr-2"></i> {{ productError }}
                </base-alert>

                <!-- Barre de progression -->
                <div v-if="isProcessing" class="progress-bar"></div>

                <form @submit.prevent="isUpdatingProduct ? updateProduct() : submitProduct()" class="modern-form">
                    <div class="form-grid">
                        <!-- Nom et Catégorie -->
                        <div class="form-group form-name">
                            <label class="form-label">Nom du produit</label>
                            <base-input 
                                v-model="currentProduct.name" 
                                required 
                                placeholder="Ex: Montre connectée"
                                class="modern-input"
                            />
                        </div>
                        <div class="form-group form-category">
                            <label class="form-label">Catégorie</label>
                            <base-input 
                                v-model="currentProduct.category" 
                                placeholder="Ex: Électronique"
                                class="modern-input"
                            />
                        </div>

                        <!-- Prix et Stock -->
                        <div class="form-group form-price">
                            <label class="form-label">Prix (€)</label>
                            <base-input 
                                type="number" 
                                v-model="currentProduct.price" 
                                required 
                                min="0" 
                                step="0.01"
                                placeholder="Ex: 49.99"
                                class="modern-input"
                            />
                        </div>
                        <div class="form-group form-stock">
                            <label class="form-label">Stock</label>
                            <base-input 
                                type="number" 
                                v-model="currentProduct.stock" 
                                required 
                                min="0"
                                placeholder="Ex: 20"
                                class="modern-input"
                            />
                        </div>

                        <!-- Description -->
                        <div class="form-group form-description">
                            <label class="form-label">Description</label>
                            <textarea 
                                v-model="currentProduct.description" 
                                rows="3" 
                                placeholder="Décrivez les fonctionnalités du produit..."
                                class="form-control modern-textarea"
                            />
                        </div>

                        <!-- Images -->
                        <div class="form-group form-images">
                            <label class="form-label">Images du produit</label>
                            <div class="custom-file-upload">
                                <input 
                                    type="file" 
                                    multiple 
                                    accept="image/*" 
                                    @change="handleImageUpload" 
                                    ref="fileInput"
                                    id="productImages"
                                    class="file-input"
                                >
                                <label for="productImages" class="file-upload-label">
                                    <i class="ni ni-cloud-upload-96 mr-2"></i>
                                    Choisir des images
                                </label>
                                <small class="form-text text-muted mt-2">Ajoutez entre 1 et 5 images maximum</small>
                            </div>
                            
                            <div class="preview-container" v-if="existingImages.length || imagePreviews.length">
                                <!-- Prévisualisation des images existantes -->
                                <div class="image-preview" v-for="(image, index) in existingImages" :key="'existing-'+index">
                                    <img :src="getProductImageUrl(image)" class="img-thumbnail">
                                    <button 
                                        class="remove-btn" 
                                        @click="removeExistingImage(index)"
                                        title="Supprimer l'image"
                                    >
                                        <i class="ni ni-fat-remove"></i>
                                    </button>
                                </div>
                                
                                <!-- Prévisualisation des nouvelles images -->
                                <div class="image-preview" v-for="(preview, index) in imagePreviews" :key="'new-'+index">
                                    <img :src="preview" class="img-thumbnail">
                                    <button 
                                        class="remove-btn" 
                                        @click="removeNewImage(index)"
                                        title="Supprimer l'image"
                                    >
                                        <i class="ni ni-fat-remove"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="form-actions">
                        <base-button 
                            type="secondary" 
                            @click="closeProductModal"
                            class="btn-modern btn-cancel"
                        >
                            Annuler
                        </base-button>
                        <base-button 
                            type="primary" 
                            :disabled="isProcessing"
                            class="btn-modern btn-submit"
                        >
                            <span v-if="isProcessing">
                                <i class="fa fa-spinner fa-spin mr-2"></i> En cours...
                            </span>
                            <span v-else>
                                <i class="ni ni-check-bold mr-2"></i> {{ isUpdatingProduct ? 'Mettre à jour' : 'Ajouter' }}
                            </span>
                        </base-button>
                    </div>
                </form>
            </div>
        </modal>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            shopData: {},
            products: [],
            loading: true,
            error: null,
            logoError: false,
            bannerError: false,
            defaultLogo: '/img/logo.png',
            defaultBanner: '/img/banner.png',
            defaultProductImages: [
                '/img/produit1.png',
                '/img/produit2.png',
                '/img/produit3.png'
            ],
            apiBaseUrl: process.env.VUE_APP_API_URL || 'http://localhost:4000',
            
            // Pour la modal de produit
            productModal: false,
            isUpdatingProduct: false,
            currentProduct: {
                _id: '',
                name: '',
                description: '',
                price: 0,
                stock: 0,
                category: '',
                images: [],
                existingImages: []
            },
            imagePreviews: [],
            existingImages: [],
            isProcessing: false,
            productError: null
        };
    },
    computed: {
        logoUrl() {
            if (this.logoError || !this.shopData.logo) return this.defaultLogo;
            return `${this.apiBaseUrl}/${this.shopData.logo.replace(/\\/g, '/').replace('public/', '')}`;
        },
        bannerStyle() {
            const bannerUrl = this.bannerError || !this.shopData.banner 
                ? this.defaultBanner 
                : `${this.apiBaseUrl}/${this.shopData.banner.replace(/\\/g, '/').replace('public/', '')}`;
            
            return {
                backgroundImage: `url(${bannerUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '300px'
            };
        }
    },
    async created() {
        await this.fetchShopData();
        await this.fetchProducts();
    },
    methods: {
        async fetchShopData() {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get(`${this.apiBaseUrl}/api/shop/my-shop`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                this.shopData = response.data;
            } catch (error) {
                console.error("Erreur chargement boutique:", error);
                this.error = "Impossible de charger les données de la boutique";
            }
        },
        async fetchProducts() {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get(`${this.apiBaseUrl}/api/product/my-products`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                // Initialise le carrousel pour chaque produit
                this.products = response.data.products.map(product => ({
                    ...product,
                    currentSlide: 0
                }));
                
            } catch (error) {
                console.error("Erreur chargement produits:", error);
                this.error = "Impossible de charger les produits";
            } finally {
                this.loading = false;
            }
        },
        getProductImageUrl(imagePath, imgIndex = 0) {
            if (!imagePath) return this.defaultProductImages[imgIndex % this.defaultProductImages.length];
            
            let cleanedPath = imagePath.replace(/\\/g, '/');
            
            if (cleanedPath.startsWith('http://localhost:4000/')) {
                cleanedPath = cleanedPath.substring('http://localhost:4000/'.length);
            }
            
            if (cleanedPath.startsWith('public/')) {
                cleanedPath = cleanedPath.substring('public/'.length);
            }
            
            return `${this.apiBaseUrl}/${cleanedPath}`;
        },
        handleLogoError(event) {
            this.logoError = true;
            event.target.src = this.defaultLogo;
        },
        handleProductImageError(event, productIndex, imgIndex) {
            console.error(`Erreur chargement image ${imgIndex} du produit ${productIndex}`);
            event.target.src = this.defaultProductImages[imgIndex % this.defaultProductImages.length];
            event.target.onerror = null;
        },
        // Méthodes pour le carrousel personnalisé
        nextSlide(index) {
            const product = this.products[index];
            product.currentSlide = (product.currentSlide + 1) % product.images.length;
            this.$set(this.products, index, {...product});
        },
        prevSlide(index) {
            const product = this.products[index];
            product.currentSlide = (product.currentSlide - 1 + product.images.length) % product.images.length;
            this.$set(this.products, index, {...product});
        },
        goToSlide(index, slideIndex) {
            const product = this.products[index];
            product.currentSlide = slideIndex;
            this.$set(this.products, index, {...product});
        },
        getProductTags(product) {
            const tags = [];
            if (product.category) tags.push(product.category);
            return tags;
        },
        getBadgeType(tag) {
            const types = ['primary', 'success', 'warning', 'danger', 'info', 'default'];
            return types[tag.length % types.length];
        },
        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long'
            });
        },
        
        // Méthodes pour la modal de produit
        showAddProductModal() {
            this.isUpdatingProduct = false;
            this.resetProductForm();
            this.productModal = true;
        },
        
        showUpdateProductModal(product) {
            this.isUpdatingProduct = true;
            this.currentProduct = {
                _id: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                category: product.category,
                images: [],
                existingImages: [...product.images]
            };
            this.existingImages = [...product.images];
            this.imagePreviews = [];
            this.productError = null;
            this.productModal = true;
        },
        
        closeProductModal() {
            this.productModal = false;
            this.resetProductForm();
        },
        
        resetProductForm() {
            this.currentProduct = {
                _id: '',
                name: '',
                description: '',
                price: 0,
                stock: 0,
                category: '',
                images: [],
                existingImages: []
            };
            this.existingImages = [];
            this.imagePreviews = [];
            this.productError = null;
            if (this.$refs.fileInput) {
                this.$refs.fileInput.value = '';
            }
        },
        
        handleImageUpload(event) {
            const files = event.target.files;
            if (!files || files.length === 0) return;
            
            // Limiter à 5 images maximum (existantes + nouvelles)
            const totalImages = this.existingImages.length + files.length;
            if (totalImages > 5) {
                this.productError = "Vous ne pouvez pas ajouter plus de 5 images au total";
                event.target.value = '';
                return;
            }
            
            // Ajouter les fichiers au produit
            this.currentProduct.images = files;
            
            // Créer des prévisualisations
            for (let i = 0; i < files.length; i++) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.imagePreviews.push(e.target.result);
                };
                reader.readAsDataURL(files[i]);
            }
        },
        
        removeExistingImage(index) {
            this.existingImages.splice(index, 1);
            this.currentProduct.existingImages.splice(index, 1);
        },
        
        removeNewImage(index) {
            // Créer un nouveau tableau FileList car il est immuable
            const dt = new DataTransfer();
            const files = this.currentProduct.images;
            
            for (let i = 0; i < files.length; i++) {
                if (i !== index) {
                    dt.items.add(files[i]);
                }
            }
            
            this.currentProduct.images = dt.files;
            this.imagePreviews.splice(index, 1);
            this.$refs.fileInput.files = dt.files;
        },
        
        async submitProduct() {
            if (this.existingImages.length + this.imagePreviews.length === 0) {
                this.productError = "Veuillez sélectionner au moins une image pour le produit";
                return;
            }

            this.isProcessing = true;
            this.productError = null;

            try {
                const token = localStorage.getItem('accessToken');
                const formData = new FormData();
                
                // Ajouter les champs du produit
                formData.append('name', this.currentProduct.name);
                formData.append('description', this.currentProduct.description);
                formData.append('price', this.currentProduct.price);
                formData.append('stock', this.currentProduct.stock);
                formData.append('category', this.currentProduct.category);
                
                // Ajouter les images
                for (let i = 0; i < this.currentProduct.images.length; i++) {
                     const image = this.currentProduct.images[i];
                        if (image instanceof File) {
                            formData.append('images', image); // ✅ seulement les nouveaux fichiers
                        }
                }

                const response = await axios.post(`${this.apiBaseUrl}/api/product`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });

                // Ajouter le nouveau produit à la liste
                this.products.unshift({
                    ...response.data.product,
                    currentSlide: 0
                });

                // Fermer le modal et réinitialiser le formulaire
                this.closeProductModal();
                
            } catch (error) {
                console.error("Erreur lors de l'ajout du produit:", error);
                this.handleProductError(error);
            } finally {
                this.isProcessing = false;
            }
        },
        
        async updateProduct() {
            // Validation des champs
            if (!this.currentProduct.name || this.currentProduct.price === '' || this.currentProduct.price < 0 || this.currentProduct.stock === '' || this.currentProduct.stock < 0) {
                this.productError = "Veuillez remplir tous les champs obligatoires avec des valeurs valides";
                return;
            }

            if (this.existingImages.length + this.imagePreviews.length === 0) {
                this.productError = "Veuillez sélectionner au moins une image pour le produit";
                return;
            }

            this.isProcessing = true;
            this.productError = null;

            try {
                const token = localStorage.getItem('accessToken');
                const formData = new FormData();
                
                // Ajouter les champs du produit
                formData.append('name', this.currentProduct.name);
                formData.append('description', this.currentProduct.description || '');
                formData.append('price', this.currentProduct.price);
                formData.append('stock', this.currentProduct.stock);
                formData.append('category', this.currentProduct.category || '');
                
                // Ajouter les nouvelles images
                for (let i = 0; i < this.currentProduct.images.length; i++) {
                    formData.append('images', this.currentProduct.images[i]);
                }

                // Ajouter les chemins des images existantes à conserver
                this.currentProduct.existingImages.forEach((image, index) => {
                    formData.append(`existingImages[${index}]`, image);
                });

                const response = await axios.put(
                    `${this.apiBaseUrl}/api/product/update-product/${this.currentProduct._id}`,
                    formData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );

                // Mise à jour du produit dans la liste
                const index = this.products.findIndex(p => p._id === this.currentProduct._id);
                if (index !== -1) {
                    this.$set(this.products, index, {
                        ...response.data.product,
                        currentSlide: 0
                    });
                }

                // Fermer le modal et réinitialiser le formulaire
                this.closeProductModal();
                
            } catch (error) {
                console.error("Erreur lors de la mise à jour du produit:", error);
                this.handleProductError(error);
            } finally {
                this.isProcessing = false;
            }
        },
        
        handleProductError(error) {
            const errorMessage = error.response && error.response.data && error.response.data.message 
                ? error.response.data.message 
                : "Une erreur s'est produite lors de l'opération";
            this.productError = errorMessage;
        }
    }
};
</script>

<style scoped>
.card-profile {
    position: relative;
    overflow: hidden;
}

.banner-container {
    width: 100%;
    height: 300px;
    background-size: cover;
    background-position: center;
}

.logo-container {
    position: relative;
    margin-top: -80px;
    text-align: center;
}

.shop-logo {
    width: 160px;
    height: 160px;
    object-fit: cover;
    border: 4px solid white;
    background-color: white;
}

/* Styles du carrousel personnalisé */
.custom-carousel {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
    border-radius: 8px;
    margin-bottom: 1rem;
}

.carousel-track {
    display: flex;
    height: 100%;
    transition: transform 0.3s ease;
}

.carousel-slide {
    min-width: 100%;
    height: 100%;
}

.product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.carousel-control {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.3);
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
}

.carousel-control.prev {
    left: 10px;
}

.carousel-control.next {
    right: 10px;
}

.carousel-indicators {
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    gap: 5px;
}

.carousel-indicators span {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    transition: background 0.3s ease;
}

.carousel-indicators span.active {
    background: white;
}

.mt--300 {
    margin-top: -300px;
}

.description {
    color: #525f7f;
    font-size: 0.875rem;
}

.card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

/* Styles améliorés pour le formulaire */
.form-container {
    padding: 2rem;
    background: linear-gradient(135deg, #f8fafc, #e0e7ff);
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border: 1px solid #c7d2fe;
}

.form-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
}

.form-header h5 {
    margin: 0;
    font-weight: 700;
    font-size: 1.4rem;
    color: #1e3a8a;
}

.form-header i {
    font-size: 1.8rem;
    color: #4f46e5;
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.form-name, .form-category, .form-price, .form-stock {
    display: flex;
    flex-direction: column;
}

.form-description, .form-images {
    grid-column: 1 / -1;
}

.form-label {
    font-weight: 700;
    color: #1e3a8a;
    margin-bottom: 0.5rem;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.modern-input, .modern-textarea {
    border: 1px solid #c7d2fe;
    border-radius: 12px;
    padding: 0.8rem;
    background: #ffffff;
    transition: all 0.3s ease;
    font-size: 0.9rem;
    box-shadow: 0 2px 6px rgba(0,0,0,0.06);
}

.modern-input:focus, .modern-textarea:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.2);
    outline: none;
}

.modern-textarea {
    resize: vertical;
    min-height: 80px;
}

.alert-modern {
    border-radius: 12px;
    padding: 1rem;
    margin-bottom: 1rem;
    background: #fef2f2;
    color: #b91c1c;
    border: 1px solid #fecaca;
    box-shadow: 0 2px 8px rgba(185, 28, 28, 0.1);
    display: flex;
    align-items: center;
}

.alert-modern i {
    font-size: 1.2rem;
}

.custom-file-upload {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    border: 2px dashed #a5b4fc;
    border-radius: 12px;
    background: #eef2ff;
    transition: all 0.3s ease;
}

.custom-file-upload:hover {
    border-color: #4f46e5;
    background: #e0e7ff;
    transform: scale(1.02);
}

.file-input {
    opacity: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    cursor: pointer;
}

.file-upload-label {
    display: flex;
    align-items: center;
    padding: 0.7rem 1.4rem;
    background: #4f46e5;
    color: white;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 3px 8px rgba(79, 70, 229, 0.3);
}

.file-upload-label:hover {
    background: #4338ca;
    transform: translateY(-2px);
}

.preview-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 1rem;
}

.image-preview {
    position: relative;
    width: 80px;
    height: 80px;
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.3s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.image-preview:hover {
    transform: scale(1.05);
}

.image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.remove-btn {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ef4444;
    color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.remove-btn:hover {
    background: #dc2626;
    transform: scale(1.2);
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1rem;
}

.btn-modern {
    padding: 0.7rem 1.4rem;
    border-radius: 10px;
    font-weight: 600;
    transition: all 0.3s ease;
    font-size: 0.9rem;
}

.btn-cancel {
    background: #e5e7eb;
    color: #4b5563;
    border: none;
}

.btn-cancel:hover {
    background: #d1d5db;
    transform: translateY(-2px);
}

.btn-submit {
    background: linear-gradient(90deg, #4f46e5, #7c3aed);
    border: none;
    padding: 0.8rem 2rem;
    font-size: 1rem;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    animation: pulse 2s infinite;
}

.btn-submit:hover {
    background: linear-gradient(90deg, #4338ca, #6d28d9);
    transform: translateY(-2px);
    animation: none;
}

.btn-submit:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    box-shadow: none;
    animation: none;
}

.progress-bar {
    height: 6px;
    background: linear-gradient(90deg, #4f46e5, #7c3aed);
    border-radius: 3px;
    margin-bottom: 1rem;
    animation: loading 1.5s infinite;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

@keyframes loading {
    0% { background-position: 0% 50%; }
    100% { background-position: 400% 50%; }
}

@media (min-width: 768px) {
    .form-grid {
        grid-template-columns: 1fr 1fr;
    }
    .form-description, .form-images {
        grid-column: 1 / -1;
    }
}
</style>