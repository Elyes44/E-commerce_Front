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
                                    <base-button type="info" size="sm" class="mr-4">Contact</base-button>
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
                                <!-- Carrousel d'images -->
                                <div class="product-carousel mb-3">
                                    <swiper
                                        :slides-per-view="1"
                                        :space-between="10"
                                        :pagination="{ clickable: true }"
                                        :modules="modules"
                                        class="product-swiper"
                                    >
                                        <swiper-slide v-for="(image, imgIndex) in product.images" :key="imgIndex">
                                            <img
                                                :src="getProductImageUrl(image, imgIndex)"
                                                @error="handleProductImageError($event, index, imgIndex)"
                                                class="product-image"
                                                alt="Image produit"
                                            >
                                        </swiper-slide>
                                    </swiper>
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
                                
                                <base-button type="primary" size="sm" class="mt-3 align-self-start">
                                    <i class="ni ni-cart"></i> Ajouter au panier
                                </base-button>
                            </card>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default {
    components: {
        Swiper,
        SwiperSlide
    },
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
            modules: [Pagination]
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
                height: '300px',
                opacity: this.bannerError ? '0.5' : '1',
                transition: 'opacity 0.5s ease'
            };
        }
    },
    async created() {
        await this.preloadBanner();
        await this.fetchShopData();
        await this.fetchProducts();
    },
    methods: {
        async preloadBanner() {
            if (!this.shopData.banner) return;
            const bannerUrl = `${this.apiBaseUrl}/${this.shopData.banner.replace(/\\/g, '/').replace('public/', '')}`;
            const img = new Image();
            img.src = bannerUrl;
            img.onerror = () => {
                this.bannerError = true;
            };
            await new Promise(resolve => {
                img.onload = resolve;
                img.onerror = resolve;
            });
        },
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
                
                this.products = response.data.products;
                
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

.product-carousel {
    position: relative;
    height: 200px;
    overflow: hidden;
    border-radius: 8px;
}

.product-swiper {
    width: 100%;
    height: 100%;
}

.product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
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

/* Swiper pagination styles */
:deep(.swiper-pagination-bullet) {
    background: #8898aa;
    opacity: 0.7;
}

:deep(.swiper-pagination-bullet-active) {
    background: #5e72e4;
    opacity: 1;
}
</style>