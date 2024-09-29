// File: src/components/matrix/index.tsx

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Eye, Pin, ArrowUpDown } from 'lucide-react';

interface TransitionMatrixProps {
  data: Record<string, Record<string, any>>;
}

const TransitionMatrix: React.FC<TransitionMatrixProps> = ({ data }) => {
  const [tableData, setTableData] = useState(data);
  const [hiddenRows, setHiddenRows] = useState<string[]>([]);
  const [hiddenCols, setHiddenCols] = useState<string[]>([]);
  const [pinnedRows, setPinnedRows] = useState<string[]>([]);
  const [pinnedCols, setPinnedCols] = useState<string[]>([]);
  const [heatmapOption, setHeatmapOption] = useState<'global' | 'row-wise' | 'column-wise'>('global');

  const toggleRowVisibility = (rowIndex: string) => {
    // Implementation for toggling row visibility
  };

  const toggleColVisibility = (colName: string) => {
    // Implementation for toggling column visibility
  };

  const toggleRowPin = (rowIndex: string) => {
    // Implementation for toggling row pin
  };

  const toggleColPin = (colName: string) => {
    // Implementation for toggling column pin
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

  const applyHeatmap = () => {
    // Implementation for applying heatmap
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
              {Object.keys(Object.values(tableData)[0]).map((colName, index) => (
                <th key={index} className="p-2 border">
                  {colName}
                  <div className="flex">
                    <Eye onClick={() => toggleColVisibility(colName)} className="cursor-pointer" />
                    <Pin onClick={() => toggleColPin(colName)} className="cursor-pointer" />
                    <ArrowUpDown onClick={() => sortByColumn(colName)} className="cursor-pointer" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <Droppable droppableId="table-body">
            {(provided) => (
              <tbody {...provided.droppableProps} ref={provided.innerRef}>
                {Object.entries(tableData).map(([rowIndex, row], index) => (
                  <Draggable key={rowIndex} draggableId={rowIndex} index={index}>
                    {(provided) => (
                      <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <td className="p-2 border">
                          {rowIndex}
                          <div className="flex">
                            <Eye onClick={() => toggleRowVisibility(rowIndex)} className="cursor-pointer" />
                            <Pin onClick={() => toggleRowPin(rowIndex)} className="cursor-pointer" />
                            <ArrowUpDown onClick={() => sortByRow(rowIndex)} className="cursor-pointer" />
                          </div>
                        </td>
                        {Object.values(row).map((cell, cellIndex) => (
                          <td key={cellIndex} className="p-2 border">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            )}
          </Droppable>
        </table>
      </DragDropContext>
    </div>
  );
};

export default TransitionMatrix;