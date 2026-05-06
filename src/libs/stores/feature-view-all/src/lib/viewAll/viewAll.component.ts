import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";


@Component({
    selector:'app-store-view-all-page',
    imports:[CommonModule, TranslatePipe],
    templateUrl:'./viewAll.component.html',

})
export class StoreViewAllPage{
    
}