<template>
  <div
    ref="menuRef"
    class="custom-context-menu"
    :class="{ 'ctx-visible': show }"
    :style="{ top: position.y + 'px', left: position.x + 'px' }"
    @click.stop
  >
    <button type="button" class="custom-context-menu__action" @click="handleRefresh">
      <span class="custom-context-menu__icon">↻</span>
      <span>{{ refreshLabel }}</span>
    </button>
  </div>
</template>

<script>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { CONTEXT_MENU_CONFIG } from '@/utils/baseConfig';

export default {
  name: 'CustomContextMenu',
  setup() {
    const { t } = useI18n();
    const show = ref(false);
    const menuRef = ref(null);
    const position = ref({ x: 0, y: 0 });
    const menuMargin = 8;
    const refreshLabel = computed(() => {
      const text = CONTEXT_MENU_CONFIG.refreshText;
      return typeof text === 'string' && text.trim() ? text.trim() : t('contextMenu.refresh');
    });

    const hideMenu = () => {
      show.value = false;
    };

    const placeMenuWithViewportBoundary = (event) => {
      const menuEl = menuRef.value;
      if (!menuEl) return;

      const menuWidth = menuEl.offsetWidth;
      const menuHeight = menuEl.offsetHeight;
      let x = event.clientX;
      let y = event.clientY;

      if (x + menuWidth > window.innerWidth) {
        x = Math.max(menuMargin, window.innerWidth - menuWidth - menuMargin);
      }
      if (y + menuHeight > window.innerHeight) {
        y = Math.max(menuMargin, window.innerHeight - menuHeight - menuMargin);
      }

      position.value = { x, y };
    };

    const handleContextMenu = async (event) => {
      event.preventDefault();

      show.value = false;
      await nextTick();

      position.value = { x: -9999, y: -9999 };
      show.value = true;
      await nextTick();

      placeMenuWithViewportBoundary(event);
    };

    const handleRefresh = () => {
      hideMenu();
      window.location.reload();
    };

    onMounted(() => {
      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('click', hideMenu);
      document.addEventListener('scroll', hideMenu, true);
      window.addEventListener('resize', hideMenu);
      window.addEventListener('blur', hideMenu);
    });

    onUnmounted(() => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', hideMenu);
      document.removeEventListener('scroll', hideMenu, true);
      window.removeEventListener('resize', hideMenu);
      window.removeEventListener('blur', hideMenu);
    });

    return {
      show,
      menuRef,
      position,
      refreshLabel,
      handleRefresh
    };
  }
};
</script>

<style lang="scss" scoped>
@keyframes ctx-in {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(-5px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.custom-context-menu {
  position: fixed;
  z-index: 99999;
  width: max-content;
  min-width: 0;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  background: rgba(235, 243, 255, 0.3);
  box-shadow: 0 8px 28px rgba(15, 23, 42, 0.2), 0 2px 6px rgba(0, 0, 0, 0.07);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  padding: 4px 0;
  display: none;
  transform-origin: top left;
  overflow: hidden;
}

.custom-context-menu.ctx-visible {
  display: block;
  animation: ctx-in 0.15s cubic-bezier(0.2, 0.9, 0.4, 1) both;
}

.custom-context-menu__action {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 7px;
  border: 0;
  outline: none;
  background: transparent;
  border-radius: 6px;
  margin: 0 4px;
  width: calc(100% - 8px);
  padding: 6px 12px 6px 10px;
  font-size: 13px;
  font-weight: 500;
  color: #1e293b;
  text-align: left;
  line-height: 1.4;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.12s ease, box-shadow 0.12s ease, color 0.12s ease;
  -webkit-tap-highlight-color: transparent;
}

.custom-context-menu__action:hover,
.custom-context-menu__action:focus {
  background: rgba(148, 182, 233, 0.22);
  box-shadow: inset 0 0 0 1px rgba(148, 182, 233, 0.3);
  color: #0f172a;
}

.custom-context-menu__action:active {
  background: rgba(148, 182, 233, 0.32);
  box-shadow: inset 0 0 0 1px rgba(148, 182, 233, 0.4);
  color: #0f172a;
}

.custom-context-menu__icon {
  font-size: 14px;
  opacity: 0.7;
  line-height: 1;
}
</style>