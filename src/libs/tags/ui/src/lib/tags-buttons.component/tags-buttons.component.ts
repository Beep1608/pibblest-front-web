import { Component, computed, inject, output, signal } from "@angular/core";
import { ProductStore } from "../../../../../products/data-access/lib/store/product.store";
import { Tag } from "../../../../data-access/models/tag.model";
import { TagStore } from "../../../../data-access/store/tag.store";
import { TranslatePipe } from "@ngx-translate/core";


@Component({
	selector: 'app-tags-buttons-component',
	imports: [TranslatePipe],
	templateUrl: './tags-buttons.component.html',
})
export class TagButtonsComponent {
	// 1. Inyectamos solo el TagStore para pintar los botones
	tagStore = inject(TagStore);

	// 2. Estado local del componente
	activeCategories = signal<number[]>([]);

	// 3. ✨ EL SECRETO: Un Output para avisarle a quien sea que use este componente
	selectionChange = output<number[]>();

	onTagToggle(tagId: number, isChecked: boolean) {
		if (isChecked) {
			this.activeCategories.update(tags => [...tags, tagId]);
		} else {
			this.activeCategories.update(tags => tags.filter(id => id !== tagId));
		}

		// Avisamos al padre que la lista de IDs cambió
		this.selectionChange.emit(this.activeCategories());
	}

	selectAll() {
		this.activeCategories.set([]);
		// Avisamos al padre que se limpió la selección
		this.selectionChange.emit(this.activeCategories());
	}
}