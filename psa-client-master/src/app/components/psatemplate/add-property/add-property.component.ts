import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Events, NavParams } from '@ionic/angular';


@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.scss'],
})
export class AddPropertyComponent implements OnInit {



  public psaForm: FormGroup;
  name;
  text;
  minValue;
  maxValue;
  date;
  intervall;
  private type;
  option_error: boolean = false;
  private data: any;
  private show: boolean;
  private index: any;
  is_ppe: any = false;
  constructor(private formBuilder: FormBuilder, private events: Events, public navParams: NavParams) {
    if (this.navParams.get('show')) {
      this.data = this.navParams.get('data');
      this.show = this.navParams.get('show');
      this.index = this.navParams.get('index');
    }

    if (this.navParams.get('ppe')) {
      this.is_ppe = this.navParams.get('ppe');
    }
    if (this.show) {
      this.psaForm = this.data;
      this.name = this.data.value['name'];
      this.text = "";
      this.minValue = this.data.value['minValue'];
      this.maxValue = this.data.value['maxValue'];
      this.date = '2020-01-01 01:01:01';
      this.intervall = this.data.value['intervall'];
      this.type = this.data.value['type'];
    }
    else {
      this.psaForm = this.formBuilder.group({
        name: [{ value: '', disabled: false }, [Validators.required, Validators.min(2), Validators.max(50)]],
        text: [{ value: '', disabled: true }, [Validators.min(2), Validators.max(50)]],
        minValue: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(1)]],
        maxValue: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(1)]],
        date: { value: '', disabled: true },
        intervall: { value: '', disabled: true },
        type: { value: '', disabled: true },
      });
    }
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

  public showFormArray($event) {
    this.option_error = false;
    let value = $event.detail.value.split(' ');
    switch (value[0]) {
      case 'intervall':
        this.showIntervallFormArray();
        break;
      case 'date':
        this.showDateFormArray();
        break;
      case 'counterAsc':
        this.showCounterAscFormArray();
        break;
      case 'counterDesc':
        this.showCounterDescFormArray();
        break;
      case 'value':
        this.showValueFormArray();
        break;
      case 'text':
        this.showTextFormArray();
        break;
    }

  }

  showIntervallFormArray() {
    this.psaForm.controls.name.enable();
    this.psaForm.controls.name.enable();
    this.psaForm.controls.intervall.enable();
    this.psaForm.controls.date.disable();
    this.psaForm.controls.maxValue.disable();
    this.psaForm.controls.minValue.disable();
    this.psaForm.controls.text.disable();
    this.psaForm.controls.type.enable();
    this.psaForm.controls.type.setValue('intervall');
    this.type = 'intervall';

  }

  showDateFormArray() {
    this.psaForm.controls.name.enable();
    this.psaForm.controls.intervall.disable();
    this.psaForm.controls.date.enable();
    this.psaForm.controls.maxValue.disable();
    this.psaForm.controls.minValue.disable();
    this.psaForm.controls.text.disable();
    this.psaForm.controls.type.enable();
    this.psaForm.controls.type.setValue('date');
    this.psaForm.controls.date.setValue('2020-01-01 01:01:01');
    this.psaForm.value["date"] = '2020-01-01 01:01:01';
    this.type = 'date';
  }

  showCounterDescFormArray() {
    this.psaForm.controls.name.enable();
    this.psaForm.controls.intervall.disable();
    this.psaForm.controls.date.disable();
    this.psaForm.controls.maxValue.enable();
    this.psaForm.controls.minValue.enable();
    this.psaForm.controls.text.disable();
    this.psaForm.controls.type.enable();
    this.psaForm.controls.type.setValue('downValueRange');
    this.type = 'downValueRange';

  }

  showCounterAscFormArray() {
    this.psaForm.controls.name.enable();
    this.psaForm.controls.intervall.disable();
    this.psaForm.controls.date.disable();
    this.psaForm.controls.maxValue.enable();
    this.psaForm.controls.minValue.enable();
    this.psaForm.controls.text.disable();
    this.psaForm.controls.type.enable();
    this.psaForm.controls.type.setValue('upValueRange');
    this.type = 'upValueRange';
  }

  showValueFormArray() {
    this.psaForm.controls.name.enable();
    this.psaForm.controls.intervall.disable();
    this.psaForm.controls.date.disable();
    this.psaForm.controls.maxValue.disable();
    this.psaForm.controls.minValue.enable();
    this.psaForm.controls.text.disable();
    this.psaForm.controls.type.enable();
    this.psaForm.controls.type.setValue('value');
    this.type = 'value';
  }

  showTextFormArray() {
    this.psaForm.controls.name.enable();
    this.psaForm.controls.intervall.disable();
    this.psaForm.controls.date.disable();
    this.psaForm.controls.maxValue.disable();
    this.psaForm.controls.minValue.disable();
    this.psaForm.controls.text.enable();
    this.psaForm.controls.text.setValue("-");
    this.psaForm.value["text"] = "-";
    this.psaForm.controls.type.enable();
    this.psaForm.controls.type.setValue('text');
    this.type = 'text';
  }


  addProperty() {
    if (this.psaForm.valid) {
      if (this.show) {
        let obj = { 'psaForm': this.psaForm, 'index': this.index }
        this.events.publish('updateProperty', obj);
      }
      else {
        this.events.publish('addPropertyToPe', this.psaForm);
      }
    }
    else {
      this.psaForm.markAllAsTouched();
      if (this.type == null) {
        this.option_error = true;
      }
      else {
        this.option_error = false;
      }
    }
  }

  removeProperty() {
    this.events.publish('removeProperty', this.index);
  }

  ngOnInit() { }

}
