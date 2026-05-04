import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { OwnerFormComponent } from "../../../../ui/src";
import { OwnerStore, RegisterOwnerDto } from "../../../../data-access/src";



@Component({
    selector:'app-owners-registration-page',
    standalone:true,
    imports:[CommonModule,OwnerFormComponent],
    templateUrl:'./registration-component.html'
})
export class RegistationPageComponent{

    readonly store = inject(OwnerStore)

    onRegister(formData: RegisterOwnerDto){
        this.store.registerOwner(formData);
    }
}