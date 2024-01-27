export interface FormConfigType {
  sectionTitle?: string,
  layout?: string,
  fields: Array<{
    name: string,
    label: string,
    placeholder?: string,
    type?: string,
    className?: string,
  }>
}
export type FormConfigListType = Array<FormConfigType>

export interface PageConfigType {
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
  dataTableColumns: Array<{
    accessorKey: string,
    header: string,
  }>
}
