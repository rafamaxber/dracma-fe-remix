import { Pagination as PaginationBase, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "../ui/pagination";

export interface PaginationType {
  page: number;
  limit: number;
  offset: number;
  total: number;
}

export interface PaginationProps extends PaginationType {
  onChange?: (page: number) => void;
}

export function Pagination({
  total = 0,
  limit = 50,
  page = 1,
}: PaginationProps) {
  const totalPages = Math.ceil(total / limit);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

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
