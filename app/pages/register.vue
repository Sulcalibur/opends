<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="card-header">
          <div class="logo-wrapper">
            <div class="logo">
              {{ orgInitial }}
            </div>
          </div>
        </div>
        <div class="card-content">
          <h1 id="auth-title" class="auth-title">Create Account</h1>
          <p class="auth-subtitle">Join us to build beautiful design systems</p>

          <form
            class="auth-form"
            aria-labelledby="auth-title"
            @submit.prevent="handleRegister"
          >
            <div class="form-group">
              <BaseInput
                id="name"
                v-model="name"
                type="text"
                label="Full Name"
                placeholder="John Doe"
                left-icon="user"
                :error="nameError"
                required
              />
            </div>

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
                  placeholder="Create a secure password"
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
                  <Icon
                    :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'"
                    aria-hidden="true"
                  />
                </button>
              </div>
              <small v-if="!passwordError" class="password-hint">
                Min 8 characters, uppercase, lowercase, and number
              </small>
            </div>

            <BaseError
              v-if="authStore.error"
              :message="authStore.error"
              role="alert"
            />

            <div v-if="isFirstUser" class="first-user-notice" role="status">
              <Icon name="lucide:info" aria-hidden="true" />
              <div>
                <strong>First User Setup</strong>
                <p>You'll become the administrator with full system access.</p>
              </div>
            </div>

            <BaseButton
              type="submit"
              variant="primary"
              size="large"
              class="auth-button"
              :loading="authStore.loading"
              icon-left="user-plus"
            >
              Create Account
            </BaseButton>

            <div class="form-footer">
              <div class="form-links">
                <span>Already have an account?</span>
                <NuxtLink to="/login" class="form-link"> Sign in </NuxtLink>
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
                  <Icon name="lucide:google" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  class="social-button"
                  aria-label="Sign in with GitHub"
                >
                  <Icon name="lucide:github" aria-hidden="true" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PublicSettingsResponse {
  settings: {
    organization_name?: string;
  };
}

const { data: settingsData } = await useFetch<PublicSettingsResponse>(
  "/api/settings/public",
);
const settings = computed(() => settingsData.value?.settings || {});

const orgName = computed(() => settings.value.organization_name || "OpenDS");
const orgInitial = computed(() => orgName.value.substring(0, 2).toUpperCase());

const authStore = useAuthStore();
const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const nameError = ref("");
const emailError = ref("");
const passwordError = ref("");
const isFirstUser = ref(false);

onMounted(async () => {
  try {
    const response = await $fetch("/api/auth/status");
    isFirstUser.value = (response as any)?.isFirstUser || false;
  } catch {
    isFirstUser.value = false;
  }
});

async function handleRegister() {
  nameError.value = "";
  emailError.value = "";
  passwordError.value = "";

  if (!name.value) {
    nameError.value = "Name is required";
    return;
  }
  if (!email.value) {
    emailError.value = "Email is required";
    return;
  }
  if (!password.value) {
    passwordError.value = "Password is required";
    return;
  }
  if (password.value.length < 8) {
    passwordError.value = "Password must be at least 8 characters";
    return;
  }

  const success = await authStore.register(
    email.value,
    password.value,
    name.value,
  );

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
  background: var(--color-bg);
  padding: 2rem;
  font-family: var(--font-family-body);
}

.auth-container {
  width: 100%;
  max-width: 480px;
}

.auth-card {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
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
  box-shadow: var(--shadow-sm);
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
}

.toggle-password:hover {
  color: var(--color-primary-500);
}

.password-hint {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-text-400);
  margin-top: var(--space-1);
  line-height: var(--line-height-normal);
}

.first-user-notice {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--color-bg-200);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.first-user-notice strong {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-0-5);
}

.first-user-notice p {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: var(--line-height-normal);
}

.auth-button {
  width: 100%;
  padding: 1rem !important;
  margin-top: 1rem;
}

.form-footer {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border-light);
}

.form-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.form-links span {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.form-link {
  color: var(--color-primary-500);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: color var(--transition-base);
}

.form-link:hover {
  color: var(--color-primary-400);
  text-decoration: underline;
}

.social-login {
  text-align: center;
  margin-top: 2rem;
}

.social-title {
  font-size: var(--font-size-sm);
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
  border-radius: var(--radius-lg);
  border: 2px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    border-color var(--transition-base),
    transform var(--transition-fast);
}

.social-button:hover {
  border-color: var(--color-primary-300);
  transform: translateY(-2px);
}

.dark .auth-page {
  background: var(--dark-color-bg);
}

.dark .auth-card {
  background: var(--dark-color-surface);
  border-color: var(--dark-color-border);
  box-shadow: var(--dark-shadow-md);
}

.dark .logo {
  background: var(--color-primary-400);
  box-shadow: var(--dark-shadow-sm);
}

.dark .auth-title,
.dark .first-user-notice strong {
  color: var(--dark-color-text-primary);
}

.dark .auth-subtitle,
.dark .social-title,
.dark .form-links span,
.dark .password-hint,
.dark .first-user-notice p {
  color: var(--dark-color-text-secondary);
}

.dark .social-button {
  background: var(--dark-color-surface);
  border-color: var(--dark-color-border);
  color: var(--dark-color-text-primary);
}

.dark .social-button:hover {
  border-color: var(--color-primary-400);
}

.dark .first-user-notice {
  background: var(--dark-color-bg-100);
  border-color: var(--dark-color-border);
}

.dark .form-footer {
  border-color: var(--dark-color-border);
}

@media (max-width: 640px) {
  .auth-card {
    padding: 2rem 1.5rem;
  }
  .auth-title {
    font-size: 2rem;
  }
}
</style>
