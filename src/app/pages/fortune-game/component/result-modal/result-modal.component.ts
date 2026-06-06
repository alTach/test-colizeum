import { Component, input, output, ViewChild, ElementRef } from '@angular/core';
import { PrizeFE } from '@core/models/prize.model';

/**
 * Компонент модального окна с результатом спина на основе тега <dialog>.
 */
@Component({
  selector: 'cl-result-modal',
  imports: [],
  templateUrl: './result-modal.component.html',
  styleUrl: './result-modal.component.scss',
})
export class ResultModalComponent {
  readonly prize = input<PrizeFE | null>(null);
  readonly closeDialog = output<void>();

  @ViewChild('dialog') dialogEl!: ElementRef<HTMLDialogElement>;

  /**
   * Открыть модальное окно
   */
  open(): void {
    if (this.dialogEl) {
      this.dialogEl.nativeElement.showModal();
    }
  }

  /**
   * Закрыть модальное окно
   */
  close(): void {
    if (this.dialogEl) {
      this.dialogEl.nativeElement.close();
      this.closeDialog.emit();
    }
  }

  /**
   * Обработать клик по подложке (overlay) для закрытия
   */
  onDialogClick(event: MouseEvent): void {
    if (event.target === this.dialogEl.nativeElement) {
      this.close();
    }
  }
}
