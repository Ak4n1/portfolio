import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-image-lightbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-lightbox.component.html',
  styleUrl: './image-lightbox.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ImageLightboxComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() visible = false;
  @Input() images: string[] = [];
  @Input() title = '';
  @Input() startIndex = 0;

  @Output() closed = new EventEmitter<void>();
  @Output() indexChanged = new EventEmitter<number>();

  @ViewChild('swiperEl') swiperEl?: ElementRef<HTMLElement & { swiper?: { activeIndex: number; slideTo: (index: number) => void } }>;

  activeIndex = 0;
  private previousBodyOverflow = '';

  ngAfterViewInit(): void {
    this.syncSwiperIndex();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']) {
      if (this.visible) {
        this.activeIndex = this.safeIndex(this.startIndex);
        this.lockBodyScroll();
        setTimeout(() => this.syncSwiperIndex(), 0);
      } else {
        this.unlockBodyScroll();
      }
    }

    if ((changes['startIndex'] || changes['images']) && this.visible) {
      this.activeIndex = this.safeIndex(this.startIndex);
      setTimeout(() => this.syncSwiperIndex(), 0);
    }
  }

  ngOnDestroy(): void {
    this.unlockBodyScroll();
  }

  onOverlayClick(): void {
    this.close();
  }

  onContentClick(event: Event): void {
    event.stopPropagation();
  }

  onCloseClick(event?: Event): void {
    event?.stopPropagation();
    this.close();
  }

  onSlideChanged(event: Event): void {
    const customEvent = event as CustomEvent<{ activeIndex?: number }[]>;
    const indexFromDetail = customEvent.detail?.[0]?.activeIndex;
    const swiperIndex = this.swiperEl?.nativeElement?.swiper?.activeIndex;
    this.activeIndex = this.safeIndex(typeof indexFromDetail === 'number' ? indexFromDetail : swiperIndex ?? 0);
    this.indexChanged.emit(this.activeIndex);
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (!this.visible) return;
    this.close();
  }

  private close(): void {
    this.closed.emit();
  }

  private safeIndex(index: number): number {
    if (!this.images.length) return 0;
    if (index < 0) return 0;
    if (index >= this.images.length) return this.images.length - 1;
    return index;
  }

  private syncSwiperIndex(): void {
    const swiper = this.swiperEl?.nativeElement?.swiper;
    if (!swiper) return;
    swiper.slideTo(this.safeIndex(this.activeIndex));
  }

  private lockBodyScroll(): void {
    this.previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }

  private unlockBodyScroll(): void {
    document.body.style.overflow = this.previousBodyOverflow;
    this.previousBodyOverflow = '';
  }
}
