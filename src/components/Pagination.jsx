import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MAX_VISIBLE_PAGES = 5;

function getPageRange(currentPage, lastPage) {
  if (lastPage <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: lastPage }, (_, i) => i + 1);
  }

  const pages = new Set([1, lastPage, currentPage]);

  for (let offset = 1; offset <= 1; offset++) {
    if (currentPage - offset > 1) pages.add(currentPage - offset);
    if (currentPage + offset < lastPage) pages.add(currentPage + offset);
  }

  const sorted = [...pages].sort((a, b) => a - b);

  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push("...");
    }
    result.push(sorted[i]);
  }
  return result;
}

export default function Pagination({ currentPage, lastPage, onPageChange }) {
  if (!lastPage || lastPage <= 1) return null;

  const pages = getPageRange(currentPage, lastPage);

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="text-xs h-9"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Prev
      </Button>

      {pages.map((pageNum, index) =>
        pageNum === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="text-xs text-slate-400 px-1 select-none"
          >
            …
          </span>
        ) : (
          <Button
            key={pageNum}
            variant={currentPage === pageNum ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(pageNum)}
            className={
              currentPage === pageNum
                ? "bg-violet-600 hover:bg-violet-700 text-white text-xs h-9 w-9"
                : "text-xs h-9 w-9 border-slate-200 text-slate-600"
            }
          >
            {pageNum}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === lastPage}
        onClick={() => onPageChange(currentPage + 1)}
        className="text-xs h-9"
      >
        Next <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}