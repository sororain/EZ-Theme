<template>
  <div ref="selectorRef" class="language-selector">
    <button
      class="language-btn"
      :title="$t('common.language')"
      @click="toggleDropdown"
    >
      <span class="flag-icon">
        <span class="flag-container">
          <img
            v-if="currentLanguageItem"
            :src="currentLanguageItem.flagSrc"
            :alt="currentLanguageItem.name"
            class="flag-image"
          >
        </span>
      </span>
    </button>

    <div v-if="isOpen" ref="dropdown" class="language-dropdown">
      <div
        v-for="lang in languages"
        :key="lang.code"
        class="language-item"
        :class="{ active: currentLanguage === lang.code }"
        @click="changeLanguage(lang.code)"
      >
        <span class="flag-icon">
          <img :src="lang.flagSrc" :alt="lang.name" class="flag-image">
        </span>
        <span class="lang-name">{{ lang.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, nextTick, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { setLanguage } from '@/i18n';
import cnFlag from '@/assets/i18N/CN.svg';
import gbFlag from '@/assets/i18N/GB.svg';

export default {
  name: 'LanguageSelector',
  setup() {
    const { locale } = useI18n();
    const isOpen = ref(false);
    const dropdown = ref(null);
    const selectorRef = ref(null);

    const languages = [
      { code: 'zh-CN', name: '简体中文', flagSrc: cnFlag },
      { code: 'en-US', name: 'English', flagSrc: gbFlag }
    ];

    const currentLanguage = computed(() => locale.value);
    const currentLanguageItem = computed(() => {
      return languages.find(lang => lang.code === currentLanguage.value) || languages[0];
    });

    const closeDropdown = () => {
      isOpen.value = false;
    };

    const positionDropdown = () => {
      if (!dropdown.value) return;

      dropdown.value.style.right = '0';
      dropdown.value.style.left = 'auto';
      dropdown.value.style.top = 'calc(100% + 8px)';
      dropdown.value.style.bottom = 'auto';

      const rect = dropdown.value.getBoundingClientRect();

      if (rect.right > window.innerWidth) {
        dropdown.value.style.right = '0';
        dropdown.value.style.left = 'auto';
      }

      if (rect.bottom > window.innerHeight) {
        dropdown.value.style.bottom = 'calc(100% + 8px)';
        dropdown.value.style.top = 'auto';
      }
    };

    const unbindOpenListeners = () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('scroll', handleWindowChange, true);
      window.removeEventListener('resize', handleWindowChange);
      window.removeEventListener('blur', handleWindowChange);
    };

    const handleClickOutside = (event) => {
      if (selectorRef.value && !selectorRef.value.contains(event.target)) {
        closeDropdown();
        unbindOpenListeners();
      }
    };

    const handleWindowChange = () => {
      if (!isOpen.value) return;
      closeDropdown();
      unbindOpenListeners();
    };

    const bindOpenListeners = () => {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('scroll', handleWindowChange, true);
      window.addEventListener('resize', handleWindowChange);
      window.addEventListener('blur', handleWindowChange);
    };

    const toggleDropdown = async () => {
      if (isOpen.value) {
        closeDropdown();
        unbindOpenListeners();
        return;
      }

      isOpen.value = true;
      await nextTick();
      positionDropdown();
      bindOpenListeners();
    };

    const changeLanguage = (langCode) => {
      setLanguage(langCode);
      closeDropdown();
      unbindOpenListeners();
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: langCode }));
    };

    onUnmounted(() => {
      unbindOpenListeners();
    });

    return {
      isOpen,
      dropdown,
      selectorRef,
      languages,
      currentLanguage,
      currentLanguageItem,
      toggleDropdown,
      changeLanguage
    };
  }
};
</script>

<style lang="scss" scoped>
.language-selector {
  position: relative;
  display: inline-block;
}

.language-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 6px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  border-radius: 50%;
  background-color: var(--card-background);
  color: var(--text-color);
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background-color: rgba(var(--theme-color-rgb), 0.1);
    border-color: var(--theme-color);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
  }
}

.flag-icon,
.flag-container {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 50%;
}

.flag-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.language-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 200;
  min-width: 130px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: rgba(var(--card-background-rgb), 0.95);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.language-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  font-size: 14px;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.18s ease, color 0.18s ease;

  .flag-icon {
    width: 24px;
    height: 16px;
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 3px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  &:hover {
    background-color: rgba(var(--theme-color-rgb), 0.1);
  }

  &.active {
    background-color: rgba(var(--theme-color-rgb), 0.18);
    color: var(--theme-color);
    font-weight: 500;
  }
}
</style>
