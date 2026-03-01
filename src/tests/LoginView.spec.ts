import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginView from '@/views/auth/LoginView.vue';
import { reactive, ref } from 'vue';

// Mocks
const mockPush = vi.fn();
const mockLogin = vi.fn();
const mockSignUp = vi.fn();
const mockValidationError = vi.fn();

// Mock useRouter
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock useAuth
vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({
    step: ref(1),
    loading: ref(false),
    loadingButtonCreate: ref(false),
    loginForm: reactive({ email: '', password: '' }),
    signupForm: reactive({ username: '', email: '', password: '', confirmPassword: '' }),
    login: mockLogin,
    signUp: mockSignUp,
  }),
}));

// Mock useGlobal
vi.mock('@/composables/useGlobal', () => ({
  useGlobal: () => ({
    validationErrorMessages: ref([]),
    validationShowError: ref(false),
    validationError: mockValidationError,
  }),
}));

describe('LoginView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const globalOptions = {
    stubs: {
      // Stub generic vuetify components
      'v-container': { template: '<div><slot /></div>' },
      'v-row': { template: '<div><slot /></div>' },
      'v-col': { template: '<div><slot /></div>' },
      'v-card': { template: '<div><slot /></div>' },
      'v-window': { template: '<div><slot /></div>' },
      'v-window-item': { template: '<div><slot /></div>' },
      'v-card-text': { template: '<div><slot /></div>' },
      'v-expand-transition': { template: '<div><slot /></div>' },
      'v-alert': { template: '<div><slot /></div>' },
      'v-icon': true,
      'v-fade-transition': { template: '<div><slot /></div>' },

      // Critical stubs for interaction
      // Explicitly stub v-form to render a form so we can trigger submit.
      // We rely on fallthrough attributes for the @submit listener from parent.
      'v-form': {
        template: '<form><slot /></form>'
      },
      // Stub v-text-field to render an input we can find
      'v-text-field': {
        template: '<div><input class="v-text-field-stub" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" /></div>',
        props: ['modelValue']
      },
      // Stub v-btn
      'v-btn': {
        template: '<button type="submit" @click="$emit(\'click\')"><slot /></button>'
      },
      // Stub PasswordInput
      'password-input': {
        template: '<div><input type="password" class="password-input-stub" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" /></div>',
        props: ['modelValue']
      }
    }
  };

  it('renders interactable form elements', () => {
    // Mount LoginView, which renders Login. Login needs stubs.
    const wrapper = mount(LoginView, { global: globalOptions });

    // Check if input exists
    expect(wrapper.find('.v-text-field-stub').exists()).toBe(true);
    expect(wrapper.find('.password-input-stub').exists()).toBe(true);
  });

  it('calls login action with form data when form is submitted', async () => {
    const wrapper = mount(LoginView, { global: globalOptions });

    const emailInput = wrapper.find('.v-text-field-stub');
    await emailInput.setValue('test@example.com');

    const passwordInput = wrapper.find('.password-input-stub');
    await passwordInput.setValue('password123');

    // Submit form
    await wrapper.find('form').trigger('submit');

    expect(mockLogin).toHaveBeenCalled();
    // After login, it should redirect
    await flushPromises();

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('handles login error', async () => {
    const error = new Error('Login failed');
    mockLogin.mockRejectedValueOnce(error);

    const wrapper = mount(LoginView, { global: globalOptions });

    await wrapper.find('form').trigger('submit');

    await flushPromises();

    expect(mockValidationError).toHaveBeenCalledWith(error);
  });
});
