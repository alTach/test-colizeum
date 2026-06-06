import { Component, input, ViewChild, ElementRef, inject, NgZone, computed, AfterViewInit } from '@angular/core';
import { PrizeFE } from '@core/models/prize.model';
import { SectorUi } from '@core/models/sector-ui.model';
import { mapPrizeToSectorUi } from '@core/utils/fortune-math.utils';
import { Observable, Subject } from 'rxjs';
import { FORTUNE_BUSINESS_RULES, FORTUNE_TECHNICAL_CONFIG } from '@core/constants/fortune.config';

/**
 * Компонент SVG-колеса. Отрисовывает сектора, подписи и анимирует вращение.
 */
@Component({
  selector: 'cl-wheel',
  templateUrl: './wheel.component.html',
  styleUrl: './wheel.component.scss',
})
export class WheelComponent implements AfterViewInit {
  readonly prizes = input.required<PrizeFE[]>();

  @ViewChild('wheelGroup') wheelGroupEl!: ElementRef<SVGGElement>;
  @ViewChild('iconGroup') iconGroupEl!: ElementRef<SVGGElement>;
  @ViewChild('logoGroup') logoGroupEl!: ElementRef<SVGGElement>;

  private readonly ngZone = inject(NgZone);
  private currentAngle = 0;

  // Рассчитать позиции точек на центральном хабе
  protected readonly hubDots = computed(() => {
    const dots = [];
    const IR = FORTUNE_TECHNICAL_CONFIG.wheel.ir; // 34
    const radius = IR - 10; // 24
    const CX = FORTUNE_TECHNICAL_CONFIG.wheel.cx; // 195
    const CY = FORTUNE_TECHNICAL_CONFIG.wheel.cy; // 195
    for (let d = 0; d < 8; d++) {
      const da = -Math.PI / 2 + (d * Math.PI) / 4;
      dots.push({
        cx: CX + radius * Math.cos(da),
        cy: CY + radius * Math.sin(da),
      });
    }
    return dots;
  });

  // Рассчитать геометрию секторов и трансформации текстов реактивно с использованием хелпера
  readonly sectors = computed<SectorUi[]>(() => {
    const list = this.prizes();
    const N = list.length;
    if (N === 0) return [];
    return list.map((prize, i) => mapPrizeToSectorUi(prize, i, N));
  });

  ngAfterViewInit(): void {
    // Выставить начальный угол вращения колеса при инициализации (0, так как выравнивание секторов заложено в SVG)
    this.currentAngle = 0;
    this.applyRotation(this.currentAngle);
  }

  /**
   * Применить вращение к элементам SVG напрямую (60fps) без циклов change detection
   */
  private applyRotation(angle: number): void {
    const deg = (angle * 180) / Math.PI;
    const CX = FORTUNE_TECHNICAL_CONFIG.wheel.cx;
    const CY = FORTUNE_TECHNICAL_CONFIG.wheel.cy;

    if (this.wheelGroupEl) {
      this.wheelGroupEl.nativeElement.setAttribute('transform', `rotate(${deg}, ${CX}, ${CY})`);
    }

    if (this.logoGroupEl) {
      this.logoGroupEl.nativeElement.setAttribute('transform', `rotate(${-deg * 2}, ${CX}, ${CY})`);
    }

    const prizesList = this.prizes();
    if (this.iconGroupEl && prizesList.length > 0) {
      const iconNodes = this.iconGroupEl.nativeElement.children;
      const N = prizesList.length;
      const ARC = (2 * Math.PI) / N;
      const R = FORTUNE_TECHNICAL_CONFIG.wheel.r;
      const iconR = R * 0.52;

      for (let i = 0; i < iconNodes.length; i++) {
        // Вычисляем угол середины сектора с учетом текущего угла вращения колеса
        const mid = -Math.PI / 2 + i * ARC + ARC / 2;
        const nx = CX + iconR * Math.cos(mid + angle);
        const ny = CY + iconR * Math.sin(mid + angle);
        iconNodes[i].setAttribute('transform', `translate(${nx}, ${ny})`);
      }
    }
  }

  /**
   * Запустить плавное вращение к целевому углу
   */
  spin(
    targetAngle: number,
    duration: number = FORTUNE_BUSINESS_RULES.spinDuration,
  ): Observable<void> {
    const subject = new Subject<void>();
    const startAngle = this.currentAngle;
    const startT = performance.now();

    const easeOutQuartic = (t: number): number => 1 - Math.pow(1 - t, 4);

    this.ngZone.runOutsideAngular(() => {
      const frame = (now: number) => {
        const elapsed = now - startT;
        const t = Math.min(elapsed / duration, 1);
        const angle = startAngle + (targetAngle - startAngle) * easeOutQuartic(t);

        this.applyRotation(angle);

        if (t < 1) {
          requestAnimationFrame(frame);
        } else {
          this.currentAngle = targetAngle;
          this.ngZone.run(() => {
            subject.next();
            subject.complete();
          });
        }
      };

      requestAnimationFrame(frame);
    });

    return subject.asObservable();
  }
}
