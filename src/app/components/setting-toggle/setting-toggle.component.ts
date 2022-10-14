import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges, OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

const noop = () => {
};

@Component({
  selector: 'app-setting-toggle',
  templateUrl: './setting-toggle.component.html',
  styleUrls: ['./setting-toggle.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SettingToggleComponent),
      multi: true
    }
  ]
})
export class SettingToggleComponent implements OnInit,  ControlValueAccessor {
  @Output() lyLaInputChange = new EventEmitter<any>();
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Input() color: string = 'default';
  @Input() size: string = "medium";
  @Input() mode: string = 'android';

  constructor() {

  }

  //The internal data model
  private innerValue: any = false;

  //Placeholders for the callbacks which are later provided
  //by the Control Value Accessor
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  ngOnInit() {}

  onChange($event: any) {
    this.lyLaInputChange.emit($event)
  }

  //get accessor
  get value(): any {
    return this.innerValue;
  };

  //set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallback(v);
    }
  }

  //Set touched on blur
  onBlur() {
    this.onTouchedCallback();
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }

  //From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

}
