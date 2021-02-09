import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable()
export class ExcelServicesService {
  constructor() {}
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    // XLSX.utils.format_cell()
    // debugger;
    console.log(json , "JSON ")
    //  = json;
     let t =  json
    // debugger
    // XLSX.write()
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(t);
    XLSX.utils.encode_range({c:1,r:1} , {c:20,r:20})

    // const ranges = worksheet.getRange("B2:E5");
    // console.log(ranges , "ranges")
    // debugger
    // range.values = data;
    // range.format.autofitColumns();
    // for(var R = 3; R <= 50; ++R) {
    //   for(var C = 3; C <= 50; ++C) {
    //     var cell_address = {c:C, r:R};
    //     console.log(cell_address , "cel address")
    //     /* if an A1-style address is needed, encode the address */
    //     var cell_ref = XLSX.utils.encode_cell(cell_address);
    //   }
    // }
    const merge = [
      { s: { r: 0, c: 1 }, e: { r: 0, c: 2 } },{ s: { r: 0, c: 3 }, e: { r: 0, c: 4 } },
    ];
    // worksheet['!ref'] = "B3:Y10"
    var wscols = [
      // {wch:30},
      // {wch:30},
      // {wch:30},
      // {wch:30}
  ];
  var wsrows =  [
    // {hpt: 50}, // row 1 sets to the height of 12 in points
    // {hpx: 50}, // row 2 sets to the height of 16 in pixels
  ];
  var range = XLSX.utils.decode_range(worksheet['!ref']);
var noRows = range.e.r; // No.of rows
var noCols = range.e.c; // No. of cols
console.log(noRows , noCols , "ROWS AND COLUMNS")
for(var R = 0; R <= noRows; R++) {
  wsrows.push({hpt:20})

} 
for(var C = 0; C <= noCols; C++) {
wscols.push({wch:30})
}
worksheet['!rows'] = wsrows; // ws - worksheet
  worksheet['!cols'] = wscols;
    // worksheet["!merges"] = merge;
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }
  public save(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }
  public read(file) {
    // const reader: FileReader = new FileReader();
    // reader.readAsBinaryString(file);
    // reader.onload = (e: any) => {
    const binarystr: string = file;
    const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });
    const wsname: string = wb.SheetNames[0];
    const ws: XLSX.WorkSheet = wb.Sheets[wsname];
    const data = XLSX.utils.sheet_to_json(ws);
    console.log(data, 'UPLOADED DATA');
    return data;
  }
  // }
}
