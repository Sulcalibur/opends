<template>
  <ClientOnly>
    <UApp>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UApp>
    <template #fallback>
      <div style="min-height:100vh; background:var(--bg)" />
    </template>
  </ClientOnly>
</template>
