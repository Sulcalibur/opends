<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="card-header">
          <div class="logo-wrapper">
            <div class="logo">{{ orgInitial }}</div>
          </div>
        </div>
        <div class="card-content">
          <h1 id="auth-title" class="auth-title">Welcome back!</h1>
          <p class="auth-subtitle">Sign in to continue</p>

          <form
            class="auth-form"
            aria-labelledby="auth-title"
            @submit.prevent="handleLogin"
          >
            <div class="form-group">
              <BaseInput
                id="email"
                v-model="email"
                type="email"
                label="Email Address"
                placeholder="name@company.com"
                left-icon="mail"
                :error="emailError"
                required
              />
            </div>

            <div class="form-group">
              <div class="password-field-wrapper">
                <BaseInput
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  label="Password"
                  placeholder="Enter password"
                  left-icon="lock"
                  :error="passwordError"
                  required
                />
                <button
                  type="button"
                  class="toggle-password"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  :aria-pressed="showPassword"
                  @click="showPassword = !showPassword"
                >
                  <i
                    :class="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>

            <div v-if="authStore.error" class="auth-error" role="alert">
              <Icon
                name="i-lucide-x-circle"
                class="h-5 w-5 text-error-500"
                aria-hidden="true"
              />
              <span>{{ authStore.error }}</span>
            </div>

            <BaseButton
              type="submit"
              variant="primary"
              size="large"
              class="auth-button"
              :loading="authStore.loading"
              icon-left="log-in"
            >
              Sign In
            </BaseButton>

            <div class="form-footer">
              <div class="form-links">
                <NuxtLink to="/register" class="form-link">
                  Create account
                </NuxtLink>
                <a href="#" class="form-link">Forgot password?</a>
              </div>
            </div>

            <div class="social-login">
              <p class="social-title">Or continue with</p>
              <div class="social-buttons">
                <button
                  type="button"
                  class="social-button"
                  aria-label="Sign in with Google"
                >
                  <Icon
                    name="i-lucide-google"
                    class="h-5 w-5"
                    aria-hidden="true"
                  />
                </button>
                <button
                  type="button"
                  class="social-button"
                  aria-label="Sign in with GitHub"
                >
                  <Icon
                    name="i-lucide-github"
                    class="h-5 w-5"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="auth-footer">
      <p>{{ orgName }} v0.2.0 • Powered by Nessie Design Engine</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PublicSettingsResponse {
  settings: {
    organization_name?: string;
  };
}

const { data: settingsData } = useFetch<PublicSettingsResponse>(
  "/api/settings/public",
  {
    server: false,
  },
);
const settings = computed(() => settingsData.value?.settings || {});

const orgName = computed(() => settings.value.organization_name || "OpenDS");
const orgInitial = computed(() => orgName.value.substring(0, 2).toUpperCase());

const authStore = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const emailError = ref("");
const passwordError = ref("");

async function handleLogin() {
  emailError.value = "";
  passwordError.value = "";

  if (!email.value) {
    emailError.value = "Email is required";
    return;
  }
  if (!password.value) {
    passwordError.value = "Password is required";
    return;
  }

  const success = await authStore.login(email.value, password.value);
  if (success) {
    router.push("/admin");
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-50);
  padding: 2rem;
  font-family: var(--font-family-body);
}

.auth-container {
  width: 100%;
  max-width: 480px;
}

.auth-card {
  background: var(--color-bg-50);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-card);
  padding: 3rem;
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.logo {
  width: 72px;
  height: 72px;
  background: var(--color-primary-500);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: var(--font-weight-extrabold);
  font-size: 2rem;
}

.auth-title {
  font-size: 2.5rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  text-align: center;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.auth-subtitle {
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  text-align: center;
  margin-bottom: 2.5rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  position: relative;
}

.password-field-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  color: var(--color-text-400);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--transition-base);
  z-index: 10;
}

.toggle-password:hover {
  color: var(--color-primary-500);
}

.auth-error {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--color-error-50);
  border-radius: var(--radius-md);
  animation: slide-down 0.3s var(--easing-out);
}

.auth-error span {
  font-size: 0.9375rem;
  color: var(--color-error-600);
}

.auth-button {
  width: 100%;
  margin-top: 0.5rem;
}

.form-footer {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border-light);
}

.form-links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.form-link {
  color: var(--color-primary-600);
  text-decoration: none;
  font-weight: var(--font-weight-semibold);
  font-size: 1rem;
  transition: color var(--transition-base);
}

.form-link:hover {
  color: var(--color-primary-700);
  text-decoration: underline;
}

.social-login {
  text-align: center;
  margin-top: 1.5rem;
}

.social-title {
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
}

.social-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.social-button {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  border: 2px solid var(--color-border);
  background: var(--color-bg-50);
  color: var(--color-text-primary);
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    border-color var(--transition-base),
    transform var(--transition-base),
    box-shadow var(--transition-base);
}

.social-button:hover {
  border-color: var(--color-primary-300);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.auth-footer {
  text-align: center;
  margin-top: 2rem;
}

.auth-footer p {
  font-size: 0.875rem;
  color: var(--color-text-tertiary);
}

.dark .auth-page {
  background: var(--color-bg-900);
}

.dark .auth-card {
  background: var(--color-bg-800);
  border-color: var(--color-border);
}

.dark .logo {
  background: var(--color-primary-400);
}

.dark .auth-title,
.dark .auth-error span {
  color: var(--color-text-primary);
}

.dark .auth-subtitle,
.dark .social-title {
  color: var(--color-text-secondary);
}

.dark .social-button {
  background: var(--color-bg-700);
  border-color: var(--color-border-200);
  color: var(--color-text-primary);
}

.dark .social-button:hover {
  border-color: var(--color-primary-400);
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
