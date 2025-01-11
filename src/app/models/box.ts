export interface IBox {
  id: number;
  idSelectorOption: number | null;
  label: string | null;
  value: number | null;
}
export class Box implements IBox{
  id: number;
  idSelectorOption: number | null;
  label: string | null;
  value: number | null;
  constructor(id: number, idSelectorOption: number | null, label: string | null, value: number| null){
    this.id= id;
    this.idSelectorOption = idSelectorOption;
    this.label =label;
    this.value =value;
  }
}
