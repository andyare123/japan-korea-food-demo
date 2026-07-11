<template>
  <nav v-if="pages.total_pages > 1" class="pagination-nav" aria-label="Page navigation">
    <ul class="pagination justify-content-center mb-0">
      <li class="page-item" :class="{ disabled: !pages.has_pre }">
        <button
          type="button"
          class="page-link"
          aria-label="Previous"
          :disabled="!pages.has_pre"
          @click="updatePage(pages.current_page - 1)"
        >
          <i class="bi bi-chevron-left"></i>
        </button>
      </li>

      <li
        v-for="page in pages.total_pages"
        :key="page"
        class="page-item"
        :class="{ active: page === pages.current_page }"
      >
        <button
          type="button"
          class="page-link"
          :aria-current="page === pages.current_page ? 'page' : null"
          @click="updatePage(page)"
        >
          {{ page }}
        </button>
      </li>

      <li class="page-item" :class="{ disabled: !pages.has_next }">
        <button
          type="button"
          class="page-link"
          aria-label="Next"
          :disabled="!pages.has_next"
          @click="updatePage(pages.current_page + 1)"
        >
          <i class="bi bi-chevron-right"></i>
        </button>
      </li>
    </ul>

    <div class="pagination-info mt-3">
      第 {{ pages.current_page }} / {{ pages.total_pages }} 頁
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    pages: {
      type: Object,
      default() {
        return {
          total_pages: 1,
          current_page: 1,
          has_pre: false,
          has_next: false,
        };
      },
    },
  },
  emits: ['emit-pages'],
  methods: {
    updatePage(page) {
      if (
        page < 1
        || page > this.pages.total_pages
        || page === this.pages.current_page
      ) {
        return;
      }

      this.$emit('emit-pages', page);
    },
  },
};
</script>

<style scoped>
.pagination-nav {
  display: grid;
  justify-content: center;
  text-align: center;
}

.pagination {
  gap: 8px;
}

.page-item .page-link {
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--brand-primary);
  background: #ffffff;
  border: 1px solid var(--brand-border);
  font-weight: 900;
  box-shadow: 0 8px 18px rgba(120, 54, 28, 0.08);
}

.page-item .page-link:hover {
  color: #ffffff;
  background: var(--brand-primary);
  border-color: var(--brand-primary);
}

.page-item.active .page-link {
  color: #ffffff;
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  box-shadow: 0 10px 22px rgba(178, 58, 46, 0.22);
}

.page-item.disabled .page-link,
.page-link:disabled {
  color: #c2aaa0;
  background: #fff8f2;
  border-color: var(--brand-border);
  box-shadow: none;
  cursor: not-allowed;
}

.pagination-info {
  color: var(--brand-muted);
  font-size: 14px;
  font-weight: 800;
}

@media (max-width: 576px) {
  .pagination {
    gap: 6px;
    flex-wrap: wrap;
  }

  .page-item .page-link {
    min-width: 38px;
    height: 38px;
    border-radius: 12px;
  }
}
</style>