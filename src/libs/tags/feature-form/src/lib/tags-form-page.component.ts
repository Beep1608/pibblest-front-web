// src/libs/tags/feature-form/src/lib/tags-form-page.component.ts
import { Component, effect, inject, OnInit } from '@angular/core';
import { TagStore } from '../../../../data-access/store/tag.store';
import { CreateTagRequest } from '../../../../data-access/models/tag.model';
import { TagFormComponent } from '../../../../ui/src/lib/tag-form/tag-form.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-tags-form-page',
  standalone: true,
  imports: [TagFormComponent, TranslatePipe],
  templateUrl: './tags-form-page.component.html'
})
export class TagsFormPageComponent implements OnInit {
  tagStore = inject(TagStore);

  constructor() {
    effect(() => {
      if (this.tagStore.isSuccess()) {
        setTimeout(() => this.goBack(), 1500);
      }
    });
  }

  ngOnInit() {
    this.tagStore.resetAlerts();
    if (this.tagStore.currentView() === 'edit' && !this.tagStore.selectedTag()) {
      this.goBack();
    }
  }

  onSave(payload: CreateTagRequest) {
    if (this.tagStore.currentView() === 'edit') {
      const id = this.tagStore.selectedTag()?.id;
      if (id) this.tagStore.updateTag({ id, request: payload });
    } else {
      this.tagStore.createTag(payload);
    }
  }

  goBack() {
    this.tagStore.setSelectedTag(null);
    this.tagStore.setView('list');
  }
}
