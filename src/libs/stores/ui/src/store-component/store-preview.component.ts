import { Component, computed, input } from "@angular/core";
import { StorePreview } from "../../../data-access/lib/models/store.model";


@Component({
    selector:'app-store-preview-component',
    standalone:true,
    imports:[],
    templateUrl:'./store-preview.component.html'
})
export class StorePreviewComponent{
    storePreview = input.required<StorePreview>();
    percentageOfProducts  = computed(() => (this.storePreview().currentQuantityOfProducts / this.storePreview().totalProducts) * 100 );


}