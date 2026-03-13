import { Component, Input, OnDestroy } from '@angular/core';
import { NgStyle } from '@angular/common';

export type AlertType = 'success' | 'danger' | 'warning' | 'info';
export type AlertVertical = 'top' | 'center' | 'bottom';
export type AlertHorizontal = 'start' | 'center' | 'end';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent implements OnDestroy {
  @Input() message: string = '';
  @Input() type: AlertType = 'success';
  @Input() duration: number = 3000;
  @Input() autoDismiss: boolean = true;
  @Input() vertical: AlertVertical = 'center';
  @Input() horizontal: AlertHorizontal = 'center';

  visible: boolean = false;
  private timer: any;

  get wrapperStyle() {
    const v: Record<AlertVertical, object> = {
      top:    { top: '0', transform: this.horizontal === 'center' ? 'translateX(-50%)' : 'none' },
      center: { top: '50%', transform: this.horizontal === 'center' ? 'translate(-50%, -50%)' : 'translateY(-50%)' },
      bottom: { bottom: '0', transform: this.horizontal === 'center' ? 'translateX(-50%)' : 'none' }
    };
    const h: Record<AlertHorizontal, object> = {
      start:  { left: '0' },
      center: { left: '50%' },
      end:    { right: '0' }
    };
    return { ...v[this.vertical], ...h[this.horizontal] };
  }

  show(): void {
    this.visible = true;
    if(this.autoDismiss){
      this.timer = setTimeout(() => this.dismiss(), this.duration);
    }
  }

  dismiss(): void {
    this.visible = false;
    clearTimeout(this.timer);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }
}