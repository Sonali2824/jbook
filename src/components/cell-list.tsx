import { Fragment } from 'react';
import { useTypedSelector } from '../hooks/use-typed-selector';
import CellListItem from './cell-list-item';
import AddCell from './add-cell';

const CellList: React.FC = () => {
  const cells = useTypedSelector((state) =>
    state.cells?.order.map((id) => state.cells?.data[id])
  );
  // @ts-ignore
  const renderedCells = cells?.map((cell) => (
    <Fragment key={cell?.id}>
      <CellListItem cell={cell as any} />
      <AddCell previousCellId={cell?.id as any} />
    </Fragment>
  ));

  return (
    <div className="cell-list">
      <AddCell forceVisible={cells?.length === 0} previousCellId={null} />
      {renderedCells}
    </div>
  );
};

export default CellList;
