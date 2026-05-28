<template>
  <div id="app" class="food-app">
    <!-- Header -->
    <header class="hero">
      <div class="hero-content">
        <div>
          <p class="eyebrow">FOOD ORDER SYSTEM</p>
          <h1>美味餐飲訂購系統</h1>
          <p class="hero-desc">
            快速瀏覽餐點、加入我的最愛、查看類似品項、套用優惠券並完成購物車訂購。
          </p>
        </div>

        <div class="hero-card">
          <span>今日優惠</span>
          <strong>滿 300 折 50</strong>
          <small>使用優惠券：SAVE50</small>
        </div>
      </div>
    </header>

    <main class="page-wrap">
      <!-- Coupon Section -->
      <section class="coupon-section">
        <div class="section-title">
          <h2>優惠券介紹</h2>
          <p>選擇優惠券後，可在購物車中套用折扣。</p>
        </div>

        <div class="coupon-grid">
          <div
            v-for="coupon in coupons"
            :key="coupon.code"
            class="coupon-card"
            :class="{ active: selectedCouponCode === coupon.code }"
            @click="selectCoupon(coupon.code)"
          >
            <div>
              <h3>{{ coupon.title }}</h3>
              <p>{{ coupon.description }}</p>
            </div>
            <span>{{ coupon.code }}</span>
          </div>
        </div>
      </section>

      <div class="content-layout">
        <!-- Products -->
        <section class="product-section">
          <div class="section-title">
            <h2>熱門餐點</h2>
            <p>點選餐點可查看類似品項推薦。</p>
          </div>

          <div class="category-tabs">
            <button
              v-for="category in categories"
              :key="category"
              :class="{ active: selectedCategory === category }"
              @click="selectedCategory = category"
            >
              {{ category }}
            </button>
          </div>

          <div class="product-grid">
            <article
              v-for="item in filteredFoods"
              :key="item.id"
              class="product-card"
              :class="{ selected: selectedFood && selectedFood.id === item.id }"
              @click="selectFood(item)"
            >
              <button
                class="favorite-btn"
                :class="{ liked: isFavorite(item.id) }"
                @click.stop="toggleFavorite(item)"
                title="加入我的最愛"
              >
                {{ isFavorite(item.id) ? '♥' : '♡' }}
              </button>

              <div class="food-img">{{ item.icon }}</div>

              <div class="product-info">
                <span class="tag">{{ item.category }}</span>
                <h3>{{ item.name }}</h3>
                <p>{{ item.desc }}</p>

                <div class="product-bottom">
                  <strong>NT$ {{ item.price }}</strong>
                  <button @click.stop="addToCart(item)">加入購物車</button>
                </div>
              </div>
            </article>
          </div>

          <!-- Similar Items -->
          <section class="similar-section" v-if="selectedFood">
            <div class="section-title small">
              <h2>類似品項推薦</h2>
              <p>與「{{ selectedFood.name }}」同類型的餐點。</p>
            </div>

            <div class="similar-list">
              <div
                v-for="item in similarFoods"
                :key="item.id"
                class="similar-card"
              >
                <div class="similar-icon">{{ item.icon }}</div>
                <div>
                  <h4>{{ item.name }}</h4>
                  <p>NT$ {{ item.price }}</p>
                </div>
                <button @click="addToCart(item)">加入</button>
              </div>
            </div>
          </section>

          <!-- Favorite Items -->
          <section class="favorite-section">
            <div class="section-title small">
              <h2>我的最愛</h2>
              <p>你收藏的餐點會顯示在這裡。</p>
            </div>

            <div v-if="favoriteFoods.length === 0" class="empty-box">
              尚未加入任何我的最愛。
            </div>

            <div v-else class="favorite-list">
              <div
                v-for="item in favoriteFoods"
                :key="item.id"
                class="favorite-item"
              >
                <span>{{ item.icon }}</span>
                <div>
                  <strong>{{ item.name }}</strong>
                  <p>NT$ {{ item.price }}</p>
                </div>
                <button @click="addToCart(item)">加入購物車</button>
              </div>
            </div>
          </section>
        </section>

        <!-- Cart -->
        <aside class="cart-panel">
          <div class="cart-header">
            <h2>購物車</h2>
            <span>{{ cartTotalQty }} 件</span>
          </div>

          <div v-if="cart.length === 0" class="empty-cart">
            <div>🛒</div>
            <p>購物車目前是空的</p>
          </div>

          <div v-else class="cart-list">
            <div
              v-for="item in cart"
              :key="item.id"
              class="cart-item"
            >
              <div class="cart-food-icon">{{ item.icon }}</div>

              <div class="cart-info">
                <h4>{{ item.name }}</h4>
                <p>NT$ {{ item.price }}</p>

                <div class="qty-control">
                  <button @click="decreaseQty(item.id)">−</button>
                  <span>{{ item.qty }}</span>
                  <button @click="increaseQty(item.id)">＋</button>
                </div>
              </div>

              <button class="remove-btn" @click="removeFromCart(item.id)">
                ×
              </button>
            </div>
          </div>

          <div class="coupon-apply">
            <label>目前優惠券</label>
            <select v-model="selectedCouponCode">
              <option value="">不使用優惠券</option>
              <option
                v-for="coupon in coupons"
                :key="coupon.code"
                :value="coupon.code"
              >
                {{ coupon.title }} - {{ coupon.code }}
              </option>
            </select>
          </div>

          <div class="price-summary">
            <div>
              <span>小計</span>
              <strong>NT$ {{ subtotal }}</strong>
            </div>

            <div>
              <span>折扣</span>
              <strong class="discount">- NT$ {{ discount }}</strong>
            </div>

            <div class="total">
              <span>總金額</span>
              <strong>NT$ {{ total }}</strong>
            </div>
          </div>

          <button
            class="checkout-btn"
            :disabled="cart.length === 0"
            @click="checkout"
          >
            送出訂單
          </button>
        </aside>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',

  data() {
    return {
      selectedCategory: '全部',
      selectedFood: null,
      selectedCouponCode: '',
      favoriteIds: [],
      cart: [],

      foods: [
        {
          id: 1,
          name: '香煎雞腿飯',
          category: '飯類',
          price: 120,
          icon: '🍱',
          desc: '外皮香酥、肉質鮮嫩，搭配時蔬與白飯。'
        },
        {
          id: 2,
          name: '打拋豬肉飯',
          category: '飯類',
          price: 110,
          icon: '🍛',
          desc: '微辣開胃，九層塔香氣濃郁。'
        },
        {
          id: 3,
          name: '日式咖哩飯',
          category: '飯類',
          price: 105,
          icon: '🍛',
          desc: '濃郁咖哩醬，適合大人小孩。'
        },
        {
          id: 4,
          name: '牛肉湯麵',
          category: '麵類',
          price: 135,
          icon: '🍜',
          desc: '湯頭濃厚，牛肉軟嫩入味。'
        },
        {
          id: 5,
          name: '麻醬乾麵',
          category: '麵類',
          price: 75,
          icon: '🍝',
          desc: '芝麻香氣十足，簡單卻美味。'
        },
        {
          id: 6,
          name: '鮮蝦炒麵',
          category: '麵類',
          price: 130,
          icon: '🍤',
          desc: '鮮蝦搭配蔬菜快炒，香氣十足。'
        },
        {
          id: 7,
          name: '珍珠奶茶',
          category: '飲品',
          price: 55,
          icon: '🧋',
          desc: '濃郁奶香與 Q 彈珍珠。'
        },
        {
          id: 8,
          name: '檸檬紅茶',
          category: '飲品',
          price: 45,
          icon: '🍋',
          desc: '酸甜清爽，解膩首選。'
        },
        {
          id: 9,
          name: '芒果冰沙',
          category: '飲品',
          price: 80,
          icon: '🥭',
          desc: '香甜芒果搭配冰沙口感。'
        },
        {
          id: 10,
          name: '炸雞拼盤',
          category: '點心',
          price: 160,
          icon: '🍗',
          desc: '多人分享首選，酥脆多汁。'
        },
        {
          id: 11,
          name: '薯條',
          category: '點心',
          price: 60,
          icon: '🍟',
          desc: '金黃酥脆，搭配番茄醬最對味。'
        },
        {
          id: 12,
          name: '布朗尼蛋糕',
          category: '甜點',
          price: 90,
          icon: '🍰',
          desc: '濃郁巧克力香氣，甜點控必點。'
        }
      ],

      coupons: [
        {
          code: 'SAVE50',
          title: '滿 300 折 50',
          description: '訂單金額滿 NT$300，可折抵 NT$50。',
          type: 'fixed',
          min: 300,
          value: 50
        },
        {
          code: 'FOOD90',
          title: '全館 9 折',
          description: '所有餐點享 9 折優惠。',
          type: 'percent',
          min: 0,
          value: 0.9
        },
        {
          code: 'DRINK20',
          title: '飲品折 20',
          description: '訂單滿 NT$150，可折抵 NT$20。',
          type: 'fixed',
          min: 150,
          value: 20
        }
      ]
    }
  },

  computed: {
    categories() {
      return ['全部', ...new Set(this.foods.map(item => item.category))]
    },

    filteredFoods() {
      if (this.selectedCategory === '全部') {
        return this.foods
      }

      return this.foods.filter(item => item.category === this.selectedCategory)
    },

    favoriteFoods() {
      return this.foods.filter(item => this.favoriteIds.includes(item.id))
    },

    similarFoods() {
      if (!this.selectedFood) {
        return []
      }

      return this.foods
        .filter(item => {
          return item.category === this.selectedFood.category &&
                 item.id !== this.selectedFood.id
        })
        .slice(0, 4)
    },

    subtotal() {
      return this.cart.reduce((sum, item) => {
        return sum + item.price * item.qty
      }, 0)
    },

    selectedCoupon() {
      return this.coupons.find(item => item.code === this.selectedCouponCode)
    },

    discount() {
      if (!this.selectedCoupon) {
        return 0
      }

      if (this.subtotal < this.selectedCoupon.min) {
        return 0
      }

      if (this.selectedCoupon.type === 'fixed') {
        return this.selectedCoupon.value
      }

      if (this.selectedCoupon.type === 'percent') {
        return Math.round(this.subtotal * (1 - this.selectedCoupon.value))
      }

      return 0
    },

    total() {
      return Math.max(this.subtotal - this.discount, 0)
    },

    cartTotalQty() {
      return this.cart.reduce((sum, item) => sum + item.qty, 0)
    }
  },

  methods: {
    selectFood(item) {
      this.selectedFood = item
    },

    selectCoupon(code) {
      this.selectedCouponCode = code
    },

    isFavorite(id) {
      return this.favoriteIds.includes(id)
    },

    toggleFavorite(item) {
      if (this.isFavorite(item.id)) {
        this.favoriteIds = this.favoriteIds.filter(id => id !== item.id)
      } else {
        this.favoriteIds.push(item.id)
      }
    },

    addToCart(item) {
      const exists = this.cart.find(cartItem => cartItem.id === item.id)

      if (exists) {
        exists.qty += 1
      } else {
        this.cart.push({
          ...item,
          qty: 1
        })
      }
    },

    increaseQty(id) {
      const item = this.cart.find(cartItem => cartItem.id === id)

      if (item) {
        item.qty += 1
      }
    },

    decreaseQty(id) {
      const item = this.cart.find(cartItem => cartItem.id === id)

      if (!item) {
        return
      }

      if (item.qty <= 1) {
        this.removeFromCart(id)
      } else {
        item.qty -= 1
      }
    },

    removeFromCart(id) {
      this.cart = this.cart.filter(item => item.id !== id)
    },

    checkout() {
      alert(`訂單已送出！總金額：NT$ ${this.total}`)
      this.cart = []
      this.selectedCouponCode = ''
    }
  },

  mounted() {
    this.selectedFood = this.foods[0]
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #f8fafc;
  color: #1f2937;
  font-family: "Microsoft JhengHei", "Noto Sans TC", Arial, sans-serif;
}

.food-app {
  min-height: 100vh;
}

.hero {
  padding: 48px 24px;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.35), transparent 30%),
    linear-gradient(135deg, #fb923c, #ef4444);
  color: #fff;
}

.hero-content {
  max-width: 1180px;
  margin: 0 auto;
  display: flex;
  gap: 24px;
  justify-content: space-between;
  align-items: center;
}

.eyebrow {
  margin: 0 0 8px;
  letter-spacing: 2px;
  font-size: 13px;
  opacity: 0.9;
}

.hero h1 {
  margin: 0;
  font-size: 42px;
  font-weight: 900;
}

.hero-desc {
  max-width: 620px;
  margin: 14px 0 0;
  line-height: 1.8;
  font-size: 17px;
  opacity: 0.95;
}

.hero-card {
  min-width: 240px;
  padding: 24px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(10px);
  box-shadow: 0 18px 40px rgba(127, 29, 29, 0.22);
}

.hero-card span,
.hero-card small {
  display: block;
  opacity: 0.92;
}

.hero-card strong {
  display: block;
  margin: 10px 0;
  font-size: 28px;
}

.page-wrap {
  max-width: 1180px;
  margin: -28px auto 60px;
  padding: 0 20px;
}

.coupon-section,
.product-section,
.cart-panel {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
}

.coupon-section {
  padding: 24px;
  margin-bottom: 24px;
}

.section-title {
  margin-bottom: 18px;
}

.section-title h2 {
  margin: 0 0 6px;
  font-size: 24px;
  color: #111827;
}

.section-title p {
  margin: 0;
  color: #64748b;
}

.section-title.small {
  margin-top: 32px;
}

.coupon-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.coupon-card {
  cursor: pointer;
  padding: 18px;
  border-radius: 18px;
  border: 2px solid #fee2e2;
  background: #fff7ed;
  display: flex;
  justify-content: space-between;
  gap: 14px;
  transition: 0.25s;
}

.coupon-card:hover,
.coupon-card.active {
  border-color: #fb923c;
  transform: translateY(-3px);
  box-shadow: 0 12px 24px rgba(251, 146, 60, 0.18);
}

.coupon-card h3 {
  margin: 0 0 8px;
  color: #9a3412;
}

.coupon-card p {
  margin: 0;
  color: #7c2d12;
  line-height: 1.6;
  font-size: 14px;
}

.coupon-card span {
  align-self: flex-start;
  white-space: nowrap;
  padding: 6px 10px;
  border-radius: 999px;
  background: #ffedd5;
  color: #c2410c;
  font-weight: 800;
}

.content-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 24px;
  align-items: start;
}

.product-section {
  padding: 24px;
}

.category-tabs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 22px;
}

.category-tabs button {
  border: 0;
  padding: 10px 18px;
  border-radius: 999px;
  background: #f1f5f9;
  color: #475569;
  font-weight: 700;
  cursor: pointer;
}

.category-tabs button.active {
  background: #fb923c;
  color: #fff;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.product-card {
  position: relative;
  cursor: pointer;
  padding: 18px;
  border-radius: 22px;
  border: 2px solid #f1f5f9;
  background: #fff;
  transition: 0.25s;
}

.product-card:hover,
.product-card.selected {
  border-color: #fdba74;
  transform: translateY(-3px);
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.08);
}

.favorite-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 0;
  background: #fff1f2;
  color: #fb7185;
  font-size: 23px;
  cursor: pointer;
}

.favorite-btn.liked {
  background: #fb7185;
  color: #fff;
}

.food-img {
  width: 74px;
  height: 74px;
  display: grid;
  place-items: center;
  border-radius: 22px;
  background: #fff7ed;
  font-size: 42px;
  margin-bottom: 14px;
}

.product-info .tag {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 999px;
  background: #fef3c7;
  color: #92400e;
  font-size: 13px;
  font-weight: 700;
}

.product-info h3 {
  margin: 12px 0 8px;
  font-size: 20px;
}

.product-info p {
  margin: 0;
  color: #64748b;
  line-height: 1.6;
  min-height: 48px;
}

.product-bottom {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-bottom strong {
  color: #ef4444;
  font-size: 19px;
}

.product-bottom button,
.similar-card button,
.favorite-item button {
  border: 0;
  border-radius: 12px;
  background: #ef4444;
  color: #fff;
  padding: 9px 14px;
  font-weight: 800;
  cursor: pointer;
}

.similar-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.similar-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 18px;
  background: #f8fafc;
}

.similar-icon {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: #fff7ed;
  font-size: 25px;
}

.similar-card h4 {
  margin: 0 0 4px;
}

.similar-card p {
  margin: 0;
  color: #ef4444;
  font-weight: 800;
}

.similar-card button {
  margin-left: auto;
  background: #fb923c;
}

.empty-box,
.empty-cart {
  padding: 24px;
  border-radius: 18px;
  background: #f8fafc;
  color: #64748b;
  text-align: center;
}

.favorite-list {
  display: grid;
  gap: 12px;
}

.favorite-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 18px;
  background: #fff7ed;
}

.favorite-item span {
  font-size: 30px;
}

.favorite-item p {
  margin: 4px 0 0;
  color: #ef4444;
  font-weight: 800;
}

.favorite-item button {
  margin-left: auto;
}

.cart-panel {
  position: sticky;
  top: 20px;
  padding: 22px;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-header h2 {
  margin: 0;
}

.cart-header span {
  padding: 6px 12px;
  border-radius: 999px;
  background: #fee2e2;
  color: #b91c1c;
  font-weight: 800;
}

.empty-cart {
  margin-top: 18px;
}

.empty-cart div {
  font-size: 42px;
}

.cart-list {
  margin-top: 18px;
  display: grid;
  gap: 14px;
  max-height: 360px;
  overflow-y: auto;
  padding-right: 4px;
}

.cart-item {
  position: relative;
  display: flex;
  gap: 12px;
  padding: 14px;
  border-radius: 18px;
  background: #f8fafc;
}

.cart-food-icon {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: #fff7ed;
  font-size: 26px;
}

.cart-info h4 {
  margin: 0 0 4px;
}

.cart-info p {
  margin: 0 0 10px;
  color: #ef4444;
  font-weight: 800;
}

.qty-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty-control button {
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 9px;
  background: #e2e8f0;
  cursor: pointer;
  font-weight: 900;
}

.qty-control span {
  min-width: 20px;
  text-align: center;
  font-weight: 800;
}

.remove-btn {
  position: absolute;
  top: 8px;
  right: 10px;
  border: 0;
  background: transparent;
  color: #94a3b8;
  font-size: 24px;
  cursor: pointer;
}

.coupon-apply {
  margin-top: 18px;
}

.coupon-apply label {
  display: block;
  margin-bottom: 8px;
  font-weight: 800;
}

.coupon-apply select {
  width: 100%;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid #cbd5e1;
  outline: none;
}

.price-summary {
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid #e2e8f0;
  display: grid;
  gap: 12px;
}

.price-summary div {
  display: flex;
  justify-content: space-between;
}

.price-summary .discount {
  color: #16a34a;
}

.price-summary .total {
  padding-top: 12px;
  border-top: 1px dashed #cbd5e1;
  font-size: 20px;
}

.price-summary .total strong {
  color: #ef4444;
}

.checkout-btn {
  width: 100%;
  margin-top: 20px;
  border: 0;
  padding: 15px;
  border-radius: 16px;
  background: linear-gradient(135deg, #fb923c, #ef4444);
  color: #fff;
  font-size: 17px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(239, 68, 68, 0.25);
}

.checkout-btn:disabled {
  cursor: not-allowed;
  background: #cbd5e1;
  box-shadow: none;
}

@media (max-width: 980px) {
  .hero-content {
    flex-direction: column;
    align-items: stretch;
  }

  .content-layout {
    grid-template-columns: 1fr;
  }

  .cart-panel {
    position: static;
  }
}

@media (max-width: 720px) {
  .hero {
    padding: 36px 18px;
  }

  .hero h1 {
    font-size: 32px;
  }

  .page-wrap {
    padding: 0 14px;
  }

  .coupon-grid,
  .product-grid,
  .similar-list {
    grid-template-columns: 1fr;
  }

  .coupon-card {
    flex-direction: column;
  }

  .product-bottom,
  .favorite-item,
  .similar-card {
    align-items: flex-start;
  }

  .favorite-item,
  .similar-card {
    flex-wrap: wrap;
  }

  .favorite-item button,
  .similar-card button {
    margin-left: 0;
  }
}
</style>