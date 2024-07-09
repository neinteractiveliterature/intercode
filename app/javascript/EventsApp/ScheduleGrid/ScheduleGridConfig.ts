import configData from '../../../../config/schedule_grid_configs.json';
import { ParseKeys } from 'i18next';

export type ScheduleGridCategoryMatchRule = {
  categoryName: string;
};
export type ScheduleGridCatchAllMatchRule = {
  allRemaining: true;
};
export type ScheduleGridMatchRule = ScheduleGridCategoryMatchRule | ScheduleGridCatchAllMatchRule;
export type ScheduleGridCategoryGroupConfig = {
  id: string;
  match: [ScheduleGridCatchAllMatchRule] | ScheduleGridCategoryMatchRule[];
  flexGrow?: boolean;
};

export function isCatchAllMatchRule(rule: ScheduleGridMatchRule): rule is ScheduleGridCatchAllMatchRule {
  return 'allRemaining' in rule;
}

export function isCategoryMatchRule(rule: ScheduleGridMatchRule): rule is ScheduleGridCategoryMatchRule {
  return 'categoryName' in rule;
}

export type ScheduleGridLegendConfig = {
  type: 'category' | 'fullness' | 'text';
  text?: string;
};

export type ScheduleGridConfig = {
  key: string;
  titlei18nKey: ParseKeys;
  icon: string;
  classifyEventsBy: 'category' | 'fullness';
  groupEventsBy: 'category' | 'room';
  showExtendedCounts?: boolean;
  showSignedUp?: boolean;
  showSignupStatusBadge?: boolean;
  showPersonalFilters?: boolean;
  categoryGroups?: ScheduleGridCategoryGroupConfig[];
  filterEmptyGroups?: boolean;
  legends?: ScheduleGridLegendConfig[];
};

export const allConfigs = configData as ScheduleGridConfig[];

export const allConfigKeys = allConfigs.map((config) => config.key);

export function getConfig(key: string): ScheduleGridConfig | undefined {
  return allConfigs.find((config) => config.key === key);
}

export function buildCategoryMatchRules(
  config: ScheduleGridConfig,
): { matchRule: ScheduleGridMatchRule; targetGroupIndex: number }[] {
  const rules: { matchRule: ScheduleGridMatchRule; targetGroupIndex: number }[] = [];
  config.categoryGroups?.forEach((categoryGroup, targetGroupIndex) => {
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
