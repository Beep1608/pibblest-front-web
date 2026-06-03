// src/libs/tags/ui/src/lib/tag-table/tag-table.component.ts
import { Component, ElementRef, inject, input, viewChild } from "@angular/core";
import { Tag } from "../../../../data-access/models/tag.model";
import { TagStore } from "../../../../data-access/store/tag.store";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: 'app-tag-table',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './tag-table.component.html'
})
export class TagTableComponent {
  tags = input.required<Tag[]>();
  
  tagStore = inject(TagStore);
  deleteModal = viewChild<ElementRef<HTMLDialogElement>>('deleteModal');
  selectedTag: Tag | null = null;

  goToEdit(tag: Tag) {
    this.tagStore.setSelectedTag(tag);
    this.tagStore.setView('edit');
  }

  openDeleteModal(tag: Tag) {
    this.selectedTag = tag;
    this.deleteModal()?.nativeElement.showModal();
  }

  closeDeleteModal() {
    this.selectedTag = null;
    this.deleteModal()?.nativeElement.close();
  }

  confirmDelete() {
    if (this.selectedTag) {
      this.tagStore.deleteTag(this.selectedTag.id);
    }
    this.closeDeleteModal();
  }
}
