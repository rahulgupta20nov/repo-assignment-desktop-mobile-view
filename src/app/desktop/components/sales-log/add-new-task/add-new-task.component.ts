import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { DateUtilsService } from 'src/app/utils/date.utils';
import { SalesLogsService } from 'src/app/services/sales-logs.service';
import { Log } from 'src/app/models/log.model';

@Component({
  selector: 'app-add-new-task',
  templateUrl: './add-new-task.component.html',
  styleUrls: ['./add-new-task.component.scss']
})
export class AddNewTaskComponent implements OnInit {
  @ViewChild('selectIcon') selectIcon;
  salesLogForm: FormGroup;
  taskTypeForm = new FormControl();


  hours: string[] = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  minutes: string[] = [];
  meridians: string[] = ['AM', 'PM'];
  taskTypes: {
    name: string,
    icon: string,
    id: string,
  }[] = [{ name: 'Call', icon: 'phone', id: 'call' }, { name: 'Meeting', icon: 'my_location', id: 'meeting' }, { name: 'Video', icon: 'videocam', id: 'video' }];

  constructor(
    public dialogRef: MatDialogRef<AddNewTaskComponent>,
    private dateUtils: DateUtilsService,
    public salesLogService: SalesLogsService,
    @Inject(MAT_DIALOG_DATA) public data: Log,
  ) {
    for (let i = 0; i < 60; i++) {
      this.minutes.push(i < 10 ? `0${i}` : `${i}`);
    }
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.salesLogForm = new FormGroup({
      taskStatus: new FormControl(this.data ? this.data.taskStatus : 'open'),
      entityName: new FormControl(this.data ? this.data.entityName : '', Validators.required),
      date: new FormControl(new Date(this.data ? this.data.date : undefined)),
      time: this.getTimeFormGroup(),
      taskType: new FormControl(this.data ? this.data.taskType : 'Meeting'),
      contact: new FormControl(this.data ? this.data.contact : '', Validators.required),
      contactPerson: new FormControl(this.data ? this.data.contactPerson : '', Validators.required),
      note: new FormControl(this.data ? this.data.note : ''),
    });
  }

  getSelectedValue() { 
    if (this.selectIcon && this.selectIcon.options && this.selectIcon.options.length > 0) { 
      const lable = this.selectIcon.options.find(
        (item) => { 
          return item.value === this.selectIcon.value; 
        });
      console.log(lable);
      return lable;
    } 
    return ''; 
  }

  private getTimeFormGroup() {
    let time;
    if(this.data) {
      time = this.dateUtils.getTime(this.data.date);
    }
    return new FormGroup({
      hour: new FormControl(this.data ? time.hour : '12'),
      minute: new FormControl(this.data ? time.minute : '00'),
      meridian: new FormControl(this.data ? time.meridian : 'PM'),
    });
  }
  public onSave() {
    if (!this.salesLogForm.invalid) {
      const { value: salesLog } = this.salesLogForm;
      const { date, time } = salesLog;
      salesLog.date = this.dateUtils.addDateAndTime(date, time);
      salesLog.id = this.data ? this.data.id : undefined,
      console.log(this.taskTypes.find((val) => {
        console.log(val.name);
        console.log(salesLog.taskType);
        return val.name === salesLog.taskType;
      }));
      salesLog.icon = this.taskTypes.find((val) => val.id === salesLog.taskType)['icon'];
      delete salesLog.time;
      if (salesLog) {
        this.salesLogService.processSalesLog(salesLog)
          .subscribe(result => {
            if (result) {
              this.dialogRef.close(result);
            }
          });
      }
    }
  }

  public onClose() {
    this.dialogRef.close();
  }

}
