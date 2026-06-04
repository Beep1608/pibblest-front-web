// src/libs/tags/feature-list/src/lib/tags-list-page.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { TagStore } from '../../../data-access/store/tag.store';
import { TagTableComponent } from '../../../ui/src/lib/tag-table/tag-table.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-tags-list-page',
  standalone: true,
  imports: [TagTableComponent, TranslatePipe],
  templateUrl: './tags-list-page.component.html'
})
export class TagsListPageComponent implements OnInit {
  tagStore = inject(TagStore);

  ngOnInit() {
    this.tagStore.resetAlerts();
  }

  onSearch(keyword: string) {
    // ✨ ÚNICA LÍNEA: El store se encarga del debounce, de filtrar duplicados y de la petición HTTP.
    this.tagStore.searchTags(keyword);
  }

  changePage(delta: number) {
    this.tagStore.changePage(delta);
  }

  navigateToCreate() {
    this.tagStore.setSelectedTag(null);
    this.tagStore.setView('create');
  }
}
