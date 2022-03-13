import './code-cell.css';
import { useEffect } from 'react';
import CodeEditor from './code-editor';
import Preview from './preview';
import Resizable from './resizable';
import { Cell } from '../state';
import { useActions } from '../hooks/use-actions';
import { useTypedSelector } from '../hooks/use-typed-selector';
import { useCumulativeCode } from '../hooks/use-cumulative-code';

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector((state) => state?.bundles?.[cell?.id]);
  const cumulativeCode = useCumulativeCode(cell.id);
  useEffect(() => {
    if (!bundle) {
      createBundle(cell.id, cumulativeCode);
      return;
    }
    //no timer is set, only create bundle
    const timer = setTimeout(async () => {
      createBundle(cell.id, cumulativeCode);
    }, 750);
    //re create a bundle
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cumulativeCode, cell.id, createBundle]); //dependency array
  //when bundle changes -> use effect
  //every 750s new version of createBundle is created
  //useAction() cause this, hence use the following
  //dispatch changes --> runs useMemo --> binds actions only once
  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: 'calc(100% - 10px)',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        {/* wrapper to have a bg color-->white, not affected by fadeIn */}
        <div className="progress-wrapper">
          {/* if bundle is undefined or bundle is loading 
          progress is progress bar*/}
          {!bundle || bundle.loading ? (
            <div className="progress-cover">
              <progress className="progress is-small is-primary" max="100">
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} err={bundle.err} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
