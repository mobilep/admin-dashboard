import { TemplateRef } from '@angular/core';

export interface DataTableColumn {
  text: string;
  id?: string;
  className?: string;
  templateRef?: TemplateRef<any>;
  sortable?: boolean;
}
