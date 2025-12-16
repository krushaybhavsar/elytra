import React, { useEffect } from 'react';
import NotebookCell, { CellData, CellResult } from './NotebookCell';
import { TabData } from '../TabViewContainer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { dataSource } from '@/services/service.config';

interface NotebookTabViewProps {
  key: string;
  tabData: TabData;
  setTabData: (newTabData: TabData) => void;
  connectionId: string;
}

export interface NotebookTabData {
  cells: string[];
  cellDataMap: Map<string, CellData>;
}

const NotebookTabView = (props: NotebookTabViewProps) => {
  useEffect(() => {
    if (!props.tabData.data) {
      props.setTabData({
        ...props.tabData,
        data: {
          cells: [],
          cellDataMap: new Map<string, CellData>(),
        },
      });
    }
  }, [props.tabData, props.setTabData]);

  const setCellData = (newCellData: CellData) => {
    if (!props.tabData.data) return;
    const updatedCellDataMap = new Map(props.tabData.data.cellDataMap);
    updatedCellDataMap.set(newCellData.id, newCellData);
    props.setTabData({
      ...props.tabData,
      data: {
        ...props.tabData.data,
        cellDataMap: updatedCellDataMap,
      },
    });
  };

  const setCells = (newCells: string[]) => {
    if (!props.tabData.data) return;
    props.setTabData({
      ...props.tabData,
      data: {
        ...props.tabData.data,
        cells: newCells,
      },
    });
  };

  const createNewCell = () => {
    const baseData = props.tabData.data ?? {
      cells: [],
      cellDataMap: new Map<string, CellData>(),
    };
    const newCellId = crypto.randomUUID();
    const updatedCells = [...baseData.cells, newCellId];
    const updatedCellDataMap = new Map(baseData.cellDataMap);

    const initialResult: CellResult = { loading: false };

    updatedCellDataMap.set(newCellId, {
      id: newCellId,
      data: '',
      result: initialResult,
    });

    props.setTabData({
      ...props.tabData,
      data: {
        cells: updatedCells,
        cellDataMap: updatedCellDataMap,
      },
    });
  };

  const removeCell = (cellId: string) => {
    if (!props.tabData.data) return;
    const updatedCells = props.tabData.data.cells.filter((id) => id !== cellId);
    const updatedCellDataMap = new Map(props.tabData.data.cellDataMap);
    updatedCellDataMap.delete(cellId);

    props.setTabData({
      ...props.tabData,
      data: {
        cells: updatedCells,
        cellDataMap: updatedCellDataMap,
      },
    });
  };

  const moveCell = (cellId: string, direction: 'up' | 'down') => {
    if (!props.tabData.data) return;
    const index = props.tabData.data.cells.indexOf(cellId);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= props.tabData.data.cells.length) return;

    const newCells = [...props.tabData.data.cells];
    const [removed] = newCells.splice(index, 1);
    newCells.splice(targetIndex, 0, removed);
    setCells(newCells);
  };

  const updateCellContent = (cellId: string, content: string) => {
    if (!props.tabData.data) return;
    const existing = props.tabData.data.cellDataMap.get(cellId);
    const next: CellData = {
      id: cellId,
      data: content,
      result: existing?.result ?? { loading: false },
    };
    setCellData(next);
  };

  const updateCellResult = (cellId: string, result: CellResult) => {
    if (!props.tabData.data) return;
    const existing = props.tabData.data.cellDataMap.get(cellId);
    if (!existing) return;

    setCellData({
      ...existing,
      result,
    });
  };

  const runCell = async (cellId: string) => {
    if (!props.tabData.data) return;
    const cell = props.tabData.data.cellDataMap.get(cellId);
    if (!cell) return;

    updateCellResult(cellId, { loading: true });
    try {
      const res = await dataSource.executeQuery(props.connectionId, cell.data);
      updateCellResult(cellId, { loading: false, result: res });
    } catch (error: any) {
      updateCellResult(cellId, {
        loading: false,
        result: {
          success: false,
          message: error?.message ?? 'Failed to execute query.',
        },
      });
    }
  };

  const runCellAndBelow = async (cellId: string) => {
    if (!props.tabData.data) return;
    const startIndex = props.tabData.data.cells.indexOf(cellId);
    if (startIndex === -1) return;

    for (let i = startIndex; i < props.tabData.data.cells.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      await runCell(props.tabData.data.cells[i]);
    }
  };

  return (
    <div className='absolute h-full w-full overflow-y-auto flex flex-col'>
      <div
        className='relative flex flex-col gap-4 p-2'
        // Force remount of all cells when ordering/ids change to keep Monaco stable
        key={(props.tabData.data?.cells || []).join('-')}
      >
        {props.tabData.data && props.tabData.data.cells.length > 0 ? (
          props.tabData.data.cells.map((cellId: string, index) => (
            <NotebookCell
              key={cellId}
              index={index}
              cellData={props.tabData.data!.cellDataMap.get(cellId)}
              onChangeContent={(value) => updateCellContent(cellId, value)}
              onRunCell={() => runCell(cellId)}
              onRunCellAndBelow={() => runCellAndBelow(cellId)}
              onDelete={() => removeCell(cellId)}
              onMoveUp={() => moveCell(cellId, 'up')}
              onMoveDown={() => moveCell(cellId, 'down')}
            />
          ))
        ) : (
          <div className='text-sm text-muted-foreground px-2 py-4'>
            No cells yet. Add a cell to start writing queries.
          </div>
        )}
        <div className='pt-2'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='flex items-center gap-2'
            onClick={createNewCell}
          >
            <Plus className='h-4 w-4' />
            Add cell
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotebookTabView;
