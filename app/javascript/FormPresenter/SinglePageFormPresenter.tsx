import React, { forwardRef, useMemo, ReactNode } from 'react';

import { getSortedFormItems } from '../Models/Form';
import FormBody from './Layouts/FormBody';
import { CommonFormFieldsFragment } from '../Models/commonFormFragments.generated';
import { ConventionForFormItemDisplay } from './ItemDisplays/FormItemDisplay';
import { parseFormItemObject } from '../FormAdmin/FormItemUtils';

export type SinglePageFormPresenterProps = {
  form: CommonFormFieldsFragment,
  children?: ReactNode,
  convention: ConventionForFormItemDisplay,
  response: any,
  responseValuesChanged: (newValues: any) => void,
};

const SinglePageFormPresenter = forwardRef(
  (
    {
      // eslint-disable-next-line react/prop-types
      form, children, convention, response, responseValuesChanged,
    }: SinglePageFormPresenterProps,
    ref,
  ) => {
    const formItems = useMemo(() => getSortedFormItems(form).map(parseFormItemObject), [form]);

    return (
      <>
        <FormBody
          convention={convention}
          ref={ref}
          formItems={formItems}
          errors={{}}
          response={response}
          responseValuesChanged={responseValuesChanged}
        />
        {children}
      </>
    );
  },
);

export default SinglePageFormPresenter;
