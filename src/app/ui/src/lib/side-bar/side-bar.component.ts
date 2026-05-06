import { CommonModule } from "@angular/common";
import { Component, output, signal } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
    selector:'app-dashboard-side-bar',
    standalone: true,
    imports:[CommonModule, ReactiveFormsModule, TranslatePipe],
    templateUrl:'./side-bar.component.html'
})
export class DashboardSideBarComponent{
    
     selected = signal('dashboard');
     viewChange = output<string>();



    onClick(view: string){
        this.selected.set(view);

        this.viewChange.emit(view);
    }

}