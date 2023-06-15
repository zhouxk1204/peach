import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Worksheet } from "exceljs";
import { Employee } from "src/app/models/employee.model";
import { ExcelService } from "src/app/services/excel.service";
import { TableHeader } from "src/app/types/index.type";

export interface Table<T> {
  header: {
    key: string;
    label: string;
  }[];
  data: MatTableDataSource<T>;
}

@Component({
  selector: "ng-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"],
})
export class TableComponent implements OnInit {
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input()
  set data(value: any[]) {
    // 当 table 属性发生变化时调用的方法
    this.dataSource = new MatTableDataSource<any>(value);
    if (value && value.length > 0) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // this.paginator._changePageSize(this.paginator.pageSize);
    }
  }
  @Input() headers!: TableHeader[];

  @Output() add = new EventEmitter<void>();
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
  @Output() import = new EventEmitter<Worksheet>();
  @Output() export = new EventEmitter<void>();

  loading: boolean = false;

  get headerKeys(): string[] {
    return this.headers.map((e) => e.key).concat(["actions"]);
  }

  constructor(
    private readonly matSnackBar: MatSnackBar,
    private readonly excelService: ExcelService
  ) {}

  ngAfterViewInit() {
    if (this.dataSource.data.length > 0) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    if (this.dataSource.data.length === 0) return;
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {}

  addRow() {
    this.add.emit();
  }

  editRow(employee: Employee) {
    this.edit.emit(employee.id);
  }

  deleteRow(employee: Employee) {
    this.delete.emit(employee.id);
  }

  handleImport(event: any) {
    this.loading = true;
    const file: File = event.target.files[0]; // 获取上传的文件
    this.excelService.readExcelFile(file).then((worksheet) => {
      this.import.emit(worksheet);
      this.loading = false;
      this.matSnackBar.open(`一键导入成功！🎉🎉`, "关闭", {
        duration: 2 * 1000,
      });
    });
  }

  download() {
    this.export.emit();
  }
}
