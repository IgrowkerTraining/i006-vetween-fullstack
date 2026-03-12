import React from 'react';

interface SkeletonProps {
  className?: string;
  count?: number;
  width?: string;
  height?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  count = 1,
  width = '100%',
  height = '1em',
  variant = 'rounded',
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded-none';
      case 'text':
        return 'rounded';
      case 'rounded':
      default:
        return 'rounded-md';
    }
  };

  const skeletons = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`animate-pulse bg-gray-200 ${getVariantClass()} ${className}`}
      style={{ width, height }}
    />
  ));

  return <>{skeletons}</>;
};

// Column types for TableSkeleton
export type ColumnType = 'text' | 'multi' | 'badge' | 'action';

export interface TableColumnConfig {
  width: string;
  type: ColumnType;
}

interface TableSkeletonProps {
  rows?: number;
  columns?: TableColumnConfig[];
  showHeader?: boolean;
}

// Component to render skeleton cell based on type
const CellSkeleton: React.FC<{ config: TableColumnConfig }> = ({ config }) => {
  switch (config.type) {
    case 'multi':
      return (
        <div className="flex gap-2">
          <div className="h-6 w-16 rounded-md bg-gray-200 animate-pulse" />
          <div className="h-6 w-12 rounded-md bg-gray-200 animate-pulse" />
        </div>
      );
    case 'badge':
      return (
        <div className="h-6 w-20 rounded-full bg-gray-200 animate-pulse" />
      );
    case 'action':
      return (
        <div className="h-6 w-14 rounded-md bg-gray-200 animate-pulse" />
      );
    case 'text':
    default:
      return (
        <div className={`h-6 rounded-md bg-gray-200 animate-pulse ${config.width}`} />
      );
  }
};

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = [
    { width: 'w-16', type: 'text' },
    { width: 'w-32', type: 'text' },
    { width: 'w-32', type: 'text' },
    { width: 'flex-1', type: 'multi' },
    { width: 'w-56', type: 'text' },
    { width: 'w-32', type: 'text' },
    { width: 'w-24', type: 'badge' },
    { width: 'w-20', type: 'action' },
    { width: 'w-24', type: 'action' },
  ],
  showHeader = true,
}) => {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {showHeader && (
        <div className="flex bg-gray-300 px-6 py-3">
          {columns.map((col, i) => (
            <div key={i} className={`${col.width} pr-4`}>
              <Skeleton 
                height="h-6" 
                variant="text" 
                className="bg-gray-400/50"
              />
            </div>
          ))}
        </div>
      )}
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex items-center px-6 py-4">
            {columns.map((col, colIndex) => (
              <div key={colIndex} className={`${col.width} pr-4 flex items-center`}>
                <CellSkeleton config={col} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Page header skeleton component
interface PageHeaderSkeletonProps {
  showSubtitle?: boolean;
  showActions?: boolean;
}

export const PageHeaderSkeleton: React.FC<PageHeaderSkeletonProps> = ({
  showSubtitle = true,
  showActions = true,
}) => {
  return (
    <header className="flex min-h-20 items-center justify-between border-b border-border bg-card px-8 py-5">
      <div className="flex items-center gap-4">
        <div>
          {showSubtitle && (
            <Skeleton width="100px" height="1rem" variant="text" className="mb-2" />
          )}
          <Skeleton width="200px" height="2rem" variant="text" />
        </div>
      </div>
      {showActions && (
        <div className="flex items-center gap-3">
          <Skeleton width="180px" height="2.5rem" variant="rounded" />
        </div>
      )}
    </header>
  );
};

// SearchBar skeleton component
export const SearchBarSkeleton: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <Skeleton height="2.5rem" variant="rounded" className="flex-grow" />
      <Skeleton width="5rem" height="2.5rem" variant="rounded" />
    </div>
  );
};

// ===== COMPONENTS FOR PATIENTDETAIL =====

// Header Skeleton for PatientDetail
export const PatientDetailHeaderSkeleton: React.FC = () => {
  return (
    <header className="flex min-h-20 items-center justify-between border-b border-border bg-card px-8 py-5">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          {/* Back button */}
          <Skeleton width="2rem" height="2rem" variant="rounded" />
          <div>
            <Skeleton width="100px" height="1rem" variant="text" className="mb-2" />
            <Skeleton width="280px" height="2rem" variant="text" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Skeleton width="160px" height="2.5rem" variant="rounded" />
      </div>
    </header>
  );
};

// Patient Card Skeleton
export const PatientCardSkeleton: React.FC = () => {
  return (
    <div className="flex h-32 w-full max-w-md items-stretch overflow-hidden rounded-xl bg-vetween-ice shadow-md">
      {/* Avatar/Imagem skeleton */}
      <div className="relative w-42 shrink-0 overflow-hidden rounded-xl bg-muted">
        <div className="flex h-full w-full items-center justify-center">
          <Skeleton width="3rem" height="3rem" variant="circular" />
        </div>
      </div>
      
      {/* Info skeleton */}
      <div className="flex flex-col justify-center px-6 py-4">
        <Skeleton width="150px" height="1.5rem" variant="text" className="mb-3" />
        <div className="flex items-center gap-2">
          <Skeleton width="60px" height="1rem" variant="text" />
          <Skeleton width="60px" height="1.5rem" variant="rounded" />
        </div>
      </div>
    </div>
  );
};

// Action Buttons Skeleton
export const ActionButtonsSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton width="200px" height="2.5rem" variant="rounded" />
      <Skeleton width="150px" height="2.5rem" variant="rounded" />
    </div>
  );
};

// Tabs Skeleton
export const TabsSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Tab headers */}
      <div className="flex gap-1">
        <Skeleton width="140px" height="2.75rem" variant="rounded" />
        <Skeleton width="160px" height="2.75rem" variant="rounded" />
        <Skeleton width="100px" height="2.75rem" variant="rounded" />
      </div>
      
      {/* Tab content */}
      <div className="rounded-b-lg rounded-tr-lg border border-border bg-card p-6 bg-vetween-ice">
        {/* Dados gerais skeleton */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Skeleton height="4rem" variant="rounded" />
            <Skeleton height="4rem" variant="rounded" />
            <Skeleton height="4rem" variant="rounded" />
            <Skeleton height="4rem" variant="rounded" />
          </div>
          <Skeleton height="8rem" variant="rounded" />
        </div>
      </div>
    </div>
  );
};

// Timeline Item Skeleton
const TimelineItemSkeleton: React.FC = () => {
  return (
    <div className="mb-4 flex gap-4">
      {/* Timeline dot and line */}
      <div className="flex flex-col items-center">
        <Skeleton width="1rem" height="1rem" variant="circular" />
        <Skeleton width="2px" height="6rem" variant="rectangular" />
      </div>
      
      {/* Content */}
      <div className="flex-1 rounded-lg border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <Skeleton width="100px" height="1rem" variant="text" />
          <Skeleton width="70px" height="1.5rem" variant="rounded" />
        </div>
        <Skeleton width="200px" height="1.25rem" variant="text" className="mb-2" />
        <Skeleton width="100%" height="1rem" variant="text" className="mb-1" />
        <Skeleton width="80%" height="1rem" variant="text" className="mb-1" />
        <Skeleton width="60%" height="1rem" variant="text" />
      </div>
    </div>
  );
};

// Timeline Skeleton (for clinical history and vaccines)
interface TimelineSkeletonProps {
  count?: number;
}

export const TimelineSkeleton: React.FC<TimelineSkeletonProps> = ({ count = 3 }) => {
  return (
    <div className="space-y-0">
      {Array.from({ length: count }).map((_, i) => (
        <TimelineItemSkeleton key={i} />
      ))}
    </div>
  );
};

// PatientDetail Skeleton - Main component
export const PatientDetailSkeleton: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <PatientDetailHeaderSkeleton />
      
      <section className="flex-1 px-8 py-6">
        {/* Patient Card + Action Buttons */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <PatientCardSkeleton />
          <ActionButtonsSkeleton />
        </div>
        
        {/* Tabs Section */}
        <div className="shadow-sm">
          <TabsSkeleton />
        </div>
        
        {/* Generate Summary Button Skeleton */}
        <div className="mt-6 flex flex-col items-end gap-2">
          <Skeleton width="220px" height="2.5rem" variant="rounded" />
        </div>
      </section>
    </div>
  );
};

// ===== COMPONENTS FOR CLINICALSUMMARYDETAIL =====

// Header Skeleton for ClinicalSummaryDetail
export const ClinicalSummaryHeaderSkeleton: React.FC = () => {
  return (
    <header className="flex min-h-20 items-center justify-between border-b border-border bg-card px-8 py-5">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          {/* Back button */}
          <Skeleton width="2rem" height="2rem" variant="rounded" />
          <div>
            <Skeleton width="100px" height="1rem" variant="text" className="mb-2" />
            <Skeleton width="220px" height="2rem" variant="text" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Skeleton width="160px" height="2.5rem" variant="rounded" />
      </div>
    </header>
  );
};

// Patient Name Tab Skeleton
export const PatientNameTabSkeleton: React.FC = () => {
  return (
    <div className="mb-4 inline-block rounded-t-lg bg-gray-300 px-6 py-2">
      <Skeleton width="120px" height="1rem" variant="text" />
    </div>
  );
};

// Summary Card Skeleton - Main summary card
export const SummaryCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-b-xl rounded-tr-xl border border-border bg-card p-6 shadow-sm">
      {/* Top section: image + badges + narrative */}
      <div className="flex flex-col gap-6 sm:flex-row">
        {/* Image placeholder + badges */}
        <div className="shrink-0">
          <Skeleton width="10rem" height="10rem" variant="rounded" />
          <div className="mt-3 flex flex-col gap-2">
            <Skeleton width="8rem" height="1.5rem" variant="rounded" />
            <Skeleton width="9rem" height="1.5rem" variant="rounded" />
          </div>
        </div>
        
        {/* Narrative section */}
        <div className="flex-1 space-y-3">
          <Skeleton width="100%" height="1rem" variant="text" />
          <Skeleton width="95%" height="1rem" variant="text" />
          <Skeleton width="90%" height="1rem" variant="text" />
          <Skeleton width="85%" height="1rem" variant="text" />
          <Skeleton width="80%" height="1rem" variant="text" />
          <Skeleton width="70%" height="1rem" variant="text" />
        </div>
      </div>
      
      {/* Separator */}
      <div className="my-6 h-px w-full bg-border" />
      
      {/* Descripción clínica */}
      <div className="mb-4">
        <Skeleton width="180px" height="1.25rem" variant="text" className="mb-2" />
        <Skeleton width="100%" height="1rem" variant="text" />
        <Skeleton width="90%" height="1rem" variant="text" />
      </div>
      
      {/* Tratamiento indicado */}
      <div className="mb-4">
        <Skeleton width="180px" height="1.25rem" variant="text" className="mb-2" />
        <Skeleton width="95%" height="1rem" variant="text" />
        <Skeleton width="80%" height="1rem" variant="text" />
      </div>
      
      {/* Síntesis de visitas */}
      <div className="mb-4">
        <Skeleton width="180px" height="1.25rem" variant="text" className="mb-2" />
        <div className="space-y-2">
          <Skeleton width="100%" height="4rem" variant="rounded" />
          <Skeleton width="100%" height="4rem" variant="rounded" />
          <Skeleton width="100%" height="4rem" variant="rounded" />
        </div>
      </div>
      
      {/* Historial de vacunas */}
      <div className="mb-4">
        <Skeleton width="180px" height="1.25rem" variant="text" className="mb-2" />
        <div className="space-y-2">
          <Skeleton width="100%" height="3rem" variant="rounded" />
          <Skeleton width="100%" height="3rem" variant="rounded" />
        </div>
      </div>
      
      {/* Factores de riesgo */}
      <div className="mb-4">
        <Skeleton width="180px" height="1.25rem" variant="text" className="mb-2" />
        <div className="space-y-2">
          <Skeleton width="60%" height="1rem" variant="text" />
          <Skeleton width="50%" height="1rem" variant="text" />
          <Skeleton width="70%" height="1rem" variant="text" />
        </div>
      </div>
      
      {/* Separator */}
      <div className="my-6 h-px w-full bg-border" />
      
      {/* Puntos clave */}
      <div>
        <Skeleton width="280px" height="1.25rem" variant="text" className="mb-3" />
        <div className="space-y-2">
          <Skeleton width="80%" height="1rem" variant="text" />
          <Skeleton width="75%" height="1rem" variant="text" />
          <Skeleton width="85%" height="1rem" variant="text" />
          <Skeleton width="70%" height="1rem" variant="text" />
        </div>
      </div>
    </div>
  );
};

// ClinicalSummaryDetail Skeleton - Main component
export const ClinicalSummarySkeleton: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <ClinicalSummaryHeaderSkeleton />
      
      <section className="flex-1 px-8 py-6">
        <PatientNameTabSkeleton />
        <SummaryCardSkeleton />
      </section>
    </div>
  );
};

export default Skeleton;
