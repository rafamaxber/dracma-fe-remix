import { ColumnDef } from "@tanstack/react-table"

export interface FormConfigType {
  sectionTitle?: string,
  layout?: string,
  fields: Array<{
    name: string,
    label: string,
    placeholder?: string,
    type?: string,
    className?: string,
    isMultiple?: boolean,
  }>
}
export type FormConfigListType = Array<FormConfigType>

export interface PageConfigType<T> {
  entity: string,
  path: string,
  createBtnTxt: string,
  updateTxt: string,
  createTxt: string,
  intent: {
    create: string,
    update: string,
    delete: string,
    search: string,
  },
  formViewTitleTxt: string,
  formEditTitleTxt: string,
  formCreateTitleTxt: string,
  formSubtitleTxt: string,
  listTitleTxt: string,
  dataTableColumns: ColumnDef<T>[]
}
