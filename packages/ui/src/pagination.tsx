import React, { useEffect, useState } from "react";

interface PaginationProps {
  total: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  total,
  itemsPerPage,
  onPageChange,
}) => {
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const totalPagesCount = Math.ceil(total / itemsPerPage);
    setTotalPages(totalPagesCount);
  }, [total, itemsPerPage]);

  const goToPage = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      onPageChange(page);
    }
  };

  const goToPrevPage = (): void => {
    goToPage(currentPage - 1);
  };

  const goToNextPage = (): void => {
    goToPage(currentPage + 1);
  };

  return (
    <div>
      <button
        className="border-b"
        onClick={goToPrevPage}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span className="p-6">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="border-b"
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
