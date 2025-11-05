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

  const isFirstGroup = currentPageGroup === 0;
  const lastPageGroup = Math.floor((totalPages - 1) / 10);
  const isLastGroup = currentPageGroup === lastPageGroup;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationFirst
            aria-disabled={isFirstGroup}
            className={isFirstGroup ? 'pointer-events-none opacity-50' : undefined}
            onClick={() => !isFirstGroup && onPageChange(1)}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={isFirstGroup}
            className={isFirstGroup ? 'pointer-events-none opacity-50' : undefined}
            onClick={() => {
              if (!isFirstGroup) {
                onPageChange(currentPageGroup * 10);
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
            aria-disabled={isLastGroup}
            className={isLastGroup ? 'pointer-events-none opacity-50' : undefined}
            onClick={() => {
              if (!isLastGroup) {
                onPageChange((currentPageGroup + 1) * 10 + 1);
              }
            }}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLast
            aria-disabled={isLastGroup}
            className={isLastGroup ? 'pointer-events-none opacity-50' : undefined}
            onClick={() => !isLastGroup && onPageChange(totalPages)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
