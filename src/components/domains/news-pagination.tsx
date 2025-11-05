import { Pagination, PaginationContent, PaginationFirst, PaginationItem, PaginationLast, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface NewsPaginationProps {
  page: number;
  onPageChange(page: number): void;
  totalItems: number;
  itemsPerPage: number;
}

export function NewsPagination({ page, onPageChange, totalItems, itemsPerPage }: NewsPaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPageGroup = Math.floor((page - 1) / 10);
  const startPage = currentPageGroup * 10 + 1;
  const endPage = Math.min((currentPageGroup + 1) * 10, totalPages);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationFirst onClick={() => onPageChange(1)} />
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => {
              const currentPageGroup = Math.floor((page - 1) / 10);
              if (currentPageGroup > 0) {
                onPageChange((currentPageGroup - 1) * 10 + 1);
              }
            }}
          />
        </PaginationItem>
        {Array.from({ length: endPage - startPage + 1 }).map((_, index) => {
          const pageNumber = startPage + index;
          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                isActive={page === pageNumber}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext
            onClick={() => {
              const totalPages = Math.ceil(totalItems / itemsPerPage);
              const currentPageGroup = Math.floor((page - 1) / 10);
              if ((currentPageGroup + 1) * 10 < totalPages) {
                onPageChange((currentPageGroup + 1) * 10 + 1);
              }
            }}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLast
            onClick={() => {
              const totalPages = Math.ceil(totalItems / itemsPerPage);
              onPageChange(totalPages);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
