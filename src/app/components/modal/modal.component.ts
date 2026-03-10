import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() title: string = 'Confirmação';
  @Input() message: string = 'Deseja realizar esta ação?';

  @Input() btnOkText: string = 'Confirmar';
  @Input() btnCancelText: string = 'Cancelar';
  @Input() btnCancelEnabled: boolean = true;

  @Output() onOk = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  handleOk() {
    this.onOk.emit();
  }

  handleCancel() {
    this.onCancel.emit();
  }
}