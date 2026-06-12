// src/libs/cart/data-access/lib/store/cart.store.ts
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Product } from '../../../../products/data-access/lib/models/product.model';
import { CartItem } from '../models/cart.model';
import { computed } from '@angular/core';

interface CartState {
	error: string | null;
	isSuccess: boolean;
	token: string | null;
	message: string | null;
	cart: CartItem[];
}

const initialState: CartState = {
	error: null,
	isSuccess: false,
	token: null,
	message: null,
	cart: [],
};

export const CartStore = signalStore(
	{ providedIn: 'root' },
	withState(initialState),
    withComputed(cart =>({
        totalPrice: computed(() => {
			return cart.cart().reduce((total, item) => total + item.product.basePrice * item.quantity, 0);
		}),

		totalItems: computed(() => {
			return cart.cart().reduce((total, item) => total + item.quantity, 0);
		}),
    })),
	withMethods(cart => ({
		addToCart(product: Product) {
			patchState(cart, state => {
				if (product.currentQuantity <= 0) {
					return {
						cart: [...state.cart],
					};
				}

				const alreadyExists = state.cart.find(item => item.product.id === product.id);
				if (alreadyExists) {
					return {
						cart: state.cart.map(item => {
							if (item.quantity < product.currentQuantity && item.product.id === product.id) {
								return { ...item, quantity: item.quantity + 1 };
							}
							return item;
						}),
					};
				} else {
					return {
						cart: [...state.cart, { product: product, quantity: 1 }],
					};
				}
			});
		},

		removeFromCart(product: Product) {
			patchState(cart, state => ({
				cart: state.cart.filter(item => item.product.id !== product.id),
			}));
		},

        // ✨ NUEVO: Elimina el producto del carrito usando solo el ID
        removeFromCartById(productId: number) {
            patchState(cart, state => ({
                cart: state.cart.filter(item => item.product.id !== productId),
            }));
        },

		decreaseQuantity(product: Product) {
			patchState(cart, state => {
				return {
					cart: state.cart
						.map(item => (item.product.id === product.id ? { ...item, quantity: item.quantity - 1 } : item))
						.filter(item => item.quantity > 0),
				};
			});
		},

		clearCart: () => {
			patchState(cart, {
				cart: [],
			});
		},

	})),
);
