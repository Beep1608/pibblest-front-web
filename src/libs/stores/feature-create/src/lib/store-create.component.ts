// src/libs/stores/feature-create/src/lib/store-create.component.ts
import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreStore } from '../../../data-access/lib/store/store.store';
import { StoreFormComponent } from '../../../ui/src/lib/store-form/store-form.component';
import { CreateStoreDto } from '../../../data-access/lib/models/store.model';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardStore } from '../../../../../app/feature-dashboard/src/lib/data-access/store/dashboard.store';


@Component({
  selector: 'app-store-create-page',
  standalone: true,
  imports: [CommonModule, StoreFormComponent, TranslateModule],
  templateUrl: './store-create.component.html',
})
export class StoreCreateComponent {
  readonly store = inject(StoreStore);
  private dashboardStore = inject(DashboardStore);


  onCreateStore(dto: CreateStoreDto) {
    this.store.createStore(dto);
  }

  
}
