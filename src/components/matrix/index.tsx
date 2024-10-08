import React, { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Eye, EyeOff, Pin, ArrowUpDown } from 'lucide-react';

interface TransitionMatrixProps {
  data: Record<string, Record<string, number>>;
}

const TransitionMatrix: React.FC<TransitionMatrixProps> = ({ data }) => {
  const [matrixData, setMatrixData] = useState(data);
  const [hiddenRows, setHiddenRows] = useState<string[]>([]);
  const [hiddenCols, setHiddenCols] = useState<string[]>([]);
  const [pinnedRows, setPinnedRows] = useState<string[]>([]);
  const [pinnedCols, setPinnedCols] = useState<string[]>([]);
  const [heatmapOption, setHeatmapOption] = useState<'global' | 'row-wise' | 'column-wise'>('global');
  const [isHiddenRowsPanelOpen, setIsHiddenRowsPanelOpen] = useState(false);
  const [isHiddenColsPanelOpen, setIsHiddenColsPanelOpen] = useState(false);

  const { globalMin, globalMax, rowMinMax, colMinMax } = useMemo(() => {
    let gMin = Infinity;
    let gMax = -Infinity;
    const rMinMax: Record<string, { min: number; max: number }> = {};
    const cMinMax: Record<string, { min: number; max: number }> = {};

    const firstRow = Object.values(matrixData)[0];
    Object.keys(firstRow).forEach(colKey => {
      cMinMax[colKey] = { min: Infinity, max: -Infinity };
    });

    Object.entries(matrixData).forEach(([rowKey, row]) => {
      let rowMin = Infinity;
      let rowMax = -Infinity;

      Object.entries(row).forEach(([colKey, value]) => {
        if (typeof value === 'number') {
          gMin = Math.min(gMin, value);
          gMax = Math.max(gMax, value);
          rowMin = Math.min(rowMin, value);
          rowMax = Math.max(rowMax, value);
          cMinMax[colKey].min = Math.min(cMinMax[colKey].min, value);
          cMinMax[colKey].max = Math.max(cMinMax[colKey].max, value);
        }
      });

      rMinMax[rowKey] = { min: rowMin, max: rowMax };
    });

    return { globalMin: gMin, globalMax: gMax, rowMinMax: rMinMax, colMinMax: cMinMax };
  }, [matrixData]);

  const getCellColor = (value: number, rowKey: string, colKey: string) => {
    let ratio: number;

    if (heatmapOption === 'global') {
      ratio = (value - globalMin) / (globalMax - globalMin);
    } else if (heatmapOption === 'row-wise') {
      const { min, max } = rowMinMax[rowKey];
      ratio = (value - min) / (max - min);
    } else if (heatmapOption === 'column-wise') {
      const { min, max } = colMinMax[colKey];
      ratio = (value - min) / (max - min);
    } else {
      ratio = 0;
    }

    const hue = ratio * 120; // 0 is red, 120 is green
    return `hsl(${hue}, 100%, 50%)`;
  };

  const toggleRowVisibility = (rowIndex: string) => {
    setHiddenRows(prev => 
      prev.includes(rowIndex) ? prev.filter(r => r !== rowIndex) : [...prev, rowIndex]
    );
  };

  const toggleColVisibility = (colName: string) => {
    setHiddenCols(prev => 
      prev.includes(colName) ? prev.filter(c => c !== colName) : [...prev, colName]
    );
  };

  const toggleRowPin = (rowIndex: string) => {
    setPinnedRows(prev => 
      prev.includes(rowIndex) ? prev.filter(r => r !== rowIndex) : [...prev, rowIndex]
    );
  };

  const toggleColPin = (colName: string) => {
    setPinnedCols(prev => 
      prev.includes(colName) ? prev.filter(c => c !== colName) : [...prev, colName]
    );
  };

  const sortByRow = (rowIndex: string) => {
    // Implementation for sorting by row
  };

  const sortByColumn = (colName: string) => {
    // Implementation for sorting by column
  };

  const visibleColumns = Object.keys(Object.values(matrixData)[0]).filter(col => !hiddenCols.includes(col));
  const visibleRows = Object.keys(matrixData).filter(row => !hiddenRows.includes(row));

  const RowIndexCell: React.FC<{ rowIndex: string }> = ({ rowIndex }) => {
    const cellWidth = 150;
    const iconWidth = 16; // Assuming each icon is 16px wide
    const iconMargin = 4; // Assuming 4px margin between icons
    const totalIconsWidth = (iconWidth + iconMargin) * 3; // Width for 3 icons
    const maxTextWidth = cellWidth - totalIconsWidth - 8; // 8px for cell padding

    let displayText = rowIndex;
    if (rowIndex.length * 8 > maxTextWidth) { // Assuming 8px per character
      const maxChars = Math.floor(maxTextWidth / 8) - 3; // -3 for the ellipsis
      displayText = rowIndex.slice(0, maxChars) + '...';
    }

    return (
      <td className="p-2 border sticky left-0 bg-white z-10" style={{ width: `${cellWidth}px`, maxWidth: `${cellWidth}px` }}>
        <div className="flex items-center justify-between whitespace-nowrap">
          <span className="truncate" style={{ maxWidth: `${maxTextWidth}px` }} title={rowIndex}>
            {displayText}
          </span>
          <div className="flex items-center flex-shrink-0">
            <Eye onClick={() => toggleRowVisibility(rowIndex)} className="cursor-pointer w-4 h-4" />
            <Pin onClick={() => toggleRowPin(rowIndex)} className="cursor-pointer w-4 h-4 ml-1" />
            <ArrowUpDown onClick={() => sortByRow(rowIndex)} className="cursor-pointer w-4 h-4 ml-1" />
          </div>
        </div>
      </td>
    );
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <select 
        value={heatmapOption} 
        onChange={(e) => setHeatmapOption(e.target.value as 'global' | 'row-wise' | 'column-wise')}
        className="mb-4"
      >
        <option value="global">Global</option>
        <option value="row-wise">Row-wise</option>
        <option value="column-wise">Column-wise</option>
      </select>
      
      <div className="relative overflow-auto">
        <DragDropContext onDragEnd={() => {}}>
          <table className="border-collapse w-full">
            <thead>
              <tr>
                <th className="p-2 border sticky left-0 top-0 bg-white z-20" style={{ width: '150px', maxWidth: '150px' }}></th>
                {visibleColumns.map((colName, index) => (
                  <th key={index} className="p-2 border sticky top-0 bg-white z-10">
                    <div className="flex items-center justify-between whitespace-nowrap">
                      <span className="truncate mr-1" style={{ maxWidth: '100px' }} title={colName}>
                        {colName}
                      </span>
                      <div className="flex items-center flex-shrink-0">
                        <Eye onClick={() => toggleColVisibility(colName)} className="cursor-pointer w-4 h-4" />
                        <Pin onClick={() => toggleColPin(colName)} className="cursor-pointer w-4 h-4 ml-1" />
                        <ArrowUpDown onClick={() => sortByColumn(colName)} className="cursor-pointer w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </th>
                ))}
                <th className="p-2 border sticky top-0 right-0 bg-white z-20">
                  <button 
                    onClick={() => setIsHiddenColsPanelOpen(!isHiddenColsPanelOpen)}
                    className="bg-gray-200 p-2 rounded w-full text-left"
                  >
                    {isHiddenColsPanelOpen ? 'Hide' : 'Show'} Hidden Columns ({hiddenCols.length})
                  </button>
                </th>
                {isHiddenColsPanelOpen && hiddenCols.map((colName, index) => (
                  <th key={`hidden-${index}`} className="p-2 border sticky top-0 bg-gray-200 z-10">
                    <div className="flex items-center justify-between whitespace-nowrap">
                      <span className="truncate mr-1" style={{ maxWidth: '100px' }} title={colName}>
                        {colName}
                      </span>
                      <EyeOff onClick={() => toggleColVisibility(colName)} className="cursor-pointer w-4 h-4" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((rowIndex) => (
                <tr key={rowIndex}>
                  <RowIndexCell rowIndex={rowIndex} />
                  {visibleColumns.map((colName, cellIndex) => (
                    <td 
                      key={cellIndex} 
                      className="p-2 border"
                      style={{ backgroundColor: getCellColor(matrixData[rowIndex][colName] as number, rowIndex, colName) }}
                    >
                      {matrixData[rowIndex][colName]}
                    </td>
                  ))}
                  <td className="p-2 border sticky right-0 bg-white z-10"></td>
                  {isHiddenColsPanelOpen && hiddenCols.map((colName, cellIndex) => (
                    <td 
                      key={`hidden-${cellIndex}`} 
                      className="p-2 border bg-gray-200"
                    >
                      {matrixData[rowIndex][colName]}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td colSpan={visibleColumns.length + 2 + (isHiddenColsPanelOpen ? hiddenCols.length : 0)} className="p-2 border sticky bottom-0 bg-white z-20">
                  <button 
                    onClick={() => setIsHiddenRowsPanelOpen(!isHiddenRowsPanelOpen)}
                    className="bg-gray-200 p-2 rounded w-full text-left"
                  >
                    {isHiddenRowsPanelOpen ? 'Hide' : 'Show'} Hidden Rows ({hiddenRows.length})
                  </button>
                </td>
              </tr>
              {isHiddenRowsPanelOpen && hiddenRows.map((rowIndex) => (
                <tr key={`hidden-${rowIndex}`} className="bg-gray-200">
                  <RowIndexCell rowIndex={rowIndex} />
                  {visibleColumns.map((colName, cellIndex) => (
                    <td 
                      key={cellIndex} 
                      className="p-2 border"
                    >
                      {matrixData[rowIndex][colName]}
                    </td>
                  ))}
                  <td className="p-2 border sticky right-0 bg-gray-200 z-10"></td>
                  {isHiddenColsPanelOpen && hiddenCols.map((colName, cellIndex) => (
                    <td 
                      key={`hidden-${cellIndex}`} 
                      className="p-2 border"
                    >
                      {matrixData[rowIndex][colName]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </DragDropContext>
      </div>
    </div>
  );
};

export default TransitionMatrix;