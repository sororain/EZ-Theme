<template>
  <div class="main-board">
    <div class="content-area">
      <router-view v-slot="{ Component }">
        <div class="view-wrapper" :key="$route.path">
          <component :is="Component" />
        </div>
      </router-view>
    </div>

    <div class="background-decoration" :class="`background-${backgroundMode}`"></div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { MAIN_BACKGROUND_CONFIG } from '@/utils/baseConfig';
import DomainAuthAlert from '@/components/common/DomainAuthAlert.vue';

export default {
  name: 'MainBoard',
  components: {
    DomainAuthAlert
  },
  setup() {
    const backgroundMode = computed(() => {
      const mode = MAIN_BACKGROUND_CONFIG?.mode;
      if (mode === 'none' || mode === 'full' || mode === 'light') {
        return mode;
      }
      return 'light';
    });

    onMounted(() => {});

    return {
      backgroundMode
    };
  }
};
</script>

<style lang="scss" scoped>
.main-board {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  z-index: 1;
}

.content-area {
  padding: 2rem 1rem;
  padding-top: 80px;

  @media (min-width: 768px) {
    padding: 2rem;
    padding-top: 90px;
  }

  @media (min-width: 1200px) {
    padding: 2rem 4rem;
    padding-top: 90px;
  }
}

.background-decoration {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;

  @supports (-webkit-touch-callout: none) {
    display: none;
  }
}

.background-decoration.background-none {
  background: transparent;
}

.background-decoration.background-light {
  background:
    radial-gradient(circle at 12% 16%, rgba(var(--theme-color-rgb), 0.12) 0, rgba(var(--theme-color-rgb), 0.04) 30%, transparent 55%),
    radial-gradient(circle at 84% 34%, rgba(167, 71, 254, 0.08) 0, rgba(167, 71, 254, 0.03) 30%, transparent 52%),
    radial-gradient(circle at 52% 86%, rgba(55, 222, 201, 0.08) 0, rgba(55, 222, 201, 0.03) 30%, transparent 52%);
}

.background-decoration.background-full {
  background:
    radial-gradient(circle at 12% 16%, rgba(var(--theme-color-rgb), 0.18) 0, rgba(var(--theme-color-rgb), 0.08) 34%, transparent 58%),
    radial-gradient(circle at 84% 34%, rgba(167, 71, 254, 0.13) 0, rgba(167, 71, 254, 0.05) 34%, transparent 56%),
    radial-gradient(circle at 52% 86%, rgba(55, 222, 201, 0.13) 0, rgba(55, 222, 201, 0.05) 34%, transparent 56%);
}

@media (max-width: 1024px) {
  .background-decoration.background-light,
  .background-decoration.background-full {
    background:
      radial-gradient(circle at 12% 16%, rgba(var(--theme-color-rgb), 0.08) 0, rgba(var(--theme-color-rgb), 0.03) 28%, transparent 50%),
      radial-gradient(circle at 82% 30%, rgba(167, 71, 254, 0.05) 0, rgba(167, 71, 254, 0.02) 26%, transparent 48%);
  }
}
</style>
