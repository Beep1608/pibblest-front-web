import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { DashboardStore } from '../../../../../app/feature-dashboard/src/lib/data-access/store/dashboard.store';
import { Product } from '../../../../products/data-access/lib/models/product.model';
import { ProductStore } from '../../../../products/data-access/lib/store/product.store';
import { Tag } from '../../../../tags/data-access/models/tag.model';
import { TagStore } from '../../../../tags/data-access/store/tag.store';
import { StoreStore } from '../../../data-access';
import { CheckoutComponent } from '../lib/checkout-component/checkout.component';
import { SaleStore } from '../../../../sales/data-access';



@Component({
	selector: 'app-store-invetory-component',
	imports: [TranslatePipe, DecimalPipe, CheckoutComponent],
	templateUrl: './store-inventory.component.html',
})
export class StoreInventoryComponent {
	store = inject(StoreStore);
	tagStore = inject(TagStore);
	productStore = inject(ProductStore);
	dashboardStore = inject(DashboardStore);
	sale = inject(SaleStore);
	activeCategories = signal<number[]>([]);
	tagsTest = signal<Tag[]>([
		{
			name: 'uno',
			id: 1,
		},
		{
			name: 'dos',
			id: 2,
		},
		{
			name: 'tres',
			id: 3,
		},
		{
			name: 'cuatro',
			id: 4,
		},
		{
			name: 'cinco',
			id: 5,
		},
		{
			name: 'seis',
			id: 6,
		},
		{
			name: 'siete',
			id: 7,
		},
		{
			name: 'ocho',
			id: 8,
		},
		{
			name: 'nueve',
			id: 9,
		},
		{
			name: 'diex',
			id: 10,
		},
	]);

	filteredProducts = computed(() => {
		const allProducts = this.productStore.productsPage()?.products || [];

		const selectedTags = this.activeCategories();

		if (selectedTags.length === 0) {
			return allProducts;
		}

		return allProducts.filter(product => {
			return product.tags.some((tag: Tag) => selectedTags.includes(tag.id));
		});
	});

	ngOnInit() {
		this.tagStore.getAllTagsForProducts('');

		this.productStore.getAllProducts(null);
	}

	onTagToggle(tagId: number, isChecked: boolean) {
		if (isChecked) {
			this.activeCategories.update(tags => [...tags, tagId]);
		} else {
			this.activeCategories.update(tags => tags.filter(id => id !== tagId));
		}
		// Opcional: Llamar al store de productos aquí
	}

	selectAll() {
		// Vaciamos el arreglo. Como no hay filtros específicos, equivale a "Todos"
		this.activeCategories.set([]);
		// Opcional: Llamar al store de productos aquí para traer todos
	}

	onSearch(keyword: string) {
		if (keyword?.trim()) {
			this.productStore.getAllProducts(keyword);
		}
	}

	// 2. AÑADIDO: Lógica inteligente para agregar al carrito
	// addToCart(product: Product) {
	//   this.cart.update((currentItems) => {
	//     // Verificamos si el producto ya está en el carrito
	//     const existingItem = currentItems.find((item) => item.id === product.id);
	//
	//     if (existingItem) {
	//       // Si existe, solo aumentamos la cantidad
	//       return currentItems.map((item) =>
	//         item.id === product.id
	//           ? { ...item, quantity: item.quantity + 1 }
	//           : item,
	//       );
	//     } else {
	//       // Si no existe, lo agregamos como uno nuevo
	//       return [
	//         ...currentItems,
	//         {
	//           ...product,
	//         },
	//       ];
	//     }
	//   });
}
