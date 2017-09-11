///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

import _ from 'lodash';
import {QueryCtrl} from 'app/plugins/sdk';
import './css/query_editor.css!';

export class AzureMonitorQueryCtrl extends QueryCtrl {
  static templateUrl = 'partials/query.editor.html';

  defaultDropdownValue = 'select';

  defaults = {
    queryType: 'Azure Monitor',
    azureMonitor: {
      resourceGroup: this.defaultDropdownValue,
      metricDefinition: this.defaultDropdownValue,
      resourceName: this.defaultDropdownValue,
      metricName: this.defaultDropdownValue,
      timeGrain: 1,
      timeGrainUnit: 'hour'
    },
    appInsights: {
      metricName: this.defaultDropdownValue,
      groupBy: '',
    }
  };

  /** @ngInject **/
  constructor($scope, $injector) {
    super($scope, $injector);

    _.defaultsDeep(this.target, this.defaults);
  }

  /* Azure Monitor Section */
  getResourceGroups(query) {
    if (this.target.queryType !== 'Azure Monitor' || !this.datasource.azureMonitorQueryBuilder.isConfigured()) {
      return;
    }

    return this.datasource.metricFindQuery('?api-version=2017-06-01');
  }

  getMetricDefinitions(query) {
    if (this.target.queryType !== 'Azure Monitor' || !this.target.azureMonitor.resourceGroup
      || this.target.azureMonitor.resourceGroup === this.defaultDropdownValue) {
      return;
    }
    return this.datasource.getMetricDefinitions(this.target.azureMonitor.resourceGroup);
  }

  getResourceNames(query) {
    if (this.target.queryType !== 'Azure Monitor' || !this.target.azureMonitor.resourceGroup
      || this.target.azureMonitor.resourceGroup === this.defaultDropdownValue || !this.target.azureMonitor.metricDefinition
      || this.target.azureMonitor.metricDefinition === this.defaultDropdownValue) {
      return;
    }

    return this.datasource.getResourceNames(this.target.azureMonitor.resourceGroup, this.target.azureMonitor.metricDefinition);
  }

  getMetricNames(query) {
    if (this.target.queryType !== 'Azure Monitor' || !this.target.azureMonitor.resourceGroup
      || this.target.azureMonitor.resourceGroup === this.defaultDropdownValue || !this.target.azureMonitor.metricDefinition
      || this.target.azureMonitor.metricDefinition === this.defaultDropdownValue || !this.target.azureMonitor.resourceName
      || this.target.azureMonitor.resourceName === this.defaultDropdownValue) {
      return;
    }

    return this.datasource.getMetricNames(
      this.target.azureMonitor.resourceGroup,
      this.target.azureMonitor.metricDefinition,
      this.target.azureMonitor.resourceName
    );
  }

  onResourceGroupChange() {
    this.target.azureMonitor.metricDefinition = this.defaultDropdownValue;
    this.target.azureMonitor.resourceName = this.defaultDropdownValue;
    this.target.azureMonitor.metricName = this.defaultDropdownValue;
  }

  onMetricDefinitionChange() {
    this.target.azureMonitor.resourceName = this.defaultDropdownValue;
    this.target.azureMonitor.metricName = this.defaultDropdownValue;
  }

  onResourceNameChange() {
    this.target.azureMonitor.metricName = this.defaultDropdownValue;
  }

  onMetricNameChange() {
    if (!this.target.azureMonitor.metricName || this.target.azureMonitor.metricName === this.defaultDropdownValue) {
      return;
    }

    return this.datasource.getAggregations(
      this.target.azureMonitor.resourceGroup,
      this.target.azureMonitor.metricDefinition,
      this.target.azureMonitor.resourceName,
      this.target.azureMonitor.metricName
    ).then(aggData => {
      this.target.azureMonitor.aggOptions = aggData.supportedAggTypes;
      this.target.azureMonitor.aggregation = aggData.primaryAggType;
      return this.refresh();
    });
  }

  /* Application Insights Section */
  getAppInsightsMetricNames() {
    return this.datasource.getAppInsightsMetricNames();
  }

  onAppInsightsMetricNameChange() {
    if (!this.target.appInsights.metricName || this.target.appInsights.metricName === this.defaultDropdownValue) {
      return;
    }

    return this.datasource.getAppInsightsMetricMetadata(this.target.appInsights.metricName)
      .then(aggData => {
        this.target.appInsights.aggOptions = aggData.supportedAggTypes;
        this.target.appInsights.groupByOptions = aggData.supportedGroupBy;
        this.target.appInsights.aggregation = aggData.primaryAggType;
        return this.refresh();
      });
  }
}
