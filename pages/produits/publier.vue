<template>
  <div class="card p-8" style="min-width: 600px; margin: 0 auto;"   >
    <div class="bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-2xl font-bold text-green-600 mb-8">Publier une offre</h1>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Sélection du produit -->
        <div>
          <h2 class="text-lg font-medium text-gray-900 mb-4">Détails du produit</h2>
          <div class="grid grid-cols-1 gap-6">
            <div>
              <label for="category" class="block text-sm font-medium text-gray-700">Catégorie</label>
              <select id="category" v-model="selectedCategory" @change="updateProducts" required class="input-field">
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
            
            <div>
              <label for="product" class="block text-sm font-medium text-gray-700">Produit</label>
              <select id="product" v-model="selectedProduct" @change="fillProductDetails" required class="input-field">
                <option v-for="product in filteredProducts" :key="product.id" :value="product">
                  {{ product.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Prix (FCFA)</label>
              <input v-model="selectedProduct.price" type="number" disabled class="input-field bg-gray-100" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Stock disponible (kg)</label>
              <input v-model="selectedProduct.stock" type="number" disabled class="input-field bg-gray-100" />
            </div>
          </div>
        </div>

        <!-- Description éditable -->
        <div>
          <h2 class="text-lg font-medium text-gray-900 mb-4">Message de l'offre</h2>
          <textarea id="description" v-model="description" rows="4" required class="input-field"></textarea>
        </div>

        <!-- Bouton de soumission -->
        <div class="flex justify-end">
          <button type="submit" :disabled="loading" class="submit-button">
            <span v-if="loading">Publication en cours...</span>
            <span v-else>Publier l'offre</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useAuth } from '~/composables/useAuth';

const categories = ['Légumes', 'Fruits', 'Céréales', 'Tubercules'];
const allProducts = ref([
  { id: 1, name: 'Tomate', category: 'Légumes', price: 500, stock: 100 },
  { id: 2, name: 'Banane', category: 'Fruits', price: 300, stock: 200 },
]);

const selectedCategory = ref('');
const selectedProduct = ref({});
const description = ref('');
const loading = ref(false);
const router = useRouter();
const { state } = useAuth();

const filteredProducts = computed(() => 
  allProducts.value.filter(p => p.category === selectedCategory.value)
);

const updateProducts = () => {
  selectedProduct.value = {};
  description.value = '';
};

const fillProductDetails = () => {
  if (selectedProduct.value) {
    description.value = `Offre spéciale sur ${selectedProduct.value.name}! Contactez-moi pour plus d'infos.`;
  }
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    const offerData = {
      productId: selectedProduct.value.id,
      description: description.value,
    };

    const token = state.token;
    console.log("Token utilisé :", state.token);

    await $fetch('/api/offers/publish', { method: 'POST', body: offerData, headers: { Authorization: `Bearer ${token}` } });
   console.log("Données envoyées :", offerData);

   toast.success('Offre publiée avec succès');
    router.push('/mes-offres');
  } catch (error) {
    toast.error(error.message || 'Erreur lors de la publication');
  } finally {
    loading.value = false;
  }
};
</script>

<style>
.input-field {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  outline: none;
  transition: border 0.2s;
}
.input-field:focus {
  border-color: #4CAF50;
}
.submit-button {
  background-color: #4CAF50;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: bold;
  transition: background 0.2s;
}
.submit-button:hover {
  background-color: #388E3C;
}
</style>
