import { createContext, useContext, useState } from "react";

export interface DataTableContextType {
  selectedItem: string;
  openMenu: boolean;
  openDeleteDialog: boolean;
  openDropdownMenu: boolean;
  setSelectedItem: (value: string) => void;
  getEditionPath: (id?: string) => string;
  setOpenMenu: (value: boolean) => void;
  setOpenDeleteDialog: (value: boolean) => void;
  onDeleteAction: () => void;
  onCancelDeleteAction: () => void;
  setOpenDropdownMenu: (value: boolean) => void;
}

interface ProviderProps {
  children: React.ReactNode;
  /**
   * Path to edit page
   * This path will be edit to something like this: `${editionPathPrefix}/${selectedItem}/edit`
   */
  editionPathPrefix: string;
}

export const DataTableContext = createContext<DataTableContextType>({} as DataTableContextType);

export function DataTableMenuProvider({ children, editionPathPrefix }: ProviderProps) {
  const [selectedItem, setSelectedItem] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openDropdownMenu, setOpenDropdownMenu] = useState(false);

  function handleDeleteAction() {
    setOpenDeleteDialog(false)
    setOpenMenu(false)
  }

  function handleCancelDeleteAction() {
    setOpenDeleteDialog(false)
    setOpenMenu(false)
  }

  function getEditionPath(id?: string) {
    return `${editionPathPrefix}/${id || selectedItem}/edit`
  }

  return (
    <DataTableContext.Provider value={{
      selectedItem,
      setSelectedItem,
      openMenu,
      setOpenMenu,
      openDeleteDialog,
      setOpenDeleteDialog,
      onDeleteAction: handleDeleteAction,
      onCancelDeleteAction: handleCancelDeleteAction,
      openDropdownMenu,
      setOpenDropdownMenu,
      getEditionPath
    }}>
      <>
        {children}
      </>
    </DataTableContext.Provider>
  )
}

export function useDataTableCtx(): DataTableContextType {
  const context = useContext(DataTableContext);

  if (context === undefined) {
    throw new Error('useDataTable must be used within a DataTableMenuProvider');
  }

  return context;
}
