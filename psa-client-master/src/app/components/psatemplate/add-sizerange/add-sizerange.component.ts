import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Events, NavParams } from '@ionic/angular';
import { size_range } from 'src/app/models/size_range';
import { size } from 'src/app/models/size';

@Component({
  selector: 'app-add-sizerange',
  templateUrl: './add-sizerange.component.html',
  styleUrls: ['./add-sizerange.component.scss'],
})
export class AddSizerangeComponent implements OnInit {

  public sizeRangeForm: FormGroup;
  private validSizeRanges: boolean = false;
  sizeRange: size_range;
  private data: any;
  private show: boolean;
  private index: any;
  name;
  _sizes: Array<size>;

  constructor(private fb2: FormBuilder, private events: Events, public navParams: NavParams) {
    this._sizes = new Array<size>();

    this.sizeRangeForm = this.fb2.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      sizes: this.fb2.array([this.sizes])
    });
    this.sizeRange = new size_range(null, null, null);

    if (this.navParams.get('show')) {
      this.data = this.navParams.get('data');
      this.show = this.navParams.get('show');
      this.index = this.navParams.get('index');

    }
    if (this.show) {
      this.sizeRangeForm = this.data;
      this.name = this.sizeRangeForm.value.name;
      this._sizes = this.sizeRangeForm.value.sizes;
    }
    else {
      this._sizes.push(new size());
    }
  }

  ngOnInit() {
  }

  addsizeRange() {
    if (this.show) {
      this.events.publish('updateSizerange', this.sizeRangeForm);
    }
    else {
      this.events.publish('addSizerangeToPe', this.sizeRangeForm);
    }
  }

  get sizeRanges(): FormGroup {

    return this.fb2.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      sizes: this.fb2.array([this.sizes])
    });
  }

  get sizes(): FormGroup {
    return this.fb2.group({
      name: ''
    });
  }

  get sizeRangeFormData() { return <FormArray>this.sizeRangeForm.get('sizes'); }

  deletesizeRange() {
    this.events.publish('deleteSizerange', this.index);
  }

  deleteSize(sizeRange, index) {
    if (sizeRange.get('sizes').length > 1) {
      sizeRange.get('sizes').removeAt(index);
    }

  }

  addSize(sizeRange, newsize: boolean = true) {
    if (newsize) {
      this._sizes.push(new size());
    }
    sizeRange.get('sizes').push(this.sizes);
  }

  validation_messages = {
    'name': [
      { type: 'required', message: 'Bitte ein gültigen Namen eintragen.' },
      { type: 'minlength', message: 'Der Name muss mindesten aus 2 Zeichen bestehen.' },
      { type: 'maxlength', message: 'Der Name darf maximal aus 20 Zeichen bestehen.' }
    ],
    'name_property': [
      { type: 'required', message: 'Bitte ein gültigen Namen eintragen.' },
      { type: 'minlength', message: 'Der Name muss mindesten aus 2 Zeichen bestehen.' },
      { type: 'maxlength', message: 'Der Name darf maximal aus 20 Zeichen bestehen.' }
    ],
    'text_property': [
      { type: 'required', message: 'Bitte ein gültigen Text eintragen.' },
      { type: 'minlength', message: 'Der Text muss mindesten aus 2 Zeichen bestehen.' },
      { type: 'maxlength', message: 'Der Text darf maximal aus 20 Zeichen bestehen.' }
    ],
    'minValue_property': [
      { type: 'required', message: 'Bitte ein gültigen Wert eintragen.' },
      { type: 'minlength', message: 'Der Wert muss mindesten aus 1 Zeichen bestehen.' },
      { type: 'pattern', message: 'Der Wert muss eine Zahl sein.' }
    ],
    'maxValue_property': [
      { type: 'required', message: 'Bitte ein gültigen Wert eintragen.' },
      { type: 'minlength', message: 'Der Wert muss mindesten aus 1 Zeichen bestehen.' },
      { type: 'pattern', message: 'Der Wert muss eine Zahl sein.' }
    ],
    'name_sizeRange': [
      { type: 'required', message: 'Bitte ein gültigen Namen eintragen.' },
      { type: 'minlength', message: 'Der Name muss mindesten aus 2 Zeichen bestehen.' },
      { type: 'maxlength', message: 'Der Name darf maximal aus 20 Zeichen bestehen.' }
    ],
  }
}
