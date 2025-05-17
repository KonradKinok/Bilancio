import React from "react";
import { nanoid } from "nanoid";
import classnames from "classnames";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { usePagination, DOTS } from "./usePagination";
import "./pagination.scss";

// Definicja interfejsu dla propsów
interface PaginationProps {
  onPageChange: (page: number) => void;
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageSize?: number;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = (props) => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize = 1,
    className,
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const lastPage = paginationRange[paginationRange.length - 1] as number;
  return (
    <ul
      className={classnames("pagination-container", {
        [className!]: className,
      })}
    >
      <li
        key={nanoid()}
        className={classnames("pagination-item", {
          disabled: currentPage === 1,
        })}
        onClick={onPrevious}
      >
        <div className="arrow left">
          <MdOutlineArrowForwardIos />
        </div>
      </li>
      {paginationRange.map((pageNumber) => {
        if (pageNumber === DOTS) {
          return (
            <li key={nanoid()} className="pagination-item dots">
              &#8230;
            </li>
          );
        }

        return (
          <li
            key={nanoid()}
            className={classnames("pagination-item", {
              selected: pageNumber === currentPage,
            })}
            onClick={() => onPageChange(pageNumber as number)}
          >
            {pageNumber}
          </li>
        );
      })}
      <li
        key={nanoid()}
        className={classnames("pagination-item", {
          disabled: currentPage === lastPage,
        })}
        onClick={onNext}
      >
        <div className="arrow right">
          <MdOutlineArrowForwardIos />
        </div>
      </li>
    </ul>
  );
};

export default Pagination;
