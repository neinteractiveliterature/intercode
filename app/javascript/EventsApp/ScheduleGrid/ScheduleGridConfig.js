import configData from '../../../../config/schedule_grid_configs.json';

class ScheduleGridConfig {
  static allConfigs = configData.map((props) => new ScheduleGridConfig(props));

  static allConfigKeys = ScheduleGridConfig.allConfigs.map((config) => config.key);

  static get = (key) => ScheduleGridConfig.allConfigs.find((config) => config.key === key);

  constructor(props) {
    Object.entries(props).forEach(([key, value]) => { this[key] = value; });
  }

  buildCategoryMatchRules() {
    const rules = [];
    this.categoryGroups.forEach((categoryGroup, targetGroupIndex) => {
      categoryGroup.match.forEach((matchRule) => {
        rules.push({ matchRule, targetGroupIndex });
      });
    });

    // sort all-remaining rules to the end so they get processed last
    return rules.sort((a, b) => {
      if (a.matchRule.allRemaining && !b.matchRule.allRemaining) {
        return 1;
      }

      if (b.matchRule.allRemaining && !a.matchRule.allRemaining) {
        return -1;
      }

      return 0;
    });
  }
}

export default ScheduleGridConfig;
