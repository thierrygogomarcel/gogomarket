<template>
  <div class="min-h-screen relative">
    <!-- Fond dynamique -->
    <div class="page-background"></div>
    
    <!-- Contenu -->
    <div class="relative z-10 min-h-screen flex flex-col">
      <TheHeader />
      
      <main class="flex-grow container mx-auto px-4 py-8">
        <slot />
      </main>
      
      <TheFooter />
    </div>
  </div>
</template>

<style>
@import '~/assets/css/style.css';
</style>