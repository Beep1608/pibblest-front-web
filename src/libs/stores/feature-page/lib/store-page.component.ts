import { DecimalPipe } from "@angular/common";
import { Component, computed, signal } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  variant: string;
  sugar: string;
  image: string;
}

@Component({
  selector: 'app-store-page',
  imports: [TranslatePipe, DecimalPipe
  ],
  templateUrl: './store-page.component.html',
})
export class StorePage {
  // ==========================================
  // ESTADO DE LA VISTA IZQUIERDA (MENÚ)
  // ==========================================
  activeTab = signal<number>(2);
  activeCategory = signal<string>('beverage');

  categories = signal([
    { id: 'all' },
    { id: 'appetizer' },
    { id: 'main' },
    { id: 'beverage' },
    { id: 'snack' },
    { id: 'dessert' },
  ]);

  products = signal<Product[]>([
    {
      id: 1,
      name: 'Es Buah',
      price: 26000,
      image: 'https://placehold.co/400x300/e2e8f0/64748b?text=Es+Buah',
    },
    {
      id: 2,
      name: 'Es Cincau',
      price: 20000,
      image: 'https://placehold.co/400x300/e2e8f0/64748b?text=Es+Cincau',
    },
    {
      id: 3,
      name: 'Es Cendol Ijo',
      price: 20000,
      image: 'https://placehold.co/400x300/e2e8f0/64748b?text=Cendol+Ijo',
    },
  ]);

  // ==========================================
  // ESTADO DE LA VISTA DERECHA (CARRITO)
  // ==========================================
  cart = signal<CartItem[]>([
    {
      id: 1,
      name: 'Es Cendol Ijo',
      price: 20000,
      quantity: 1,
      variant: 'Regular',
      sugar: 'Normal Sugar',
      image: 'https://placehold.co/100x100',
    },
  ]);

  customerName = signal('');
  orderType = signal('take_away');
  tableNumber = signal('');

  // Cálculos Automáticos
  subtotal = computed(() =>
    this.cart().reduce((acc, item) => acc + item.price * item.quantity, 0),
  );
  discount = computed(() => this.subtotal() * 0.1);
  taxes = computed(() => (this.subtotal() - this.discount()) * 0.02);
  total = computed(() => this.subtotal() - this.discount() + this.taxes());

  // ==========================================
  // MÉTODOS DE ACCIÓN
  // ==========================================

  // 2. AÑADIDO: Lógica inteligente para agregar al carrito
  addToCart(product: Product) {
    this.cart.update((currentItems) => {
      // Verificamos si el producto ya está en el carrito
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        // Si existe, solo aumentamos la cantidad
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        // Si no existe, lo agregamos como uno nuevo
        return [
          ...currentItems,
          {
            ...product,
            quantity: 1,
            variant: 'Regular', // Valores por defecto
            sugar: 'Normal Sugar',
          },
        ];
      }
    });
  }

  removeFromCart(index: number) {
    this.cart.update((items) => items.filter((_, i) => i !== index));
  }

  resetOrder() {
    this.cart.set([]);
    this.customerName.set('');
  }

  // 3. AÑADIDO: Método para cuando el componente OrderDetails emite "confirmPayment"
  handlePayment() {
    if (this.cart().length === 0) return;

    // Aquí llamarías a tu SignalStore o Servicio para guardar en base de datos
    console.log('Cobrando total de:', this.total());

    // Vaciamos el carrito después de cobrar
    this.resetOrder();
  }
}