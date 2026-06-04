// src/libs/tags/feature-shell/src/lib/tags-shell.component.ts
import { Component, inject, input, OnInit } from '@angular/core';
import { TagContext, TagStore } from '../../../data-access/store/tag.store';
import { TagsListPageComponent } from '../../../feature-list/src/lib/tags-list-page.component';
import { TagsFormPageComponent } from '../../../feature-form/src/lib/tags-form-page.component';

@Component({
  selector: 'app-tags-shell',
  standalone: true,
  imports: [TagsListPageComponent, TagsFormPageComponent],
  templateUrl: './tags-shell.component.html'
})
export class TagsShellComponent implements OnInit {
  tagStore = inject(TagStore);
  context = input.required<TagContext>();

  ngOnInit() {
    // Al inicializar en ngOnInit, rompemos la dependencia implícita de Signals.
    // Esto asegura que setContext() solo se llame 1 vez al montar la vista,
    // evitando reseteos accidentales del buscador.
    const currentContext = this.context();
    if (currentContext) {
      this.tagStore.setContext(currentContext);
      this.tagStore.loadTags();
    }
  }
}
