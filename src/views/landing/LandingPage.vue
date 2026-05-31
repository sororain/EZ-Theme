<template>
  <div
    ref="landingPageRef"
    class="landing-page"
    :class="{ 'dark-theme': isDarkTheme }"
    @wheel="handleWheel"
    @scroll="handleScroll"
  >
    <div class="background-decoration">
      <div class="bg-circle circle-1" :class="{ 'dark-mode': isDarkTheme }"></div>
      <div class="bg-circle circle-2" :class="{ 'dark-mode': isDarkTheme }"></div>
      <div class="bg-circle circle-3" :class="{ 'dark-mode': isDarkTheme }"></div>
    </div>

    <div class="top-toolbar">
      <ThemeToggle />
      <LanguageSelector />
    </div>

    <div class="content-container">
      <div class="site-title">
        <img v-if="siteConfig.showLogo" src="/images/logo.png" alt="Logo" class="site-logo-img" />
        {{ siteConfig.siteName }}
      </div>
      <div class="landing-text">{{ $t('landing.mainText') }}</div>
    </div>

    <div class="scroll-arrow-container" @click="navigateToLogin">
      <div class="scroll-arrow">
        <IconChevronDown :size="32" :stroke-width="1.5" />
      </div>
      <div class="scroll-text">{{ $t('landing.scrollText') }}</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { SITE_CONFIG } from '@/utils/baseConfig';
import ThemeToggle from '@/components/common/ThemeToggle.vue';
import LanguageSelector from '@/components/common/LanguageSelector.vue';
import { IconChevronDown } from '@tabler/icons-vue';

export default {
  name: 'LandingPage',
  components: {
    ThemeToggle,
    LanguageSelector,
    IconChevronDown
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const landingPageRef = ref(null);
    const isDarkTheme = computed(() => store.getters.currentTheme === 'dark');
    const siteConfig = ref(SITE_CONFIG);
    const isTransitioning = ref(false);

    const navigateToLogin = () => {
      if (isTransitioning.value) {
        return;
      }

      isTransitioning.value = true;
      router.push('/login');
    };

    const handleScroll = (event) => {
      if (event.currentTarget === landingPageRef.value && window.scrollY > 100) {
        navigateToLogin();
      }
    };

    const handleWheel = (event) => {
      if (event.currentTarget === landingPageRef.value && event.deltaY > 0) {
        navigateToLogin();
      }
    };

    let touchStartY = 0;
    let handleTouchStart;
    let handleTouchMove;

    onMounted(() => {
      handleTouchStart = (event) => {
        if (event.currentTarget === landingPageRef.value || landingPageRef.value.contains(event.target)) {
          touchStartY = event.touches[0].clientY;
        }
      };

      handleTouchMove = (event) => {
        if (event.currentTarget === landingPageRef.value || landingPageRef.value.contains(event.target)) {
          const touchY = event.touches[0].clientY;
          if (touchStartY - touchY > 50) {
            navigateToLogin();
          }
        }
      };

      if (landingPageRef.value) {
        landingPageRef.value.addEventListener('touchstart', handleTouchStart, { passive: true });
        landingPageRef.value.addEventListener('touchmove', handleTouchMove, { passive: true });
      }
    });

    onUnmounted(() => {
      if (landingPageRef.value) {
        landingPageRef.value.removeEventListener('touchstart', handleTouchStart);
        landingPageRef.value.removeEventListener('touchmove', handleTouchMove);
      }
    });

    return {
      landingPageRef,
      siteConfig,
      isDarkTheme,
      isTransitioning,
      navigateToLogin,
      handleScroll,
      handleWheel
    };
  }
};
</script>

<style lang="scss" scoped>
.landing-page {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--background-color);
  color: var(--text-color);
  transition: background-color 0.2s ease, color 0.2s ease;
}

.background-decoration {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;

  @supports (-webkit-touch-callout: none) {
    display: none;
  }

  .bg-circle {
    position: absolute;
    border-radius: 50%;
    filter: blur(72px);
    opacity: 0.28;
    transition: opacity 0.25s ease, background-color 0.25s ease;

    @supports (-webkit-touch-callout: none) {
      filter: blur(18px);
      opacity: 0.12;
    }

    &.dark-mode {
      opacity: 0.18;
      filter: blur(84px) saturate(0.7);

      @supports (-webkit-touch-callout: none) {
        filter: blur(14px) saturate(0.5);
        opacity: 0.08;
      }
    }
  }

  .circle-1 {
    width: 520px;
    height: 520px;
    background: var(--theme-color);
    top: -10%;
    left: -10%;

    &.dark-mode {
      background: rgba(0, 148, 124, 0.48);
    }
  }

  .circle-2 {
    width: 420px;
    height: 420px;
    background: #a747fe;
    top: 42%;
    right: -4%;

    &.dark-mode {
      background: rgba(167, 71, 254, 0.4);
    }
  }

  .circle-3 {
    width: 380px;
    height: 380px;
    background: #37dec9;
    bottom: -8%;
    left: 20%;

    &.dark-mode {
      background: rgba(55, 222, 201, 0.38);
    }
  }
}

.top-toolbar {
  position: fixed;
  top: 20px;
  right: 25px;
  display: flex;
  gap: 12px;
  z-index: 100;
}

.content-container {
  position: relative;
  z-index: 10;
  max-width: 800px;
  padding: 0 20px;
  text-align: center;
}

.site-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
  font-size: 48px;
  font-weight: 700;
  letter-spacing: -0.5px;
  text-align: center;
  background: linear-gradient(to right, var(--theme-color), #a78bfa);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  .site-logo-img {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    object-fit: cover;
  }
}

.landing-text {
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 1.5;
  margin-bottom: 2rem;
  color: var(--text-color);
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
}

.scroll-arrow-container {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  z-index: 10;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
}

.scroll-arrow {
  color: var(--theme-color);
  margin-bottom: 8px;
  animation: bounce 2s infinite;
}

.scroll-text {
  font-size: 0.875rem;
  color: var(--secondary-text-color);
  opacity: 0.8;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }

  40% {
    transform: translateY(-20px);
  }

  60% {
    transform: translateY(-10px);
  }
}

@media (max-width: 768px) {
  .scroll-arrow-container {
    bottom: 30px;
  }
}
</style>
