import configData from '../../../../config/schedule_grid_configs.json';

export type ScheduleGridCategoryMatchRule = {
  categoryName: string,
};
export type ScheduleGridCatchAllMatchRule = {
  allRemaining: true,
};
export type ScheduleGridMatchRule = ScheduleGridCategoryMatchRule | ScheduleGridCatchAllMatchRule;
export type ScheduleGridCategoryGroupConfig = {
  id: string,
  match: [ScheduleGridCatchAllMatchRule] | ScheduleGridCategoryMatchRule[],
  flexGrow?: boolean,
};

export function isCatchAllMatchRule(
  rule: ScheduleGridMatchRule,
): rule is ScheduleGridCatchAllMatchRule {
  return 'allRemaining' in rule;
}

export function isCategoryMatchRule(
  rule: ScheduleGridMatchRule,
): rule is ScheduleGridCategoryMatchRule {
  return 'categoryName' in rule;
}

export type ScheduleGridLegendConfig = {
  type: 'category' | 'fullness' | 'text',
  text?: string,
};

export type ScheduleGridConfigData = {
  key: string,
  basename: string,
  title: string,
  classifyEventsBy: 'category' | 'fullness',
  groupEventsBy: 'category' | 'room',
  showExtendedCounts?: boolean,
  showSignedUp?: boolean,
  showSignupStatusBadge?: boolean,
  showPersonalFilters?: boolean,
  categoryGroups?: ScheduleGridCategoryGroupConfig[],
  filterEmptyGroups?: boolean,
  legends?: ScheduleGridLegendConfig[],
};

class ScheduleGridConfig {
  key: string;

  basename: string;

  title: string;

  classifyEventsBy: 'category' | 'fullness';

  groupEventsBy: 'category' | 'room';

  showExtendedCounts?: boolean;

  showSignedUp?: boolean;

  showSignupStatusBadge?: boolean;

  showPersonalFilters?: boolean;

  categoryGroups: ScheduleGridCategoryGroupConfig[];

  filterEmptyGroups?: boolean;

  legends?: ScheduleGridLegendConfig[];

  static allConfigs = (configData as ScheduleGridConfigData[])
    .map((props) => new ScheduleGridConfig(props));

  static allConfigKeys = ScheduleGridConfig.allConfigs.map((config) => config.key);

  static get = (key: string) => ScheduleGridConfig.allConfigs.find((config) => config.key === key);

  constructor(props: ScheduleGridConfigData) {
    this.categoryGroups = [];
    Object.entries(props).forEach(([key, value]) => { this[key] = value; });
  }

  buildCategoryMatchRules() {
    const rules: { matchRule: ScheduleGridMatchRule, targetGroupIndex: number }[] = [];
    this.categoryGroups.forEach((categoryGroup, targetGroupIndex) => {
      categoryGroup.match.forEach((matchRule: ScheduleGridMatchRule) => {
        rules.push({ matchRule, targetGroupIndex });
      });
    });

    // sort all-remaining rules to the end so they get processed last
    return rules.sort((a, b) => {
      if (isCatchAllMatchRule(a.matchRule) && !isCatchAllMatchRule(b.matchRule)) {
        return 1;
      }

      if (isCatchAllMatchRule(b.matchRule) && !isCatchAllMatchRule(a.matchRule)) {
        return -1;
      }

      return 0;
    });
  }
}

export default ScheduleGridConfig;
