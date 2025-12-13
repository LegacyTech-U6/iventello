<template>
  <div class="category-card">
    <div class="category-header" @click="$emit('view', category.id)">
      <div class="category-avatar">
        {{ category.name.charAt(0).toUpperCase() }}
      </div>
      <div class="category-info">
        <h3 class="category-name">{{ category.name }}</h3>
        <p class="category-company">{{ category.productCount }} Products</p>
      </div>
      <div class="category-actions">
        <button class="action-btn" @click.stop="$emit('edit', category)" title="Edit">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            ></path>
          </svg>
        </button>
        <button class="action-btn" @click.stop="$emit('delete', category.id)" title="Delete">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <div class="category-details">
      <div class="detail-item">
        <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16m-7 6h7"
          ></path>
        </svg>
        <span>{{ category.description }}</span>
      </div>
    </div>

    <div class="category-footer">
      <div class="footer-stat">
        <span class="footer-label">Total Products</span>
        <span class="footer-value">{{ category.productCount }}</span>
      </div>
      <div class="footer-stat">
        <span class="footer-label">Created</span>
        <span class="footer-value">{{ formatDate(category.createdAt) }}</span>
      </div>
    </div>

    <div class="category-meta">
      Last updated:
      {{ formatDate(category.productCount > 0 ? category.updatedAt : 'No updates yet') }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  category: {
    type: Object,
    required: true,
  },
})
defineEmits(['edit', 'delete', 'view'])

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>

<style scoped>
.category-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: box-shadow 0.2s ease;
}

.category-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.category-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.category-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.product-count {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.created-date {
  font-size: 0.75rem;
  color: #6b7280;
}

.category-description {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.category-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-danger {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-danger:hover {
  background: #fee2e2;
}
.category-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.category-card:hover {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}

.category-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.category-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 600;
  flex-shrink: 0;
}

.category-info {
  flex: 1;
  min-width: 0;
}

.category-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.01em;
}

.category-company {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.category-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 0;
}

.action-btn:hover {
  background: #f3f4f6;
}

.action-btn svg {
  width: 18px;
  height: 18px;
  color: #6b7280;
}

.action-btn:hover svg {
  color: #111827;
}

.category-details {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}
.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.5;
}

.detail-icon {
  width: 16px;
  height: 16px;
  color: #9ca3af;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.category-footer {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.footer-stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.footer-label {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.footer-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.category-meta {
  font-size: 0.8125rem;
  color: #9ca3af;
  padding-top: 0.75rem;
  border-top: 1px solid #f3f4f6;
}
</style>
