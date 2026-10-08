import './OutputPanel.css';

export interface OutputPanelProps {
  expectedOutput: string;
  actualOutput: string;
}

export function OutputPanel({ expectedOutput, actualOutput }: OutputPanelProps) {
  return (
    <div className="bha-output-panel" role="region" aria-label="Terminal Output Comparison">
      <div className="bha-terminal bha-terminal--actual">
        <div className="bha-terminal__header">
          <span className="bha-terminal__badge bha-terminal__badge--actual">Actual (Buggy)</span>
          <span className="bha-terminal__dots" aria-hidden="true">
            <span className="dot dot--red" />
            <span className="dot dot--yellow" />
            <span className="dot dot--green" />
          </span>
        </div>
        <pre className="bha-terminal__content">
          <code>{actualOutput}</code>
        </pre>
      </div>

      <div className="bha-terminal bha-terminal--expected">
        <div className="bha-terminal__header">
          <span className="bha-terminal__badge bha-terminal__badge--expected">Expected</span>
          <span className="bha-terminal__dots" aria-hidden="true">
            <span className="dot dot--red" />
            <span className="dot dot--yellow" />
            <span className="dot dot--green" />
          </span>
        </div>
        <pre className="bha-terminal__content">
          <code>{expectedOutput}</code>
        </pre>
      </div>
    </div>
  );
}
