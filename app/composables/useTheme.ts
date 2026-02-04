import { ref, computed, onMounted } from "vue";

export function useTheme() {
  const isDark = ref(false);

  onMounted(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) {
        isDark.value = saved === "dark";
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        isDark.value = true;
      }
      applyTheme();
    }
  });

  function toggle() {
    isDark.value = !isDark.value;
    applyTheme();
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", isDark.value ? "dark" : "light");
    }
  }

  function applyTheme() {
    if (typeof document === "undefined") return;

    const html = document.documentElement;

    if (isDark.value) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }

  const theme = computed(() =>
    isDark.value ? ("dark" as const) : ("light" as const),
  );

  return {
    isDark,
    theme,
    toggle,
    set: (value: "dark" | "light") => {
      isDark.value = value === "dark";
      applyTheme();
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", value);
      }
    },
  };
}
