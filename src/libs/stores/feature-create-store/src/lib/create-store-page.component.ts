import { Component } from "@angular/core";
import { CreateStoreFormComponent } from "../../../ui/src/storeCreateForm/create-store-form.component";


@Component({
  selector: 'app-create-store-page',
  imports: [CreateStoreFormComponent],
  templateUrl: './create-store-page.component.html',
})
export class CreateStorePage {}