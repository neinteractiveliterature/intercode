import { assertNever } from 'assert-never';
import classNames from 'classnames';
import React from 'react';
import { TFunction, useTranslation } from 'react-i18next';

import { TypedFormItem } from '../../FormAdmin/FormItemUtils';
import { FormItemRole, FormType } from '../../graphqlTypes.generated';

export const FORM_ITEM_ROLE_COLOR_CLASSES: Record<FormItemRole, string> = {
  normal: '',
  confirmed_attendee: 'bg-info bg-opacity-50',
  team_member: 'bg-success bg-opacity-25',
  admin: 'bg-warning',
};

export function describeFormItemRole(
  purpose: 'visibility' | 'writeability',
  role: FormItemRole,
  formTypeIdentifier: FormType,
  t: TFunction,
): string {
  switch (role) {
    case FormItemRole.Admin:
      return t('forms.roles.admin', 'Admin only');
    case FormItemRole.ConfirmedAttendee:
      return t('forms.roles.confirmed_attendee', 'Confirmed attendees, team members, and admins');
    case FormItemRole.TeamMember:
      return t('forms.roles.team_member', 'Team members and admins');
    case FormItemRole.Normal:
      switch (formTypeIdentifier) {
        case FormType.Event:
          if (purpose === 'visibility') {
            return t('forms.roles.public', 'Public');
          }
          return t('forms.roles.team_member', 'Team members and admins');
        case FormType.EventProposal:
          return t('forms.roles.proposer', 'Event proposer, reviewers, and admins');
        case FormType.UserConProfile:
          return t('forms.roles.user', 'User and admins');
        default:
          assertNever(formTypeIdentifier);
      }
      break;
    default:
      assertNever(role);
  }

  return "If you're seeing this message something has gone very wrong";
}

export function getVisibilityDisclosureText(
  formItem: TypedFormItem,
  formTypeIdentifier: FormType,
  t: TFunction,
): string | undefined {
  if (formItem.visibility === FormItemRole.Normal) {
    return undefined;
  }

  return t('forms.roles.visibilityDisclosure', 'Visible to: {{ roleDescription }}', {
    roleDescription: describeFormItemRole('visibility', formItem.visibility, formTypeIdentifier, t),
  });
}

export type VisibilityDisclosureTextProps = {
  formItem: TypedFormItem;
  formTypeIdentifier: FormType;
};

export function VisibilityDisclosureText({
  formItem,
  formTypeIdentifier,
}: VisibilityDisclosureTextProps): JSX.Element {
  const { t } = useTranslation();

  if (formItem.visibility === FormItemRole.Normal) {
    return <></>;
  }

  return (
    <div>
      <small>{getVisibilityDisclosureText(formItem, formTypeIdentifier, t)}</small>
    </div>
  );
}

export type VisibilityDisclosureCardProps = {
  formItem: TypedFormItem;
  formTypeIdentifier: FormType;
  children: React.ReactNode;
};

export function VisibilityDisclosureCard({
  formItem,
  formTypeIdentifier,
  children,
}: VisibilityDisclosureCardProps): JSX.Element {
  if (formItem.visibility === FormItemRole.Normal) {
    return <>{children}</>;
  }

  return (
    <div className={classNames('card', FORM_ITEM_ROLE_COLOR_CLASSES[formItem.visibility])}>
      <div className="card-body">{children}</div>
      <div className="card-footer">
        <VisibilityDisclosureText formItem={formItem} formTypeIdentifier={formTypeIdentifier} />
      </div>
    </div>
  );
}
