import { NotificationEventKey } from 'graphqlTypes.generated';

export function getNotificationEventKey(categoryKey: string, eventKey: string): NotificationEventKey {
  return `${categoryKey.toUpperCase()}_${eventKey.toUpperCase()}` as NotificationEventKey;
}
