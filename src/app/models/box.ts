export interface IBox {
  id: number;
  idSelector: number | null;
  label: string | null;
  value: number | null;
}
export class Box implements IBox{
  id: number;
  idSelector: number | null;
  label: string | null;
  value: number | null;
  constructor(id: number, idSelector: number | null, label: string | null, value: number| null){
    this.id= id;
    this.idSelector = idSelector;
    this.label =label;
    this.value =value;

  }
}
