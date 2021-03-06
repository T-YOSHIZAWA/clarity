import * as React from 'react';

import { Loading, RefreshButton } from './Utils';
import { ToggleButton, ToggleStore } from './ToggleButton';
import { observer } from 'mobx-react';
import { BlockResult } from 'casper-client-sdk';

export interface Props<T> {
  title: string;
  refresh?: () => void;
  subscribeToggleStore?: ToggleStore;
  filterToggleStore?: ToggleStore;
  filterRow?: (x: T, idx: number) => Boolean;
  filterTtl?: string;
  filterLbl?: string;
  headers: string[];
  rows: T[] | null | undefined;
  emptyMessage?: any;
  renderRow: (block: BlockResult | any, id?: number) => any;
  renderHeader?: (x: string) => any;
  footerMessage?: any;
  noHeader?: boolean;
}

@observer
export default class DataTable<T> extends React.Component<Props<T>, {}> {
  render() {
    let header = (
      <div>
        <span>{this.props.title}</span>
        {this.props.refresh && (
          <div className="float-right">
            <RefreshButton refresh={() => this.props.refresh!()} />
          </div>
        )}
        {this.props.subscribeToggleStore && (
          <div className="float-right">
            <ToggleButton
              title="Subscribe to latest changes"
              label="Live Feed"
              toggleStore={this.props.subscribeToggleStore}
              size="sm"
            />
          </div>
        )}
        {this.props.filterToggleStore && (
          <div className="float-right">
            <ToggleButton
              title={this.props.filterTtl}
              label={this.props.filterLbl}
              toggleStore={this.props.filterToggleStore}
              size="sm"
            />
          </div>
        )}
      </div>
    );

    let body = (
      <div style={{ overflow: 'auto' }}>
        {this.props.rows == null ? (
          <Loading />
        ) : this.props.rows.length === 0 ? (
          <div className="small text-muted">
            {this.props.emptyMessage || 'No data to show.'}
          </div>
        ) : (
          <table className="table table-bordered">
            {this.props.headers.length > 0 && (
              <thead>
                <tr>
                  {this.props.headers.map(label =>
                    this.props.renderHeader ? (
                      this.props.renderHeader(label)
                    ) : (
                      <th key={label}>{label}</th>
                    )
                  )}
                </tr>
              </thead>
            )}
            <tbody>
              {this.props.filterRow && this.props.filterToggleStore?.isPressed
                ? this.props.rows
                    .filter(this.props.filterRow)
                    .map(this.props.renderRow)
                : this.props.rows.map(this.props.renderRow)}
            </tbody>
          </table>
        )}
      </div>
    );

    let footer = this.props.footerMessage && (
      <div className="card-footer small text-muted">
        {this.props.footerMessage}
      </div>
    );

    if (this.props.noHeader) {
      return (
        <div>
          {body}
          {footer}
        </div>
      );
    } else {
      return (
        <div className="card mb-3">
          <div className="card-header">{header}</div>
          <div className="card-body">{body}</div>
          {footer}
        </div>
      );
    }
  }
}
