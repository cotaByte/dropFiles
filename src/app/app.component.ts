import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  filter,
  fromEvent,
  map,
  ReplaySubject,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { VERTICAL_EXPAND } from './animations/expandVertical.animation';
import { provideAnimations } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [provideAnimations()],
  animations: [VERTICAL_EXPAND],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  //#region VIEWCHILDS
  @ViewChild('dropContainer', { static: true }) set dropContainerSetter(
    v: ElementRef<HTMLDivElement>
  ) {
    if (!v) return;
    this.dropContainer.next(v);
  }
  public dropContainer = new ReplaySubject<ElementRef<HTMLDivElement>>(1);
  @ViewChild('input', { static: true }) set inputElementSetter(
    v: ElementRef<HTMLInputElement>
  ) {
    if (!v) return;
    this.input.next(v);
  }
  public input = new ReplaySubject<ElementRef<HTMLInputElement>>(1);
  //#endregion VIEWCHILDS

  //#region DRAGOVER
  dragOver$ = this.dropContainer.pipe(
    switchMap((el) =>
      fromEvent<DragEvent>(el.nativeElement, 'dragover').pipe(
        tap((e) => {
          e.preventDefault();
          e.stopPropagation();
        })
      )
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );
  //#endregion DRAGOVER

  //#region DRAGLEAVE
  dragLeave$ = this.dropContainer.pipe(
    switchMap((el) =>
      fromEvent<DragEvent>(el.nativeElement, 'dragleave').pipe()
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );
  //#endregion DRAGLEAVE

  //#region DROP
  drop$ = this.dropContainer.pipe(
    switchMap((el) =>
      fromEvent<DragEvent>(el.nativeElement, 'drop').pipe(
        map((e) => {
          e.preventDefault();
          e.stopPropagation();
          return e.dataTransfer?.files;
        })
      )
    ),
    filter(
      (files) =>
        !!files &&
        Array.from(files).some((file) => file.type.startsWith('image/'))
    ),
    map((files) => {
      if (!files) return [];
      return Array.from(files).map((file, index) => ({
        id: file.name + index + 1,
        url: URL.createObjectURL(file),
        size: Math.round(file.size / 2048),
        selected: false,
      }));
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );
  //#endregion DROP
}
