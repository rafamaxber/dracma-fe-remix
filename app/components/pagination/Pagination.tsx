import { ListAllFilterType } from "~/data/types";
import { Pagination as PaginationBase, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "../ui/pagination";

export interface PaginationType extends ListAllFilterType {
  total?: number;
}

export interface PaginationProps extends PaginationType {
  onChange?: (page: number) => void;
}

export function Pagination({
  page = 1,
  perPage = 10,
  total = 0,
}: PaginationProps) {
  const totalPages = Math.ceil(total / perPage);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (pages.length === 1) return null;

  return (
    <PaginationBase className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious to={`?page=${page-1}`}>Previous</PaginationPrevious>
        </PaginationItem>
        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink to={`?page=${page}`}>{page}</PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext to={`?page=${page+1}`}>Next</PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </PaginationBase>
  )
}
