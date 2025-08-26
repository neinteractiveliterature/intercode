import { ReactNode } from 'react';
import { useTabs, TabList, TabBody } from '@neinteractiveliterature/litform';

import SinglePageFormPresenter from '../FormPresenter/SinglePageFormPresenter';
import { CommonFormFieldsFragment } from '../Models/commonFormFragments.generated';
import { FormResponse } from '../FormPresenter/useFormResponse';
import { ConventionForFormItemDisplay } from '../FormPresenter/ItemDisplays/FormItemDisplay';
import { UserConProfile } from '../graphqlTypes.generated';

export type UserConProfileFormProps<
  UserConProfileType extends FormResponse &
    Pick<UserConProfile, 'current_user_form_item_viewer_role' | 'current_user_form_item_writer_role'>,
> = {
  form: CommonFormFieldsFragment;
  footerContent?: ReactNode;
  userConProfile: UserConProfileType;
  onChange: React.Dispatch<React.SetStateAction<UserConProfileType>>;
  convention: ConventionForFormItemDisplay;
};

function UserConProfileForm<
  UserConProfileType extends FormResponse &
    Pick<UserConProfile, 'current_user_form_item_viewer_role' | 'current_user_form_item_writer_role'>,
>(props: UserConProfileFormProps<UserConProfileType>): React.JSX.Element {
  const formResponseValuesChanged = (newResponseValues: UserConProfileType['form_response_attrs']) => {
    props.onChange((prevUserConProfile) => ({
      ...prevUserConProfile,
      form_response_attrs: {
        ...prevUserConProfile.form_response_attrs,
        ...newResponseValues,
      },
    }));
  };

  const tabProps = useTabs([
    {
      name: 'Profile',
      id: 'profile',
      renderContent: () => (
        <SinglePageFormPresenter
          form={props.form}
          currentUserViewerRole={props.userConProfile.current_user_form_item_viewer_role}
          currentUserWriterRole={props.userConProfile.current_user_form_item_writer_role}
          convention={props.convention}
          response={props.userConProfile}
          responseValuesChanged={formResponseValuesChanged}
        />
      ),
    },
  ]);

  return (
    <div>
      <TabList {...tabProps} />
      <div className="card border-top-0">
        <div className="card-body">
          <TabBody {...tabProps} />
        </div>
        <div className="card-footer">{props.footerContent}</div>
      </div>
    </div>
  );
}

export default UserConProfileForm;
