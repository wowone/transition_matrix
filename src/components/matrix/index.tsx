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

    const hue = ratio * 120;
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

  const onDragEnd = (result: any) => {
    // Implementation for drag and drop functionality
  };

  return (
    <div className="w-[900px] h-[900px] overflow-auto">
      <select 
        value={heatmapOption} 
        onChange={(e) => setHeatmapOption(e.target.value as 'global' | 'row-wise' | 'column-wise')}
      >
        <option value="global">Global</option>
        <option value="row-wise">Row-wise</option>
        <option value="column-wise">Column-wise</option>
      </select>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <table className="border-collapse">
          <thead>
            <tr>
              <th></th>
              {Object.keys(Object.values(matrixData)[0]).map((colName, index) => (
                !hiddenCols.includes(colName) && (
                  <th key={index} className="p-2 border">
                    {colName}
                    <Eye onClick={() => toggleColVisibility(colName)} className="cursor-pointer ml-1" />
                    <Pin onClick={() => toggleColPin(colName)} className="cursor-pointer ml-1" />
                    <ArrowUpDown onClick={() => sortByColumn(colName)} className="cursor-pointer ml-1" />
                  </th>
                )
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(matrixData).map(([rowIndex, row], index) => (
              !hiddenRows.includes(rowIndex) && (
                <tr key={rowIndex}>
                  <td className="p-2 border">
                    {rowIndex}
                    <Eye onClick={() => toggleRowVisibility(rowIndex)} className="cursor-pointer ml-1" />
                    <Pin onClick={() => toggleRowPin(rowIndex)} className="cursor-pointer ml-1" />
                    <ArrowUpDown onClick={() => sortByRow(rowIndex)} className="cursor-pointer ml-1" />
                  </td>
                  {Object.entries(row).map(([colName, cell], cellIndex) => (
                    !hiddenCols.includes(colName) && (
                      <td 
                        key={cellIndex} 
                        className="p-2 border"
                        style={{ backgroundColor: getCellColor(cell as number, rowIndex, colName) }}
                      >
                        {cell}
                      </td>
                    )
                  ))}
                </tr>
              )
            ))}
          </tbody>
        </table>

        {/* Hidden Rows Panel */}
        <div className="mt-4">
          <button 
            onClick={() => setIsHiddenRowsPanelOpen(!isHiddenRowsPanelOpen)}
            className="bg-gray-200 p-2 rounded"
          >
            {isHiddenRowsPanelOpen ? 'Hide' : 'Show'} Hidden Rows ({hiddenRows.length})
          </button>
          {isHiddenRowsPanelOpen && (
            <div className="mt-2 border p-2">
              {hiddenRows.map(rowIndex => (
                <div key={rowIndex} className="flex items-center justify-between p-1">
                  <span>{rowIndex}</span>
                  <EyeOff onClick={() => toggleRowVisibility(rowIndex)} className="cursor-pointer" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hidden Columns Panel */}
        <div className="mt-4">
          <button 
            onClick={() => setIsHiddenColsPanelOpen(!isHiddenColsPanelOpen)}
            className="bg-gray-200 p-2 rounded"
          >
            {isHiddenColsPanelOpen ? 'Hide' : 'Show'} Hidden Columns ({hiddenCols.length})
          </button>
          {isHiddenColsPanelOpen && (
            <div className="mt-2 border p-2">
              {hiddenCols.map(colName => (
                <div key={colName} className="flex items-center justify-between p-1">
                  <span>{colName}</span>
                  <EyeOff onClick={() => toggleColVisibility(colName)} className="cursor-pointer" />
                </div>
              ))}
            </div>
          )}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TransitionMatrix;